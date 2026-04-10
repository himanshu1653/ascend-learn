
-- Add more subjects for Science and Commerce
INSERT INTO public.learning_modules (title, description, icon, difficulty, category, points_reward, order_index) VALUES
('Rotational Dynamics', 'Physics 12th Standard - Maharashtra Board', 'Physics', 'intermediate', 'Physics', 100, 10),
('Mechanical Properties of Fluids', 'Physics 12th Standard - Maharashtra Board', 'Physics', 'intermediate', 'Physics', 100, 11),
('Units & Measurements', 'Physics 11th Standard - Maharashtra Board', 'Physics', 'beginner', 'Physics', 75, 12),
('Partnership Final Accounts', 'Bookkeeping & Accountancy - 12th Standard', 'Accounts', 'intermediate', 'Accounts', 100, 13),
('Principles of Management', 'Organization of Commerce & Management (OCM)', 'OCM', 'beginner', 'OCM', 50, 14),
('Introduction to Economics', 'Economics - 11th Standard', 'Economics', 'beginner', 'Economics', 50, 15),
('Issue of Shares', 'Secretarial Practice (SP)', 'SP', 'intermediate', 'SP', 100, 16);

-- Add comprehensive quiz questions (5 per module) for all new modules
INSERT INTO public.quiz_questions (module_id, question, options, correct_answer, explanation, difficulty, points, order_index)
SELECT m.id, v.question, v.options::jsonb, v.correct_answer, v.explanation, v.difficulty::difficulty_level, v.points, v.order_idx
FROM public.learning_modules m,
(VALUES
  -- Physics 12th: Rotational Dynamics
  ('Rotational Dynamics', 'What is the relation between linear velocity (v) and angular velocity (ω)?', '["v = ωr","v = ω/r","v = r/ω","v = ω²r"]', 0, 'The relation between linear velocity and angular velocity is v = rω, where r is the radius of the circular path.', 'beginner', 10, 1),
  ('Rotational Dynamics', 'A particle performs uniform circular motion. Its acceleration is directed towards:', '["The center","The tangent","Backwards","Upwards"]', 0, 'In Uniform Circular Motion (UCM), the centripetal acceleration is always directed towards the center.', 'beginner', 10, 2),
  ('Rotational Dynamics', 'What is the SI unit of Moment of Inertia?', '["kg m","kg m²","kg/m","kg m/s"]', 1, 'Moment of Inertia (I) is defined as the sum of mr², so its unit is kg m².', 'beginner', 10, 3),
  ('Rotational Dynamics', 'Banking of roads is necessary to:', '["Make it look good","Reduce friction","Prevent skidding at high speeds","Increase speed of vehicles"]', 2, 'Banking providing the necessary centripetal force for a vehicle to take a turn at higher speeds without relying solely on friction.', 'intermediate', 15, 4),
  ('Rotational Dynamics', 'The period of a conical pendulum depends on:', '["Mass of bob","Length of string","Both mass and length","Neither mass nor length"]', 1, 'The period of a conical pendulum depends on the length of the string and the angle of inclination, but is independent of the mass of the bob.', 'advanced', 20, 5),
  
  -- Physics 12th: Mechanical Properties of Fluids
  ('Mechanical Properties of Fluids', 'The property by virtue of which a liquid opposes relative motion between its layers is called:', '["Surface Tension","Viscosity","Density","Buoyancy"]', 1, 'Viscosity is the internal friction of a fluid that opposes relative motion between its layers.', 'intermediate', 10, 1),
  ('Mechanical Properties of Fluids', 'What is the shape of the meniscus for water in a clean glass capillary tube?', '["Convex","Concave","Flat","Cylindrical"]', 1, 'Water in a clean glass tube forms a concave meniscus because adhesive forces (water-glass) are stronger than cohesive forces (water-water).', 'intermediate', 10, 2),
  ('Mechanical Properties of Fluids', 'Bernoulli''s principle is based on the law of conservation of:', '["Mass","Energy","Momentum","Charge"]', 1, 'Bernoulli''s principle is a statement of the law of conservation of energy for flowing fluids.', 'intermediate', 15, 3),
  ('Mechanical Properties of Fluids', 'Surface tension of a liquid _______ with increase in temperature.', '["Increases","Decreases","Remains same","First increases then decreases"]', 1, 'As temperature increases, the kinetic energy of molecules increases, weakening the cohesive forces and thus decreasing surface tension.', 'intermediate', 10, 4),
  ('Mechanical Properties of Fluids', 'What is the SI unit of pressure?', '["Joule","Newton","Pascal","Watt"]', 2, 'Pascal (Pa) is the SI unit of pressure, defined as one Newton per square meter.', 'beginner', 10, 5),
  
  -- Physics 11th: Units & Measurements
  ('Units & Measurements', 'Which of the following is NOT a fundamental quantity?', '["Mass","Time","Velocity","Temperature"]', 2, 'Velocity is a derived quantity (distance/time), while mass, time, and temperature are fundamental.', 'beginner', 10, 1),
  ('Units & Measurements', 'The dimensions of force are:', '["[L¹ M¹ T⁻²]","[L² M¹ T⁻²]","[L¹ M² T⁻¹]","[L¹ M¹ T⁻¹]"]', 0, 'Force = Mass × Acceleration. Dimension = [M] × [L T⁻²] = [L¹ M¹ T⁻²].', 'beginner', 10, 2),
  ('Units & Measurements', 'Light year is a unit of:', '["Time","Distance","Speed","Intensity"]', 1, 'A light year is the distance light travels in one year, approximately 9.46 trillion kilometers.', 'beginner', 10, 3),
  ('Units & Measurements', 'Significant figures in 0.0050 are:', '["1","2","3","4"]', 1, 'Leading zeros are not significant. Trailing zeros after a decimal point ARE significant. So, 5 and 0 are significant.', 'intermediate', 15, 4),
  ('Units & Measurements', 'Parsec is the unit of:', '["Time","Distance","Frequency","Angle"]', 1, 'Parsec is a large astronomical unit of distance, equivalent to about 3.26 light years.', 'intermediate', 10, 5),
  
  -- Accounts: Partnership Final Accounts
  ('Partnership Final Accounts', 'In the absence of a partnership deed, the profit sharing ratio is:', '["Capital ratio","Equal","3:2","Based on work"]', 1, 'According to the Indian Partnership Act 1932, in the absence of a deed, profits/losses are shared EQUALLY.', 'intermediate', 15, 1),
  ('Partnership Final Accounts', 'Interest on Drawing is credited to which account?', '["Trading Account","Profit & Loss Account","Partners Capital Account","Balance Sheet"]', 1, 'Interest on drawings is an income for the firm and is credited to the Profit & Loss Account.', 'intermediate', 15, 2),
  ('Partnership Final Accounts', 'Wages and Salaries are debited to:', '["Trading Account","Profit & Loss Account","Balance Sheet","Cash Account"]', 0, 'Wages (direct expense) are debited to Trading Account. If it was "Salaries and Wages", it would go to P&L.', 'intermediate', 10, 3),
  ('Partnership Final Accounts', 'A Balance Sheet is a:', '["An Account","A Statement","A Journal","A Cash Book"]', 1, 'A Balance Sheet is a statement of assets and liabilities, not an account.', 'beginner', 10, 4),
  ('Partnership Final Accounts', 'Current Account of a partner is opened when capital is:', '["Fluctuating","Fixed","Withdrawn","Introduced"]', 1, 'Under the Fixed Capital Method, a separate Current Account is opened for each partner to record adjustments.', 'advanced', 20, 5),
  
  -- OCM: Principles of Management
  ('Principles of Management', 'Who is known as the Father of Scientific Management?', '["Henry Fayol","F.W. Taylor","Peter Drucker","Elton Mayo"]', 1, 'F.W. Taylor introduced scientific methods to management.', 'beginner', 10, 1),
  ('Principles of Management', 'How many principles of management were given by Henry Fayol?', '["10","12","14","16"]', 2, 'Henry Fayol identified 14 fundamental principles of management.', 'beginner', 10, 2),
  ('Principles of Management', 'The principle of "Unity of Command" means:', '["One plan for all","One boss for one subordinate","One goal for the team","Equal pay for equal work"]', 1, 'Unity of Command suggests that a subordinate should receive orders from only ONE superior.', 'intermediate', 10, 3),
  ('Principles of Management', 'Management is:', '["Only Art","Only Science","Both Art and Science","Neither Art nor Science"]', 2, 'Management involves both systematic knowledge (Science) and personal skill (Art).', 'beginner', 10, 4),
  ('Principles of Management', 'Which principle states "Union is Strength"?', '["Espirit de Corps","Equity","Initiative","Order"]', 0, 'Espirit de Corps emphasizes team spirit and harmony within the organization.', 'intermediate', 10, 5),
  
  -- Economics: Introduction to Economics
  ('Introduction to Economics', 'The word ''Economics'' is derived from the Greek word:', '["Oikonomia","Economica","Econos","Oikos"]', 0, 'Oikonomia means household management.', 'beginner', 10, 1),
  ('Introduction to Economics', 'Microeconomics deals with:', '["National Income","General Price Level","Individual economic units","Total Employment"]', 2, 'Microeconomics studies the behavior of individual units like consumers and firms.', 'beginner', 10, 2),
  ('Introduction to Economics', 'Adam Smith is known as the _______ of Economics.', '["King","Father","Prophet","Author"]', 1, 'Adam Smith is widely regarded as the Father of Modern Economics.', 'beginner', 10, 3),
  ('Introduction to Economics', 'When the price of a commodity rises, its demand usually:', '["Rises","Falls","Remains same","Becomes zero"]', 1, 'According to the Law of Demand, price and quantity demanded have an inverse relationship.', 'intermediate', 10, 4),
  ('Introduction to Economics', 'Macroeconomics focuses on:', '["Individual firm","A specific product","Aggregate economic variables","Single price"]', 2, 'Macroeconomics deals with the economy as a whole (aggregates).', 'intermediate', 10, 5),
  
  -- SP: Issue of Shares
  ('Issue of Shares', 'Equity shareholders are called _______ of the company.', '["Creditors","Owners","Customers","Debtors"]', 1, 'Equity shareholders bear the risk and have voting rights, making them owners.', 'intermediate', 10, 1),
  ('Issue of Shares', 'A share of the profit of a company distributed to shareholders is called:', '["Interest","Dividend","Commission","Bonus"]', 1, 'Dividend is the reward given to shareholders for their investment.', 'intermediate', 10, 2),
  ('Issue of Shares', 'Equity shares are _______ in nature.', '["Refundable","Permanent","Temporary","Short-term"]', 1, 'Equity share capital is permanent capital and is only repaid at the time of winding up.', 'intermediate', 10, 3),
  ('Issue of Shares', 'What is the minimum application money as per SEBI?', '["5% of face value","10% of face value","25% of issue price","50% of face value"]', 2, 'SEBI guidelines state application money should be at least 25% of the issue price.', 'advanced', 15, 4),
  ('Issue of Shares', 'Bonus shares are issued to:', '["Preference shareholders","Equity shareholders","Debenture holders","Creditors"]', 1, 'Bonus shares are free additional shares issued to existing EQUITY shareholders.', 'intermediate', 10, 5)
) AS v(module_title, question, options, correct_answer, explanation, difficulty, points, order_idx)
WHERE m.title = v.module_title;
