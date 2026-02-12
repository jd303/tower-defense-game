import { UserLoadoutData } from "./UserLoadout";

export const newUserData: UserLoadoutData = {
	heroes: [],
	heroUpgrades: {},
	towers: [],
	towerUpgrades: {},
	powers: [],
	powerUpgrades: {},
	economyData: {
		money: { current: 0 },
		hearts: { current: 0 },
		power: { current: 0 }
	},
	chronoData: {
		chronoblips: 0,
		chronobloops: 0,
		chronoblobs: 0
	},
}

export const tempUserLoadoutData: UserLoadoutData = {
	heroes: ['Nether'],
	heroUpgrades: {
		"Nether": [
			{ movement: { speed: 25 } }
		]
	},

	towers: ['TowerArcher', 'TowerBomber', 'TowerMage'],
	towerUpgrades: {
		"TowerArcher": [
			{ attack: { accuracy: 1, range: 20 } }
		],
		"TowerMage": [
			{ attack: { damage: -2, range: 5 } },
			{ projectile: { speed: 1 } }
		]
	},

	powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion'],
	powerUpgrades: {
		PowerTimeNoodleDistortion: [
			{ cost: -4, duration: -5000 }
		],
		PowerCatapultBarrage: [
			{ damage: 5 }
		]
	},

	economyData: {
		money: { current: 600 },
		hearts: { current: 15 },
		power: { current: 50 }
	},

	chronoData: {
		chronoblips: 10,
		chronobloops: 5,
		chronoblobs: 2
	}
}