-- First, delete existing Laser cards to avoid duplicates
DELETE FROM public.cards WHERE turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

-- Insert Laser T1 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Laser Amplification', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser DMG +50%'),
  ('Stable Energy', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser duration +40%'),
  ('Laser Reflection', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser reflection +1, DMG -20% per reflection'),
  ('Additional Sweep', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Fires 1 additional Sweeping Laser'),
  ('Energy Surge', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Fires 2 additional Deflected Lasers'),
  ('High-Energy Pulse', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser width +100%'),
  ('Multi-Strike', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser duration +100%, cooldown speed +20%');

-- Insert Laser T2 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Vulnerable Laser', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Enemies hit by Sweeping Lasers receive [Vulnerable] effect'),
  ('Slow Laser', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Enemies hit by Deflected Lasers receive [Slow] effect'),
  ('Energy Overload', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Debuff duration from all Lasers +100%'),
  ('Tear Explosion', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), '50% chance to trigger a Ripping Laser when hitting enemies with Laser'),
  ('Energy Boost', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Laser DMG +80% for each debuff on enemies (MAX:300%)'),
  ('Energy Paralysis', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Enemies hit by Laser receive [Paralyze] effect');

-- Insert Laser T3 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Sweep Boost', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Sweeping Laser sweeps once again'),
  ('Deflected Laser Reflection', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'Deflected Laser reflections +1'),
  ('Energy Detonation', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Laser'), 'All Lasers hitting enemies with [Burn] effect will trigger an Ignition Explosion'),
  ('Convergence Trigger', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Laser'), '30% chance to generates a Refracted Laser upon Laser hitting enemies');

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Additional Sweep') 
WHERE name = 'Vulnerable Laser' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Vulnerable Laser') 
WHERE name = 'Sweep Boost' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Energy Surge') 
WHERE name = 'Slow Laser' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Slow Laser') 
WHERE name = 'Deflected Laser Reflection' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

-- Set up combo relationships with other turrets
UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Thunderbolt')
WHERE name = 'Energy Paralysis' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Sky Guard')
WHERE name = 'Energy Detonation' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');

UPDATE public.cards SET combo_turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser')
WHERE name = 'Convergence Trigger' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Laser');
