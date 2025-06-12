-- First, delete existing Sky Guard cards to avoid duplicates
DELETE FROM public.cards WHERE tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

-- Insert Sky Guard T1 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Volley Missile', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile +1, DMG -15%'),
  ('Sky Guard Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile DMG +50%'),
  ('Explosion Spread', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Explosion range +30%'),
  ('Ignition', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Enemies hit by Sky Guard Missiles receive [Burn] effect'),
  ('Impact Reinforcement', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'After hitting the target, Sky Guard Missile launches 3 Small Sky Guard Missiles that only deal Impact DMG'),
  ('Burning Area', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missiles leave a burning area that lasts for 5s after exploding'),
  ('Impact Multiplier', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'All Sky Guard Missiles'' impact DMG +200%');

-- Insert Sky Guard T2 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Chain Reaction', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Small Sky Guard Missiles have a 60% chance to launch an additional Small Sky Guard Missile upon hitting an enemy'),
  ('Missile Amplification', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Small Sky Guard Missiles +3'),
  ('Ignition Amplification', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), '[Burn] DMG +100% (Parent: Ignition)'),
  ('Collapse Explosion', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Creates a Small Black Hole after the Sky Guard Missile exploded'),
  ('Strong Impact', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile +2'),
  ('Close-range Explosion', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'After hitting a target, Sky Guard Missile triggers an additional strong explosion in the nearby area');

-- Insert Sky Guard T3 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Death Ignition', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Triggers an explosion when an enemy dies while under [Burn] effect (Parent: Ignition)'),
  ('Detonation Thunderbolt', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Generates a stationary small Thunderbolt for 5s after Sky Guard missiles kill enemies'),
  ('Path Strike', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missiles deal DMG to enemies along their path'),
  ('Fire Transmission', 'Elite', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missiles apply [Burn] effect to enemies they pass through');

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Ignition') 
WHERE name = 'Ignition Amplification' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Ignition Amplification') 
WHERE name = 'Death Ignition' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Impact Reinforcement') 
WHERE name IN ('Chain Reaction', 'Missile Amplification') AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

-- Set up combo relationships with other towers

UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun')
WHERE name = 'Collapse Explosion' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Thunderbolt')
WHERE name = 'Detonation Thunderbolt' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');

UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Guardian')
WHERE name = 'Path Strike' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Sky Guard');