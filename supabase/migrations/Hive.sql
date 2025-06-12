-- First, delete existing Hive cards to avoid duplicates


-- Insert Hive T1 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Swarm Assault', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps DMG +50%'),
  ('Rapid Barrage', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps attack count +2'),
  ('Dense Swarm', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps +2, DMG -15%'),
  ('Contact Pulse', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp Releases 1 Pulse Wave on first hit'),
  ('Swarm Echo', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps spawn 1 Echo Wasp I on kill (Max: 1)'),
  ('Wasp Evolution II', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp I evolves to II after 3 attacks'),
  ('Hive Mutation II', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Hive launches Wasp II after 2 volleys');

-- Insert Hive T2 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Amplified Pulse', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Pulse Wave DMG range +30% and inflicts [Slow] effect on hit',
   (SELECT id FROM public.cards WHERE name = 'Contact Pulse' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Hive'))),
  ('Final Resonance', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp releases 1 Pulse Wave when it ends',
   (SELECT id FROM public.cards WHERE name = 'Contact Pulse' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Hive'))),
  ('Echo Upgrade II', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Evolves echoes to Echo Wasp II',
   (SELECT id FROM public.cards WHERE name = 'Swarm Echo' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Hive')));

-- Insert Hive T2 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Electro-Wasps', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Each Wasp attack has a 50% chance to release a High-voltage shock at enemies in close range',
   (SELECT id FROM public.towers WHERE name = 'Teslacoil')),
  ('Projectile Fission', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps split into 7 sub-projectiles on hit',
   (SELECT id FROM public.towers WHERE name = 'Guardian'));

-- Insert Hive T2 Elite Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Wasp Evolution III', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp II evolves to III after 3 attacks'),
  ('Hive Mutation III', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Hive has a 50% chance to launch Wasp III after 2 volleys'),
  ('Wasp Retrieval', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps have a 50% chance to return to Hive when destroyed');

-- Insert Hive T3 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Echo Upgrade III', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Evolves echoes to Echo Wasp III',
   (SELECT id FROM public.cards WHERE name = 'Echo Upgrade II' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Hive')));

-- Insert Hive T3 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Swarm Fury', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps +30% DMG after each attack',
   (SELECT id FROM public.towers WHERE name = 'Laser'));
