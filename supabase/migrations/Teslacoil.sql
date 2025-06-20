-- Insert Teslacoil T1 Normal Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Electro Boost', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil DMG +50%'),
  ('Electro Chain', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil bounces +1, DMG -15%'),
  ('Electro Acceleration', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil cooldown speed +30%');

-- Insert Teslacoil T1 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Charge Expansion', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil charge time +0.5s, DMG range increases with charge time'),
  ('Trap Matrix', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil releases Electric Matrix with additional DMG and [Slow] effect for 2s in explosion area');

-- Insert Teslacoil T1 Elite Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Electric Chain Surge', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil releases up to 5 high-energy electric shocks on hit to nearby enemies'),
  ('Electro Interference', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil Explosion range +30%, Railgun Explosion and Electro Matrix inflict [Paralyze] effect');

-- Insert Teslacoil T2 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Charge Destruction', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil charge time +0.5s, DMG increases with charge time',
   (SELECT id FROM public.cards WHERE name = 'Charge Expansion' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Teslacoil'))),
  ('Enhanced Matrix', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Electric Matrix DMG +100%, duration +1s',
   (SELECT id FROM public.cards WHERE name = 'Trap Matrix' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Teslacoil')));

-- Insert Teslacoil T2 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Electric Enhancement', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'All Electric DMG +80%',
   (SELECT id FROM public.turrets WHERE name = 'Thunderbolt')),
  ('Cooperative Beam', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'During charging, Teslacoil releases 2 Refracted Beams',
   (SELECT id FROM public.turrets WHERE name = 'Beam'));

-- Insert Teslacoil T2 Elite Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Expanded Shockwave', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil explosion range increased, outer DMG halved'),
  ('Charged Shock', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'During the Teslacoil charging time, it releases up to 2 high-energy electric shocks to nearby enemies every 0.25s');

-- Insert Teslacoil T3 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Charge Delayed', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Charge time +1s',
   (SELECT id FROM public.cards WHERE name = 'Charge Destruction' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Teslacoil'))),
  ('Matrix Thunderbolt', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Electro Matrix has a 30% chance to release a stationary Small Thunderbolt for 5s',
   (SELECT id FROM public.cards WHERE name = 'Enhanced Matrix' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Teslacoil')));

-- Insert Teslacoil T3 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Spinning Laser', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Teslacoil'), 'Teslacoil releases 1 Spinning Laser on hit',
   (SELECT id FROM public.turrets WHERE name = 'Laser'));
