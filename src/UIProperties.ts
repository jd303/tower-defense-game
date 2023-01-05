export interface UIProperties {
	type: UITypes;
	icon: string;
	placeCallback?: Function;
}

export enum UITypes {
	Tower = 'tower',
	HeroAbility = 'heroability',
}
