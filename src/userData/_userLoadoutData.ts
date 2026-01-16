import { UserLoadoutData } from "./UserLoadoutManager";

export const tempUserLoadoutData: UserLoadoutData = {
	heroes: [],
	towers: ['TowerArcher', 'TowerBomber', 'TowerMage'],
	powers: ['PowerCatapultBarrage', 'PowerTimeNoodleDistortion', 'PowerTowerMotivation', 'PowerHeroMotivation', 'PowerSpringDoorTrap'],
	economyData: {
		money: { current: 600 },
		hearts: { current: 15 },
		power: { current: 50 }
	}
}