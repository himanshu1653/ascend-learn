
-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Difficulty enum
CREATE TYPE public.difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Learning modules
CREATE TABLE public.learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'BookOpen',
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  category TEXT NOT NULL DEFAULT 'General',
  points_reward INTEGER NOT NULL DEFAULT 50,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules viewable by authenticated" ON public.learning_modules FOR SELECT TO authenticated USING (true);

-- Quiz questions
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  points INTEGER NOT NULL DEFAULT 10,
  order_index INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Questions viewable by authenticated" ON public.quiz_questions FOR SELECT TO authenticated USING (true);

-- Quiz attempts
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  points_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress per module
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT false,
  best_score INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  unlocked BOOLEAN NOT NULL DEFAULT true,
  recommended_difficulty difficulty_level NOT NULL DEFAULT 'beginner',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '🏆',
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges viewable by authenticated" ON public.badges FOR SELECT TO authenticated USING (true);

-- User badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Seed badges
INSERT INTO public.badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first quiz', '🎯', 'quizzes_completed', 1),
('Quiz Master', 'Complete 5 quizzes', '📚', 'quizzes_completed', 5),
('Century Club', 'Earn 100 points', '💯', 'total_points', 100),
('High Scorer', 'Earn 500 points', '⭐', 'total_points', 500),
('Legend', 'Earn 1000 points', '🏆', 'total_points', 1000),
('Streak Starter', 'Maintain a 3-day streak', '🔥', 'current_streak', 3),
('On Fire', 'Maintain a 7-day streak', '🔥', 'current_streak', 7),
('Perfect Score', 'Score 100% on any quiz', '💎', 'perfect_score', 1),
('Knowledge Seeker', 'Complete 10 quizzes', '🧠', 'quizzes_completed', 10),
('Unstoppable', 'Maintain a 30-day streak', '🚀', 'current_streak', 30);

-- Seed learning modules
INSERT INTO public.learning_modules (title, description, icon, difficulty, category, points_reward, order_index) VALUES
('HTML Basics', 'Learn the fundamentals of HTML markup', 'Code', 'beginner', 'Web Development', 50, 1),
('CSS Styling', 'Master CSS for beautiful web pages', 'Palette', 'beginner', 'Web Development', 50, 2),
('JavaScript Fundamentals', 'Core JavaScript concepts and syntax', 'Braces', 'beginner', 'Programming', 75, 3),
('React Essentials', 'Build UIs with React components', 'Layers', 'intermediate', 'Web Development', 100, 4),
('Python Basics', 'Introduction to Python programming', 'Terminal', 'beginner', 'Programming', 50, 5),
('Data Structures', 'Arrays, linked lists, trees, and graphs', 'Network', 'intermediate', 'Computer Science', 100, 6),
('Algorithms', 'Sorting, searching, and optimization', 'Cpu', 'advanced', 'Computer Science', 150, 7),
('Database Design', 'SQL and relational database concepts', 'Database', 'intermediate', 'Backend', 100, 8);

