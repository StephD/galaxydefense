-- Insert Gravity Vortex Gun T1 Normal Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('High Power Field', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field DMG +50%'),
  ('Wide Field', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field range +25%'),
  ('Extended Field', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field flight distance +30%');

-- Insert Gravity Vortex Gun T1 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Static Wormhole', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'When Gravitational Field hits enemy, a portal is created to teleport enemies to the location where the field disappears for 3s'),
  ('Small Black Hole', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Creates a small black hole continuously pulling enemies for 5s after the Gravitational Field disappears');

-- Insert Gravity Vortex Gun T1 Elite Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Extended Pull', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'The further the Gravitational Field flies, the larger the range'),
  ('Field Amplification', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field DMG +80%, pulling force +100%');

-- Insert Gravity Vortex Gun T2 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Wormhole Enhancement', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Portal duration (entrance and exit) +100%',
   (SELECT id FROM public.cards WHERE name = 'Static Wormhole' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'))),
  ('Wormhole Expansion', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Portal entry range +100%',
   (SELECT id FROM public.cards WHERE name = 'Static Wormhole' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'))),
  ('Black Hole Expansion', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Small Black Hole range +50%, pulling force +50%',
   (SELECT id FROM public.cards WHERE name = 'Small Black Hole' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun')));

-- Insert Gravity Vortex Gun T2 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Field Reflection', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'All Gravitational Fields can reflect',
   (SELECT id FROM public.turrets WHERE name = 'Firewheel Drone'));

-- Insert Gravity Vortex Gun T2 Elite Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Extra Field', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field +1'),
  ('Extended Range', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field flight distance doubled');

-- Insert Gravity Vortex Gun T3 Chain Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Destructive Black Hole', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Small Black Hole DMG +250%',
   (SELECT id FROM public.cards WHERE name = 'Black Hole Expansion' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun')));

-- Insert Gravity Vortex Gun T3 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Field Disruption', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field inflicts [Disruption] effect on hit',
   (SELECT id FROM public.turrets WHERE name = 'Disruption Drone')),
  ('Double Fission', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field splits into two small Gravitational Fields at the end',
   (SELECT id FROM public.turrets WHERE name = 'Railgun'));
