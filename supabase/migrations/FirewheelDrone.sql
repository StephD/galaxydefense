-- First, delete existing Firewheel Drone cards to avoid duplicates

-- Insert Firewheel Drone T1 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Firewheel Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone DMG +50%'),
  ('Size Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone size +25%'),
  ('Duration Extension', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone duration +30%'),
  ('Mini Drones', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone summons 2 Mini Firewheel Drones every 3s'),
  ('Flame Trail', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone leaves a Flame Trail for 2s during flight'),
  ('Smart Acceleration', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone DMG +60%, speed +80% when not dealing damage to enemies'),
  ('Hold the Ground', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone stays for an additional 10s after it ends');

-- Insert Firewheel Drone T2 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Killing Array', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'For every 2 enemies directly killed by Firewheel Drone, summon 2 Mini Firewheel Drones', 
   (SELECT id FROM public.cards WHERE name = 'Mini Drones' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'))),
  ('Blazing Trail', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Flame Trail DMG +60%',
   (SELECT id FROM public.cards WHERE name = 'Flame Trail' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Firewheel Drone')));

-- Insert Firewheel Drone T2 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Firewheel Ignition', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone has a 20% chance to inflict [Burning] effect',
   (SELECT id FROM public.towers WHERE name = 'Sky Guard')),
  ('Vortex Firewheel', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone creates a pull effect around it',
   (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'));

-- Insert Firewheel Drone T2 Elite Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Killing Charge', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'For every 2 enemies directly killed by Firewheel Drone, Firewheel Drone CD -0.5s (MAX: 5s)'),
  ('Combo Boost', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'For every 20 hits dealt by Firewheel Drone, Firewheel Drone DMG +20% (MAX: +200%)');

-- Insert Firewheel Drone T3 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Mini Size Boost', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Mini Firewheel Drone DMG +50%, duration +50%',
   (SELECT id FROM public.cards WHERE name = 'Killing Array' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'))),
  ('Extended Trail', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Flame Trail duration +2s',
   (SELECT id FROM public.cards WHERE name = 'Blazing Trail' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Firewheel Drone')));

-- Insert Firewheel Drone T3 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Extra Barrage', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'For every 15 hits dealt by Firewheel Drone, launch 1 ring of penetrating bullets',
   (SELECT id FROM public.towers WHERE name = 'Aeroblast'));
