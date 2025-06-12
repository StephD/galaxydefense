-- First, delete existing Aeroblast cards to avoid duplicates


-- Insert Aeroblast T1 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Powerful Blast', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell DMG +50%'),
  ('Multiple Blast', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell +1, DMG -15%'),
  ('Impact Enhancement', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell knockback +50%, DMG +30%'),
  ('Shotgun Barrage', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'After Aeroblast fires, it launches 5 penetrating Shotgun Shells'),
  ('Floating Mine', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Upon explosion, Aeroblast Shell leaves 2 Floating Mines in the explosion area'),
  ('Massive Explosion', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell explosion range +70%'),
  ('Central Blast', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shells deal an additional high-energy explosion to the center area');

-- Insert Aeroblast T2 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Extra Loading', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'For each enemy killed, Aeroblast fires 1 additional penetrating Shotgun Shell (MAX: 10)'),
  ('Wide Minefield', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Floating Mine +2, explosion DMG +25%'),
  ('Mine Shockwave', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Floating Mine +2, knockback +100%'),
  ('Piercing Blast', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell Penetration +1'),
  ('Firewheel Summon', 'Combo', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'For each enemy hit by Aeroblast Shell explosion, it generate a Small Firewheel Drone'),
  ('Chain Explosion', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'For each enemy hit by Aeroblast Shell explosion, explosion DMG +20% (MAX: 200%)'),
  ('Range Extension', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast range +70%'),
  ('Secondary Explosion', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Enemies hit by Aeroblast Shell will trigger an additional explosion after 1s');

-- Insert Aeroblast T3 Cards
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Shotgun Penetration', 'Chain', 'T3', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Penetrating Shotgun Shells penetration DMG +50%, range +70%'),
  ('Gravity Bomb', 'Combo', 'T3', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast shell DMG +100%, pulls enemies to the center before the explosion');

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Shotgun Barrage') 
WHERE name = 'Extra Loading' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Extra Loading') 
WHERE name = 'Shotgun Penetration' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Floating Mine') 
WHERE name IN ('Wide Minefield', 'Mine Shockwave') AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');

-- Set up combo relationships with other towers
UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Railgun')
WHERE name = 'Piercing Blast' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');

UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Firewheel Drone')
WHERE name = 'Firewheel Summon' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');

UPDATE public.cards SET combo_tower_id = (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun')
WHERE name = 'Gravity Bomb' AND tower_id = (SELECT id FROM public.towers WHERE name = 'Aeroblast');
