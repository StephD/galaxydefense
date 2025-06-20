-- First, delete existing Railgun cards to avoid duplicates

-- Insert Railgun T1 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Ammo Boost', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell DMG +50%'),
  ('Shell Salvo', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell +1, DMG -15%'),
  ('Railgun Upgrade', 'Normal', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell DMG +30%, Penetration +1'),
  ('Piercing Mark', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Upon hitting the first enemy, Railgun Shell splits into 2 Small Railgun Shells, with a 20% chance to split into 2 more'),
  ('Explosive Shells', 'Chain', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell explodes on hit'),
  ('Power Penetration', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell penetration +3, knockback +100%'),
  ('Weak Spot Strike', 'Elite', 'T1', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell DMG increases with target HP (MAX: 150%)');

-- Insert Railgun T2 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Piercing Enhancement', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Upon hitting the first enemy, Small Railgun Shell splits into 2 Mini Railgun Shells, with a 20% chance to split into 2 more',
   (SELECT id FROM public.cards WHERE name = 'Piercing Mark' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Railgun'))),
  ('Impact Spread', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell explosion range +20% for each penetration',
   (SELECT id FROM public.cards WHERE name = 'Explosive Shells' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Railgun'))),
  ('Impact Boost', 'Chain', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell explosion DMG +30% for each penetration',
   (SELECT id FROM public.cards WHERE name = 'Explosive Shells' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Railgun')));

-- Insert Railgun T2 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Piercing Mark', 'Combo', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Enemies hit by all Railgun shells receive [Physical Vulnerable] effect',
   (SELECT id FROM public.turrets WHERE name = 'Guardian'));

-- Insert Railgun T2 Elite Cards
INSERT INTO public.cards (name, type, tier, turret_id, description) VALUES
  ('Shell Crit Boost', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'All Railgun Shells DMG +40%, Crit Rate +30%'),
  ('Execution Penetration', 'Elite', 'T2', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell penetration +1 on kill (MAX: +5)');

-- Insert Railgun T3 Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, parent_card_id) VALUES
  ('Split Mastery', 'Chain', 'T3', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'All Railgun shells'' split chance +40%',
   (SELECT id FROM public.cards WHERE name = 'Piercing Enhancement' AND turret_id = (SELECT id FROM public.turrets WHERE name = 'Railgun')));

-- Insert Railgun T3 Combo Cards
INSERT INTO public.cards (name, type, tier, turret_id, description, combo_turret_id) VALUES
  ('Secondary Minefield', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'Railgun Shell releases 1 Floating Mine on hit',
   (SELECT id FROM public.turrets WHERE name = 'Aeroblast')),
  ('Piercing Ricochet', 'Combo', 'T3', (SELECT id FROM public.turrets WHERE name = 'Railgun'), 'All Railgun shells penetration +1, reflection +1 (Unlock at Lv.18)',
   (SELECT id FROM public.turrets WHERE name = 'Firewheel Drone'));
