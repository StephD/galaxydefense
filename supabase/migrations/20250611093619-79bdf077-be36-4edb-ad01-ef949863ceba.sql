
-- Drop the existing tables to restructure properly
DROP TABLE IF EXISTS public.card_towers;
DROP TABLE IF EXISTS public.cards;
DROP TABLE IF EXISTS public.towers;

-- Drop enum types
DROP TYPE IF EXISTS card_type;
DROP TYPE IF EXISTS tier_type;

-- Recreate enum types with correct values
CREATE TYPE card_type AS ENUM ('Normal', 'Chain', 'Combo', 'Elite');
CREATE TYPE tier_type AS ENUM ('T1', 'T2', 'T3');

-- Create towers table with real tower names from the images
CREATE TABLE public.towers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cards table with proper structure
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type card_type NOT NULL,
  tier tier_type NOT NULL,
  tower_id UUID NOT NULL REFERENCES public.towers(id) ON DELETE CASCADE,
  combo_card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  parent_card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL,
  description TEXT,
  unlock_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert towers from the images
INSERT INTO public.towers (name, description) VALUES
  ('Sky Guard', 'Fire DMG. Fires missiles that deal impact and explosion DMG to enemies'),
  ('Laser', 'Precision laser tower with focused beam attacks'),
  ('Disruption Drone', 'Advanced drone technology for battlefield control'),
  ('Aeroblast', 'Wind-based projectile launcher'),
  ('Thunderbolt', 'Electric discharge tower with chain lightning'),
  ('Beam', 'High-energy beam weapon system'),
  ('Firewheel Drone', 'Mobile fire-based drone unit'),
  ('Hive', 'Multi-projectile swarm launcher'),
  ('Railgun', 'Electromagnetic projectile cannon'),
  ('Teslacoil', 'Tesla coil electrical tower'),
  ('Gravity Vortex Gun', 'Gravity manipulation weapon system');

-- Insert Sky Guard cards from the images
-- T1 Cards (Star Tier 1)
INSERT INTO public.cards (name, type, tier, tower_id, description, unlock_level) VALUES
  ('Volley Missile', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile +1, DMG -15%', 1),
  ('Sky Guard Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile DMG +50%', 1),
  ('Explosion Spread', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Explosion range +30%', 1),
  ('Impact Reinforcement', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'After hitting the target, Sky Guard Missile launches 3 Small Sky Guard Missiles that only deal Impact DMG', 1),
  ('Ignition', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Enemies hit by Sky Guard Missiles receive [Burn] effect', 2),
  ('Burning Area', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missiles leave a burning area that lasts for 5s after exploding', 1),
  ('Impact Multiplier', 'Chain', 'T1', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'All Sky Guard Missiles'' impact DMG +200%', 1);

-- T2 Cards (Star Tier 2)  
INSERT INTO public.cards (name, type, tier, tower_id, description, unlock_level) VALUES
  ('Missle Amplification', 'Normal', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Small Sky Guard Missiles +3', 2),
  ('Chain Reaction', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Small Sky Guard Missiles have a 60% chance to launch an additional Small Sky Guard Missile upon hitting an enemy', 2),
  ('Ignition Amplification', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), '[Burn] DMG +100%', 2),
  ('Strong Impact', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missile +2', 2),
  ('Close-range Explosion', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'After hitting a target, Sky Guard Missile triggers an additional strong explosion in the nearby area', 14),
  ('Collapse Explosion', 'Chain', 'T2', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Creates a Small Black Hole after the Sky Guard Missile exploded', 2);

-- T3 Cards (Star Tier 3)
INSERT INTO public.cards (name, type, tier, tower_id, description, unlock_level) VALUES
  ('Death Ignition', 'Elite', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Triggers an explosion when an enemy dies while under [Burn] effect', 10),
  ('Fire Transmission', 'Elite', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Sky Guard Missiles apply [Burn] effect to enemies they pass through', 3),
  ('Detonation Thunderbolt', 'Elite', 'T3', (SELECT id FROM public.towers WHERE name = 'Sky Guard'), 'Generates a stationary small Thunderbolt for 5s after Sky Guard missiles kill enemies', 3);

-- Set up parent-child relationships for chain cards
UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Ignition') 
WHERE name = 'Ignition Amplification';

UPDATE public.cards SET parent_card_id = (SELECT id FROM public.cards WHERE name = 'Ignition') 
WHERE name = 'Death Ignition';

-- Enable Row Level Security
ALTER TABLE public.towers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view towers" ON public.towers FOR SELECT USING (true);
CREATE POLICY "Anyone can view cards" ON public.cards FOR SELECT USING (true);
