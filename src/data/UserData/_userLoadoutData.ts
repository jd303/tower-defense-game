import { UserLoadoutData } from "./UserLoadout";

export const newUserData: UserLoadoutData = {
	// Assets permanently unlocked (for discovering in runs)
	permanentUnlocks: {
		towers: ["TowerArcher", "TowerOrb"],
		heroes: ["AldricEthersteel"],
		powers: ["PowerHeroMotivation"]
	},

	// Available assets, per run
	runDiscoveries: {
		towers: ["TowerArcher", "TowerOrb"],
		heroes: ["AldricEthersteel"],
		powers: ["PowerHeroMotivation"]
	},

	// Temporary powerful modifiers, per run
	runModifiers: [],

	// Equipped heroes, and Chronoblip Hero Upgrade Purchases
	heroesEquipped: ["AldricEthersteel"],
	heroUpgradePurchases: {
		movement: 0,
		power: 0,
		life: 0,
	},

	// Equipped towers, and Chronoblip Tower Upgrade Purchases
	towersEquipped: ["TowerArcher", "TowerOrb"],
	towerUpgradePurchases: {
		accuracy: 0,
		power: 0,
		range: 0,
		attackrate: 0,
	},

	// Equipped powers, and Chronoblip Power Upgrade Purchases
	powersEquipped: ["PowerHeroMotivation"],
	powerUpgradePurchases: {
		cooldown: 0,
		power: 0,
		size: 0
	},

	// Stored Economical data
	economyData: {
		money: 1000,
		hearts: 25,
		power: 250
	},

	// Chronos data
	chronosData: {
		chronoblips: 0,
		chronobloops: 0,
		chronoblobs: 0
	},
}


// Dev / example data
export const tempUserLoadoutData: UserLoadoutData = {
	// Assets permanently unlocked (for discovering in runs)
	permanentUnlocks: {
		towers: ["TowerArcher", "TowerBullet", "TowerMine", "TowerFlame", "TowerAirstrike", "TowerBoulder", "TowerPulse", "TowerOrb", "TowerBlast", "TowerRicochet", "TowerBeam", "TowerAura", "TowerVolcanic"],
		heroes: ["AldricEthersteel", "Nether"],
		powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion', 'PowerHeroMotivation', 'PowerTowerMotivation', 'PowerSpringDoorTrap']
	},

	// Available assets, per run
	runDiscoveries: {
		towers: ["TowerArcher", "TowerBullet", "TowerMine", "TowerFlame", "TowerAirstrike", "TowerBoulder", "TowerPulse", "TowerOrb", "TowerBlast", "TowerRicochet", "TowerBeam", "TowerAura", "TowerVolcanic"],
		heroes: ["AldricEthersteel", "Nether"],
		powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion', 'PowerHeroMotivation', 'PowerTowerMotivation', 'PowerSpringDoorTrap']
	},

	// Temporary powerful modifiers, per run
	runModifiers: ["Pyroclasm"],

	// Equipped heroes, and Chronoblip Hero Upgrade Purchases
	heroesEquipped: ['Nether'],
	heroUpgradePurchases: {
		movement: 0,
		power: 0,
		life: 0,
	},

	// Equipped towers, and Chronoblip Tower Upgrade Purchases
	towersEquipped: ['TowerMine', 'TowerFlame', 'TowerAirstrike', 'TowerVolcanic', 'TowerBullet'],
	towerUpgradePurchases: {
		accuracy: 0,
		power: 0,
		range: 0,
		attackrate: 0,
	},

	// Equipped powers, and Chronoblip Power Upgrade Purchases
	powersEquipped: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion'],
	powerUpgradePurchases: {
		cooldown: 0,
		power: 0,
		size: 0
	},

	// Stored Economical data
	economyData: {
		money: 6000,
		hearts: 50,
		power: 2000
	},

	// Chronos Data
	chronosData: {
		chronoblips: 100,
		chronobloops: 10,
		chronoblobs: 5
	}
}