-- Seed quiz questions for HTML Basics
INSERT INTO public.quiz_questions (module_id, question, options, correct_answer, explanation, difficulty, points, order_index)
SELECT m.id, v.question, v.options::jsonb, v.correct_answer, v.explanation, v.difficulty::difficulty_level, v.points, v.order_idx
FROM public.learning_modules m,
(VALUES
  ('HTML Basics', 'What does HTML stand for?', '["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Language","Home Tool Markup Language"]', 0, 'HTML stands for Hyper Text Markup Language', 'beginner', 10, 1),
  ('HTML Basics', 'Which tag is used for the largest heading?', '["<h6>","<heading>","<h1>","<head>"]', 2, '<h1> defines the largest heading', 'beginner', 10, 2),
  ('HTML Basics', 'Which element creates a hyperlink?', '["<link>","<a>","<href>","<url>"]', 1, 'The <a> tag creates hyperlinks', 'beginner', 10, 3),
  ('HTML Basics', 'What inserts a line break?', '["<break>","<lb>","<br>","<newline>"]', 2, '<br> is for line breaks', 'beginner', 10, 4),
  ('HTML Basics', 'Which attribute specifies alt text for images?', '["title","src","alt","description"]', 2, 'alt provides alternative text', 'beginner', 10, 5),
  ('CSS Styling', 'What does CSS stand for?', '["Creative Style Sheets","Cascading Style Sheets","Computer Style Sheets","Colorful Style Sheets"]', 1, 'CSS = Cascading Style Sheets', 'beginner', 10, 1),
  ('CSS Styling', 'Which property changes text color?', '["font-color","text-color","color","foreground"]', 2, 'The color property sets text color', 'beginner', 10, 2),
  ('CSS Styling', 'How select element with id "demo"?', '["#demo",".demo","demo","*demo"]', 0, 'Use # for id selectors', 'beginner', 10, 3),
  ('CSS Styling', 'Which property changes background color?', '["bgcolor","color","background-color","back-color"]', 2, 'background-color changes background', 'beginner', 10, 4),
  ('CSS Styling', 'Default value of position?', '["relative","fixed","absolute","static"]', 3, 'Default position is static', 'intermediate', 15, 5),
  ('JavaScript Fundamentals', 'Which keyword declares a constant?', '["var","let","const","final"]', 2, 'const declares constants', 'beginner', 10, 1),
  ('JavaScript Fundamentals', 'Output of typeof null?', '["null","undefined","object","number"]', 2, 'typeof null returns "object"', 'intermediate', 15, 2),
  ('JavaScript Fundamentals', 'Which method adds to end of array?', '["append()","push()","add()","insert()"]', 1, 'push() adds to array end', 'beginner', 10, 3),
  ('JavaScript Fundamentals', 'What does === compare?', '["Value only","Type only","Value and type","Reference only"]', 2, '=== compares value and type', 'beginner', 10, 4),
  ('JavaScript Fundamentals', 'What is a closure?', '["Function with access to parent scope","A closed function","A private method","A loop structure"]', 0, 'Closure retains access to parent scope', 'advanced', 20, 5),
  ('React Essentials', 'What is JSX?', '["A database","A syntax extension for JS","A CSS framework","A testing library"]', 1, 'JSX lets you write HTML-like code in JS', 'beginner', 10, 1),
  ('React Essentials', 'Which hook manages state?', '["useEffect","useContext","useState","useReducer"]', 2, 'useState manages state', 'beginner', 10, 2),
  ('React Essentials', 'What is the virtual DOM?', '["A browser feature","A lightweight copy of the real DOM","A CSS tool","A database"]', 1, 'React uses virtual DOM for efficiency', 'intermediate', 15, 3),
  ('React Essentials', 'Which hook handles side effects?', '["useState","useMemo","useEffect","useCallback"]', 2, 'useEffect handles side effects', 'beginner', 10, 4),
  ('React Essentials', 'What is prop drilling?', '["Passing props through many layers","Drilling into DOM","A testing technique","Creating props dynamically"]', 0, 'Prop drilling passes props through layers', 'intermediate', 15, 5),
  ('Python Basics', 'How to print in Python?', '["echo()","console.log()","print()","printf()"]', 2, 'print() outputs text', 'beginner', 10, 1),
  ('Python Basics', 'Which keyword defines a function?', '["function","func","def","define"]', 2, 'def defines functions', 'beginner', 10, 2),
  ('Python Basics', 'What is a list?', '["Immutable sequence","Ordered mutable collection","A dictionary","A set"]', 1, 'Lists are ordered mutable collections', 'beginner', 10, 3),
  ('Python Basics', 'How to create a comment?', '["// comment","/* comment */","# comment","-- comment"]', 2, '# for comments in Python', 'beginner', 10, 4),
  ('Python Basics', 'What does len() do?', '["Returns length","Creates list","Deletes item","Sorts list"]', 0, 'len() returns item count', 'beginner', 10, 5),
  ('Data Structures', 'Time complexity of array access by index?', '["O(n)","O(log n)","O(1)","O(n²)"]', 2, 'Array index access is O(1)', 'intermediate', 15, 1),
  ('Data Structures', 'Which uses LIFO?', '["Queue","Stack","Array","Tree"]', 1, 'Stack uses Last In First Out', 'beginner', 10, 2),
  ('Data Structures', 'What is a binary tree?', '["Max 2 children per node","A tree with 2 nodes","A sorted array","A linked list"]', 0, 'Binary tree: max 2 children per node', 'intermediate', 15, 3),
  ('Data Structures', 'Best for key-value pairs?', '["Array","Stack","Hash Map","Queue"]', 2, 'Hash maps for key-value storage', 'intermediate', 15, 4),
  ('Data Structures', 'Advantage of linked list over array?', '["Faster access","Dynamic size","Less memory","Sorted data"]', 1, 'Linked lists grow dynamically', 'intermediate', 15, 5),
  ('Algorithms', 'Time complexity of binary search?', '["O(n)","O(n²)","O(log n)","O(1)"]', 2, 'Binary search is O(log n)', 'intermediate', 15, 1),
  ('Algorithms', 'Fastest average sorting algorithm?', '["Bubble Sort","Quick Sort","Selection Sort","Insertion Sort"]', 1, 'Quick Sort averages O(n log n)', 'intermediate', 15, 2),
  ('Algorithms', 'What is recursion?', '["A loop","A function calling itself","A data structure","An operator"]', 1, 'Recursion = function calls itself', 'beginner', 10, 3),
  ('Algorithms', 'Big O notation is used for?', '["Memory usage","Algorithm efficiency","Error handling","Code formatting"]', 1, 'Big O describes algorithm efficiency', 'beginner', 10, 4),
  ('Algorithms', 'What is dynamic programming?', '["Real-time coding","Breaking problems into overlapping subproblems","A language","Random algorithms"]', 1, 'DP breaks problems into subproblems', 'advanced', 20, 5),
  ('Database Design', 'What does SQL stand for?', '["Structured Query Language","Simple Query Language","Standard Query Logic","System Query Language"]', 0, 'SQL = Structured Query Language', 'beginner', 10, 1),
  ('Database Design', 'What is a primary key?', '["Any column","Unique identifier for each row","A foreign table","An index"]', 1, 'Primary key uniquely identifies rows', 'beginner', 10, 2),
  ('Database Design', 'What is normalization?', '["Making data bigger","Organizing to reduce redundancy","Deleting data","Encrypting data"]', 1, 'Normalization reduces redundancy', 'intermediate', 15, 3),
  ('Database Design', 'Which JOIN returns all rows from both tables?', '["INNER JOIN","LEFT JOIN","RIGHT JOIN","FULL OUTER JOIN"]', 3, 'FULL OUTER JOIN returns all rows', 'intermediate', 15, 4),
  ('Database Design', 'What is an index used for?', '["Storing data","Speeding up queries","Creating tables","Deleting rows"]', 1, 'Indexes speed up queries', 'intermediate', 15, 5)
) AS v(module_title, question, options, correct_answer, explanation, difficulty, points, order_idx)
WHERE m.title = v.module_title;
