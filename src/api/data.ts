// API handler for returning raw JSON data
export interface TurretData {
  id: number;
  name: string;
  type: string;
  description: string;
  tier: string;
  stats: {
    power: number;
    defense: number;
    range: number;
    fireRate: number;
  };
  abilities?: string[];
}

// Sample data to return from the API
export const turretData: TurretData[] = [
  {
    id: 1,
    name: "Laser",
    type: "Energy",
    description: "Standard energy turret that fires concentrated light beams at enemies. Effective against light armor.",
    tier: "T1",
    stats: {
      power: 10,
      defense: 5,
      range: 8,
      fireRate: 3.5
    },
    abilities: ["Piercing Beam", "Heat Buildup"]
  },
  {
    id: 2,
    name: "Railgun",
    type: "Kinetic",
    description: "High-powered electromagnetic projectile launcher. Excellent armor penetration and long range.",
    tier: "T2",
    stats: {
      power: 15,
      defense: 3,
      range: 12,
      fireRate: 1.2
    },
    abilities: ["Armor Piercing", "Charged Shot"]
  },
  {
    id: 3,
    name: "Skyguard",
    type: "Anti-Air",
    description: "Specialized anti-air defense system with rapid-fire capabilities. Effective against flying enemies.",
    tier: "T2",
    stats: {
      power: 8,
      defense: 7,
      range: 6,
      fireRate: 5.0
    },
    abilities: ["Flak Burst", "Targeting Array"]
  },
  {
    id: 4,
    name: "Hive",
    type: "Biological",
    description: "Organic defense structure that releases swarms of aggressive wasps to attack nearby enemies.",
    tier: "T3",
    stats: {
      power: 12,
      defense: 8,
      range: 7,
      fireRate: 2.8
    },
    abilities: ["Swarm Intelligence", "Rapid Barrage"]
  },
  {
    id: 5,
    name: "Teslacoil",
    type: "Energy",
    description: "Electrical defense tower that can chain lightning between multiple targets. Effective against groups.",
    tier: "T3",
    stats: {
      power: 14,
      defense: 6,
      range: 5,
      fireRate: 2.0
    },
    abilities: ["Chain Lightning", "Overcharge"]
  }
];

// Export the original game data interface for backward compatibility
export interface GameData extends TurretData {}
export const gameData = turretData;
