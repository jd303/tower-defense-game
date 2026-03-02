import { UserLoadoutData } from "./UserLoadout";

export const newUserData: UserLoadoutData = {
	// Assets permanently unlocked (for discovering in runs)
	permanentUnlocks: {
		towers: ["TowerArcher"],
		heroes: ["AldricEthersteel"],
		powers: ["PowerHeroMotivation"]
	},

	// Available assets, per run
	runDiscoveries: {
		towers: ["TowerArcher"],
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
	towersEquipped: ["TowerArcher"],
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
		money: { current: 250 },
		hearts: { current: 25 },
		power: { current: 100 }
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
		towers: ["TowerArcher", "TowerOrb", "TowerBlast", "TowerRicochet", "TowerBeam"],
		heroes: ["AldricEthersteel", "Nether"],
		powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion', 'PowerHeroMotivation', 'PowerTowerMotivation', 'PowerSpringDoorTrap']
	},

	// Available assets, per run
	runDiscoveries: {
		towers: ["TowerArcher", "TowerOrb", "TowerBlast", "TowerRicochet", "TowerBeam"],
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
	towersEquipped: ['TowerArcher', 'TowerBlast', 'TowerOrb'],
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
		money: { current: 600 },
		hearts: { current: 25 },
		power: { current: 50 }
	},

	// Chronos Data
	chronosData: {
		chronoblips: 100,
		chronobloops: 10,
		chronoblobs: 5
	}
}