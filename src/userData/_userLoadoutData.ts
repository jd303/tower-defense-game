import { UserLoadoutData } from "./UserLoadoutManager";

export const tempUserLoadoutData: UserLoadoutData = {
	heroes: ['Man0'],
	heroUpgrades: {
		"Man0": [
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
			{ projectile: { speed: 25 } }
		]
	},

	powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion', 'PowerTowerMotivation', 'PowerHeroMotivation', 'PowerSpringDoorTrap'],
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
	}
}