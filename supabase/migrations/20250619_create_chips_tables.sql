-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create gear_types table
CREATE TABLE IF NOT EXISTS gear_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create turret_types table
CREATE TABLE IF NOT EXISTS turret_types (
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
  affected_turrets TEXT[] NOT NULL,
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

-- Insert turret types
INSERT INTO turret_types (name) VALUES
  ('Guardian'),
  ('Hive'),
  ('Thunderbolt'),
  ('Aeroblast'),
  ('Laser'),
  ('Beam'),
  ('Force-field'),
  ('All');

-- Insert chip data
INSERT INTO chips (name, description, compatible_gears, affected_turrets, boost_type, value_common, value_fine, value_rare, value_epic, value_legendary, value_supreme, value_ultimate) VALUES
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
    'Turret Boost',
    '+1', '+2', '+3', '+4', '+5', '+6', '+8'
  ),
  (
    'Fortress Shield',
    'Adds shield to fortress',
    ARRAY['Shield'],
    ARRAY['All'],
    'Turret Ability',
    '+1', '+1', '+2', '+3', '+4', '+5', '+6'
  ),
  (
    'Guardian DMG',
    'Increases Guardian turret damage',
    ARRAY['Weapon'],
    ARRAY['Guardian'],
    'Turret DMG',
    '+5', '+10', '+15', '+20', '+25', '+30', '+40'
  ),
  (
    'Hive DMG',
    'Increases Hive turret damage',
    ARRAY['Weapon'],
    ARRAY['Hive'],
    'Turret DMG',
    '+5', '+10', '+15', '+20', '+28', '+35', '+45'
  ),
  (
    'Thunderbolt DMG',
    'Increases Thunderbolt turret damage',
    ARRAY['Weapon'],
    ARRAY['Thunderbolt'],
    'Turret DMG',
    '+200', '+300', '+600', '+800', '+1000', '+1200', '+1500'
  ),
  (
    'Aeroblast DMG',
    'Increases Aeroblast turret damage',
    ARRAY['Weapon'],
    ARRAY['Aeroblast'],
    'Turret DMG',
    '+6', '+8', '+10', '+12', '+15', '+18', '+21'
  ),
  (
    'Laser DMG',
    'Increases Laser turret damage',
    ARRAY['Weapon'],
    ARRAY['Laser'],
    'Turret DMG',
    '+10', '+15', '+20', '+25', '+30', '+35', '+40'
  ),
  (
    'Beam DMG',
    'Increases Beam turret damage',
    ARRAY['Weapon'],
    ARRAY['Beam'],
    'Turret DMG',
    NULL, NULL, NULL, '+50%', '+75%', '+100%', '+125%'
  ),
  (
    'Force-field DMG',
    'Increases Force-field turret damage',
    ARRAY['Weapon'],
    ARRAY['Force-field'],
    'Turret DMG',
    NULL, NULL, NULL, '+1', '+2', '+2', '+3'
  ),
  (
    'All Turrets DMG',
    'Increases damage for all turrets',
    ARRAY['Weapon'],
    ARRAY['All'],
    'Turret DMG',
    NULL, NULL, '+1', '+2', '+3', '+4', '+5'
  ),
  (
    'Guardian Attack Speed',
    'Increases Guardian turret attack speed',
    ARRAY['Boots'],
    ARRAY['Guardian'],
    'Turret Boost',
    '+10%', '+15%', '+25%', '+35%', '+42%', '+50%', '+60%'
  ),
  (
    'Hive Attack Speed',
    'Increases Hive turret attack speed',
    ARRAY['Boots'],
    ARRAY['Hive'],
    'Turret Boost',
    NULL, NULL, NULL, '+5%', '+10%', '+15%', '+20%'
  ),
  (
    'Thunderbolt Attack Speed',
    'Increases Thunderbolt turret attack speed',
    ARRAY['Boots'],
    ARRAY['Thunderbolt'],
    'Turret Boost',
    '+5%', '+8%', '+12%', '+16%', '+20%', '+25%', '+30%'
  ),
  (
    'Aeroblast Attack Speed',
    'Increases Aeroblast turret attack speed',
    ARRAY['Boots'],
    ARRAY['Aeroblast'],
    'Turret Boost',
    NULL, NULL, NULL, 3, 5, 7, 10
  ),
  (
    'Laser Attack Speed',
    'Increases Laser turret attack speed',
    ARRAY['Boots'],
    ARRAY['Laser'],
    'Turret Boost',
    '+3%', '+5%', '+10%', '+12%', '+15%', '+20%', '+25%'
  ),
  (
    'Beam Attack Speed',
    'Increases Beam turret attack speed',
    ARRAY['Boots'],
    ARRAY['Beam'],
    'Turret Boost',
    '+20%', '+35%', '+60%', '+80%', '+100%', '+120%', '+150%'
  ),
  (
    'Force-field Attack Speed',
    'Increases Force-field turret attack speed',
    ARRAY['Boots'],
    ARRAY['Force-field'],
    'Turret Boost',
    NULL, NULL, NULL, '+2', '+3', '+4', '+5'
  ),
  (
    'All Turrets Attack Speed',
    'Increases attack speed for all turrets',
    ARRAY['Boots'],
    ARRAY['All'],
    'Turret Boost',
    NULL, NULL, NULL, 3, 5, 7, 10
  );

-- Create RLS policies
ALTER TABLE gear_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE turret_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE chips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access for chips" ON chips
  FOR SELECT USING (true);
