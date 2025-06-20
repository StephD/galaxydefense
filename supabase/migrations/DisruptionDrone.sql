-- First, delete existing Disruption Drone cards to avoid duplicates
DELETE FROM public.cards WHERE turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

-- Insert Disruption Drone T1 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Field Amplification', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Field DMG +50%'),
  ('Field Duration', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Field duration +30%'),
  ('Field Expansion', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Field width +30%'),
  ('Disruption Force', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Each time Disruption Field deals damage to enemies, it inflicts 1 stack of [Disruption] effect'),
  ('Random Disturbance', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Enemies hit by Disruption Field have a 5% chance to be teleported back a certain distance'),
  ('Final Blast', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Field causes explosion DMG when it ends'),
  ('Stasis Field', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Each time enemies take damage from Disruption Field, [Slow] effect +10% (MAX: 90%)');

-- Insert Disruption Drone T2 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Disruption Burst', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'When [Disruption] effect reaches MAX stacks, deals 1 high burst DMG'),
  ('Rewind Teleport', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Enemies hit by Disruption Field have a 2.5% chance to be transported to start point'),
  ('Small Laser', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'A Sweeping Laser is generated in the center of Disruption Drone'),
  ('Electric Field', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Enemies hit by Disruption Field have a 30% chance to be inflicted [Paralyze]'),
  ('Quick Cooldown', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Drone DMG interval -30%, cooldown speed +30%'),
  ('Field Suppression', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Enemies in the Disruption Field take increased additional DMG based on their reduced speed (MAX: 200% additional DMG)');

-- Insert Disruption Drone T3 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Area Disruption', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'When [Disruption] effect reaches MAX stacks, deals 1 extra DMG'),
  ('Teleport Damage', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Teleportation from the Disruption Field deals 3% of the target''s MAX HP as DMG'),
  ('Fortress Support', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Launch an additional set of Disruption Drones above Fortress'),
  ('Field Replication', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'When Railgun Shell enters Disruption Field first time, it 100% splits into 1 additional Railgun Shell'),
  ('Converging Field', 'Elite', 'T3', (SELECT id FROM public.turrets WHERE name = 'Disruption Drone'), 'Disruption Drone DMG +100%, each DMG pulls enemies toward the center');

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Disruption Force') 
WHERE name = 'Disruption Burst' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Disruption Burst') 
WHERE name = 'Area Disruption' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Random Disturbance') 
WHERE name = 'Rewind Teleport' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Rewind Teleport') 
WHERE name = 'Teleport Damage' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

-- Set up combo relationships with other turrets
UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser')
WHERE name = 'Small Laser' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Teslacoil')
WHERE name = 'Electric Field' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Guardian')
WHERE name = 'Fortress Support' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Railgun')
WHERE name = 'Field Replication' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Disruption Drone');
