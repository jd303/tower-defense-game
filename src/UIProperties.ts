export interface UIProperties {
	type: UITypes;
	icon: string;
	clickCallback: Function;
}

export enum UITypes {
	Tower = 'tower',
	HeroAbility = 'heroability',
}
