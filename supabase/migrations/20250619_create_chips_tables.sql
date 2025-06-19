-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gear_types table
CREATE TABLE IF NOT EXISTS gear_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tower_types table
CREATE TABLE IF NOT EXISTS tower_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chips table
CREATE TABLE IF NOT EXISTS chips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  compatible_gears TEXT[] NOT NULL,
  affected_towers TEXT[] NOT NULL,
  boost_type TEXT NOT NULL,
  value_common TEXT,
  value_fine TEXT,
  value_rare TEXT,
  value_epic TEXT,
  value_legendary TEXT,
  value_supreme TEXT,
  value_ultimate TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert gear types
INSERT INTO gear_types (name) VALUES
  ('Armor'),
  ('Helmet'),
  ('Energy Core'),
  ('Boots'),
  ('Shield'),
  ('Weapon');

-- Insert tower types
INSERT INTO tower_types (name) VALUES
  ('Guardian'),
  ('Hive'),
  ('Thunderbolt'),
  ('Aeroblast'),
  ('Laser'),
  ('Beam'),
  ('Force-field'),
  ('All');

-- Insert chip data
INSERT INTO chips (name, description, compatible_gears, affected_towers, boost_type, value_common, value_fine, value_rare, value_epic, value_legendary, value_supreme, value_ultimate) VALUES
  (
    'Crit Rate',
    'Increases critical hit chance',
    ARRAY['Helmet', 'Energy Core', 'Armor', 'Weapon'],
    ARRAY['All'],
    'Crit',
    '+1%', '+2%', '+3%', '+4%', '+5%', '+6%', '+8%'
  ),
  (
    'Crit DMG',
    'Increases critical hit damage',
    ARRAY['Helmet', 'Energy Core', 'Armor', 'Weapon'],
    ARRAY['All'],
    'Crit DMG',
    '+1%', '+2%', '+3%', '+4%', '+4%', '+5%', '+6%'
  ),
  (
    'Fortress',
    'Increases fortress health',
    ARRAY['Armor', 'Shield'],
    ARRAY['All'],
    'Tower Boost',
    '+1', '+2', '+3', '+4', '+5', '+6', '+8'
  ),
  (
    'Fortress Shield',
    'Adds shield to fortress',
    ARRAY['Shield'],
    ARRAY['All'],
    'Tower Ability',
    '+1', '+1', '+2', '+3', '+4', '+5', '+6'
  ),
  (
    'Guardian DMG',
    'Increases Guardian tower damage',
    ARRAY['Weapon'],
    ARRAY['Guardian'],
    'Tower DMG',
    '+5', '+10', '+15', '+20', '+25', '+30', '+40'
  ),
  (
    'Hive DMG',
    'Increases Hive tower damage',
    ARRAY['Weapon'],
    ARRAY['Hive'],
    'Tower DMG',
    '+5', '+10', '+15', '+20', '+28', '+35', '+45'
  ),
  (
    'Thunderbolt DMG',
    'Increases Thunderbolt tower damage',
    ARRAY['Weapon'],
    ARRAY['Thunderbolt'],
    'Tower DMG',
    '+200', '+300', '+600', '+800', '+1000', '+1200', '+1500'
  ),
  (
    'Aeroblast DMG',
    'Increases Aeroblast tower damage',
    ARRAY['Weapon'],
    ARRAY['Aeroblast'],
    'Tower DMG',
    '+6', '+8', '+10', '+12', '+15', '+18', '+21'
  ),
  (
    'Laser DMG',
    'Increases Laser tower damage',
    ARRAY['Weapon'],
    ARRAY['Laser'],
    'Tower DMG',
    '+10', '+15', '+20', '+25', '+30', '+35', '+40'
  ),
  (
    'Beam DMG',
    'Increases Beam tower damage',
    ARRAY['Weapon'],
    ARRAY['Beam'],
    'Tower DMG',
    NULL, NULL, NULL, '+50%', '+75%', '+100%', '+125%'
  ),
  (
    'Force-field DMG',
    'Increases Force-field tower damage',
    ARRAY['Weapon'],
    ARRAY['Force-field'],
    'Tower DMG',
    NULL, NULL, NULL, '+1', '+2', '+2', '+3'
  ),
  (
    'All Towers DMG',
    'Increases damage for all towers',
    ARRAY['Weapon'],
    ARRAY['All'],
    'Tower DMG',
    NULL, NULL, '+1', '+2', '+3', '+4', '+5'
  ),
  (
    'Guardian Attack Speed',
    'Increases Guardian tower attack speed',
    ARRAY['Boots'],
    ARRAY['Guardian'],
    'Tower Boost',
    '+10%', '+15%', '+25%', '+35%', '+42%', '+50%', '+60%'
  ),
  (
    'Hive Attack Speed',
    'Increases Hive tower attack speed',
    ARRAY['Boots'],
    ARRAY['Hive'],
    'Tower Boost',
    NULL, NULL, NULL, '+5%', '+10%', '+15%', '+20%'
  ),
  (
    'Thunderbolt Attack Speed',
    'Increases Thunderbolt tower attack speed',
    ARRAY['Boots'],
    ARRAY['Thunderbolt'],
    'Tower Boost',
    '+5%', '+8%', '+12%', '+16%', '+20%', '+25%', '+30%'
  ),
  (
    'Aeroblast Attack Speed',
    'Increases Aeroblast tower attack speed',
    ARRAY['Boots'],
    ARRAY['Aeroblast'],
    'Tower Boost',
    NULL, NULL, NULL, 3, 5, 7, 10
  ),
  (
    'Laser Attack Speed',
    'Increases Laser tower attack speed',
    ARRAY['Boots'],
    ARRAY['Laser'],
    'Tower Boost',
    '+3%', '+5%', '+10%', '+12%', '+15%', '+20%', '+25%'
  ),
  (
    'Beam Attack Speed',
    'Increases Beam tower attack speed',
    ARRAY['Boots'],
    ARRAY['Beam'],
    'Tower Boost',
    '+20%', '+35%', '+60%', '+80%', '+100%', '+120%', '+150%'
  ),
  (
    'Force-field Attack Speed',
    'Increases Force-field tower attack speed',
    ARRAY['Boots'],
    ARRAY['Force-field'],
    'Tower Boost',
    NULL, NULL, NULL, '+2', '+3', '+4', '+5'
  ),
  (
    'All Towers Attack Speed',
    'Increases attack speed for all towers',
    ARRAY['Boots'],
    ARRAY['All'],
    'Tower Boost',
    NULL, NULL, NULL, 3, 5, 7, 10
  );

-- Create RLS policies
ALTER TABLE gear_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tower_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access for chips" ON chips
  FOR SELECT USING (true);
