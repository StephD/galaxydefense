-- First, delete existing Thunderbolt cards to avoid duplicates

-- Insert Thunderbolt T1 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Continuous Strike', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Thunderbolt +1, Lightning Strike DMG -15%'),
  ('Swift Strike', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike cooldown speed +10%, DMG +30%'),
  ('Lightning Boost', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike DMG +50%'),
  ('Lightning Paralysis', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Enemies hit by Lightning Strike receive [Paralyze] effect'),
  ('Chain Lightning', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike trigger 1 Chain Lightning on hit (MAX: 5)'),
  ('Lightning Expansion', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike width +100%'),
  ('Slaughtering Lighting', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike has a 60% chance to trigger a stationary small Thunderbolt when killing enemies'),
  ('Paralysis Chain', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Enemies paralyzed by Thunderbolt trigger a small chain Lightning each time they take damage (0.5s interval)');

-- Insert Thunderbolt T2 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Paralysis Extension', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Duration of [Paralyze] effect caused by the Thunderbolt +100%'),
  ('Chain Expansion', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Chain Lightning''s target +4'),
  ('Lightning Aftershock', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'There is a 50% chance to generate 1 Floating Mine by Thunderbolt hits enemies'),
  ('Lightning Trail', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'After Lighting Strike, leaving a flame trail during flight'),
  ('Extra Strike', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike has a 50% chance to trigger 1 more time'),
  ('Chain Strike', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Enemies hit by Chain Lightning have a 25% chance to trigger a Small Lightning Strike');

-- Insert Thunderbolt T3 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Life Erosion', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Lightning Strike deals an additional 3% of the target''s MAX HP as DMG when inflicting [Paralyze] effect'),
  ('Chain Interference', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Enemies hit by Chain Lightning receive [Paralyze] effect, Chain Lightning DMG +100%'),
  ('Lightning Teleportation', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Thunderbolt'), 'Enemies hit by Lightning Strike or Chain Lightning have a 50% chance to be teleported back a certain distance');

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Lightning Paralysis') 
WHERE name IN ('Paralysis Chain', 'Paralysis Extension') AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Paralysis Extension') 
WHERE name = 'Life Erosion' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Chain Lightning') 
WHERE name = 'Chain Expansion' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Chain Expansion') 
WHERE name = 'Chain Interference' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

-- Set up combo relationships with other turrets
-- These relationships are explicitly defined in the card list

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Aeroblast')
WHERE name = 'Lightning Aftershock' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Firewheel Drone')
WHERE name = 'Lightning Trail' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone')
WHERE name = 'Lightning Teleportation' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt');
