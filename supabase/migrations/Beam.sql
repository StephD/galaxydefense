-- Insert Beam T1 Normal Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Beam Amplifier', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam DMG +50%'),
  ('Beam Acceleration', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam cooldown speed +30%'),
  ('Beam Expansion', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam width +30%');

-- Insert Beam T1 Chain Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Refracted Beam', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam splits into 2 smaller beams after hitting an enemy'),
  ('Charging Beam', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam charges for 1s before firing, DMG +100%');

-- Insert Beam T1 Elite Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Penetrating Beam', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam penetration +2'),
  ('Energy Overload', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam has a 20% chance to deal double DMG');

-- Insert Beam T2 Chain Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Refraction Enhancement', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Refracted beams split into 2 more mini beams',
   (SELECT id FROM public.cards WHERE name = 'Refracted Beam' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Beam'))),
  ('Charged Burst', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Charging time +0.5s, DMG +150%',
   (SELECT id FROM public.cards WHERE name = 'Charging Beam' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Beam')));

-- Insert Beam T2 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Energy Synergy', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam DMG +50% against enemies affected by Laser',
   (SELECT id FROM public.towers WHERE name = 'Laser')),
  ('Conductive Beam', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam applies [Conductive] effect to enemies for 3s',
   (SELECT id FROM public.towers WHERE name = 'Thunderbolt'));

-- Insert Beam T2 Elite Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Beam Mastery', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam width +50%, DMG +30%'),
  ('Focused Energy', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam DMG increases the longer it hits the same target (MAX: +200%)');

-- Insert Beam T3 Chain Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, parent_card_id) VALUES
  ('Refraction Mastery', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'All refracted beams deal full DMG',
   (SELECT id FROM public.cards WHERE name = 'Refraction Enhancement' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Beam'))),
  ('Overcharged Beam', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Charging time +1s, DMG +300%, beam width +100%',
   (SELECT id FROM public.cards WHERE name = 'Charged Burst' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Beam')));

-- Insert Beam T3 Combo Cards
INSERT INTO public.cards (name, type, tier, tower_id, description, combo_tower_id) VALUES
  ('Spinning Energy', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam creates a spinning energy disk on hit that damages nearby enemies',
   (SELECT id FROM public.towers WHERE name = 'Laser')),
  ('Gravitational Lens', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam bends toward nearby enemies after hitting a target',
   (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'));
