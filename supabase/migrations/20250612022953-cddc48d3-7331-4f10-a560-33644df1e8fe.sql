
-- Add cards for Gravity Vortex Gun
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('High Power Field', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field DMG +50%'),
  ('Wide Field', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field range +25%'),
  ('Extended Field', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field flight distance +30%'),
  ('Static Wormhole', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'When Gravitational Field hits the first enemy, a portal is created to teleport enemies to the location where the field disappears for 3s.'),
  ('Small Black Hole', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'Creates a small black hole continuously pulling enemies for 5s after the Gravitational Field disappears.'),
  ('Extended Pull', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'The further the Gravitational Field flies, the larger the range'),
  ('Field Amplification', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Gravity Vortex Gun'), 'Gravitational Field DMG +80%, pulling force +100%');

-- Add cards for Beam
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Extra Beam', 'Elite', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Release an additional secondary Beam'),
  ('Target Explosion', 'Normal', 'T2', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Each hit from Beam triggers an explosion'),
  ('Extreme Focus', 'Normal', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Damage stacking cap increased to 400%'),
  ('Refraction Explosion', 'Normal', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Each hit by Refracted Beam will cause an explosion'),
  ('Beam Lightning', 'Normal', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Each hit from Beam has a 30% chance to trigger 1 Chain Lightning'),
  ('Matrix Resonance', 'Normal', 'T3', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam releases an expanding Electric Matrix on hit'),
  ('Beam Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam DMG +50%'),
  ('Efficient Beam', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam cooldown speed +30%'),
  ('Damage Increase', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam deals increasing damage to the same target(MAX: 200%)'),
  ('High-Frequency Beam', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam duration +40%'),
  ('Beam Refraction', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'When the Beam hits a target, it generates Refracted Beams with +2 refractions'),
  ('DMG Multiplier', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'Beam DMG interval -40%'),
  ('Beam Penetration', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Beam'), 'All Beams inflict [Vulnerable] effect to targets');

-- Add cards for Disruption Drone
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Field Amplification', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Disruption Field DMG +50%'),
  ('Field Duration', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Disruption Field duration +30%'),
  ('Field Expansion', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Disruption Field width +30%'),
  ('Disruption Force', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Each time Disruption Field deals damage to enemies, it inflicts 1 stack of [Disruption] effect'),
  ('Random Disturbance', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Enemies hit by Disruption Field have a 5% chance to be teleported back a certain distance'),
  ('Final Blast', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Disruption Field causes explosion DMG when it ends'),
  ('Stasis Field', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Disruption Drone'), 'Each time enemies take damage from Disruption Field, [Slow] effect +10% (MAX: 90%).');

-- Add cards for Teslacoil
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Electro Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil DMG +50%'),
  ('Electro Chain', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil bounces +1, DMG -15%'),
  ('Electro Acceleration', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil cooldown speed +30%'),
  ('Charge Expansion', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil charge time +0.5s, DMG range increases with charge time'),
  ('Trap Matrix', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil releases Electric Matrix with additional DMG and [Slow] effect for 2s in explosion area'),
  ('Electric Chain Surge', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil releases up to 5 high-energy electric shocks on hit to nearby enemies'),
  ('Electro Interference', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Teslacoil'), 'Teslacoil Explosion range +30%, Railgun Explosion and Electro Matrix inflict [Paralyze] effect');

-- Add cards for Aeroblast
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Powerful Blast', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell DMG +50%'),
  ('Multiple Blast', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell +1, DMG -15%'),
  ('Impact Enhancement', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell knockback +50%, DMG +30%'),
  ('Shotgun Barrage', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'After Aeroblast fires, it launches 5 penetrating Shotgun Shells'),
  ('Floating Mine', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Upon explosion, Aeroblast Shell leaves 2 Floating Mines in the explosion area'),
  ('Massive Explosion', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shell explosion range +70%'),
  ('Central Blast', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Aeroblast'), 'Aeroblast Shells deal an additional high-energy explosion to the center area');

-- Add cards for Firewheel Drone
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Firewheel Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone DMG +50%'),
  ('Size Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone size +25%'),
  ('Duration Extension', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone duration +30%'),
  ('Mini Drones', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone summons 2 Mini Firewheel Drones every 3s'),
  ('Flame Trail', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone leaves a Flame Trail for 2s during flight'),
  ('Smart Acceleration', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone DMG +60%, speed +80% when not dealing damage to enemies'),
  ('Hold the Ground', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Firewheel Drone'), 'Firewheel Drone stays for an additional 10s after it ends');

-- Add cards for Railgun
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Ammo Boost', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell DMG +50%'),
  ('Shell Salvo', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell +1, DMG -15%'),
  ('Railgun Upgrade', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell DMG +30%, Penetration +1'),
  ('Piercing Mark', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Upon hitting the first enemy, Railgun Shell splits into 2 Small Railgun Shells, with a 20% chance to split into 2 more'),
  ('Explosive Shells', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell explodes on hit'),
  ('Power Penetration', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell penetration +3, knockback +100%'),
  ('Weak Spot Strike', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Railgun'), 'Railgun Shell DMG increases with target HP(MAX: 150%)');

-- Add cards for Hive
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Swarm Assault', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps DMG +50%'),
  ('Rapid Barrage', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps attack count +2'),
  ('Dense Swarm', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps +2, DMG -15%'),
  ('Contact Pulse', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp Releases 1 Pulse Wave on first hit'),
  ('Swarm Echo', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasps spawn 1 Echo Wasp I on kill(Max: 1)'),
  ('Wasp Evolution II', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Wasp I evolves to II after 3 attacks'),
  ('Hive Mutation II', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Hive'), 'Hive launches Wasp II after 2 volleys');

-- Add cards for Laser
INSERT INTO public.cards (name, type, tier, tower_id, description) VALUES
  ('Laser Amplification', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Laser DMG +50%'),
  ('Stable Energy', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Laser duration +40%'),
  ('Laser Reflection', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Laser reflection +1, DMG -20% per reflection'),
  ('Additional Sweep', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Fires 1 additional Sweeping Laser'),
  ('Energy Surge', 'Normal', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Fires 2 additional Deflected Lasers'),
  ('High-Energy Pulse', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Laser width +100%'),
  ('Multi-Strike', 'Elite', 'T1', (SELECT id FROM public.towers WHERE name = 'Laser'), 'Laser duration +100%, cooldown speed +20%');
