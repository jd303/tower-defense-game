import { PathGeometryTypes } from '../../dataTypes/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../dataTypes/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	levelId: "2_4",
	levelName: "Cliffedge Heights",
	difficulty: 3,
	rewards: {
		money: 200,
		hearts: 0,
		power: 0
	},
	creepOptions: [
		{ name: 'CreepTrollDink', chance: 0.4 },
		{ name: 'CreepLupine', chance: 0.4 },
		{ name: 'CreepTroll', chance: 0.1 },
		{ name: 'CreepWisp', chance: 0.1 },
	],
	terrain: TerrainTypes.sand,
	environmentColour: {
		colour: "outdoors",
		intensity: 0.75
	},
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.dirt,
			/*propCurve: {
				propNames: [{ name: "ShrubWide", chance: 1 }],
				propSparseness: 25,
				propScale: 1,
				positionRandom: 0.15,
				scaleRandom: { all: 2 },
			},*/
			pathPoints: [
				{
					incomingControlPoint: new Vector3(30.9286, 0, -39.1429),
					point: new Vector3(58.2143, 0, -67.6429),
					outgoingControlPoint: new Vector3(58.4286, 0, -16.2143)
				},
				{
					incomingControlPoint: new Vector3(24.5710, 0, 18.9286),
					point: new Vector3(-30.2143, 0, 68),
					outgoingControlPoint: new Vector3(61.3571, 0, 2.6429)
				}
			],
		},
		{
			id: "2",
			pathGeometry: PathGeometryTypes.dirt,
			/*propCurve: {
				propNames: [{ name: "ShrubWide", chance: 1 }],
				propSparseness: 25,
				propScale: 1,
				positionRandom: 0.15,
				scaleRandom: { all: 2 },
			},*/
			pathPoints: [
				{
					incomingControlPoint: new Vector3(-51.1429, 0, -42.9286),
					point: new Vector3(-66.2857, 0, -65),
					outgoingControlPoint: new Vector3(-9.2143, 0, 21.4286)
				},
				{
					incomingControlPoint: new Vector3(3.8571, 0, 15.6429),
					point: new Vector3(77.5710, 0, 64.9286),
					outgoingControlPoint: new Vector3(65, 0, 15)
				}
			],
		},
	],
	towerPlacementZones: [
		/*{
			zonePoints: [
				{ point: new Vector3(-2.5, 0, -40.3572) },
				{ point: new Vector3(-0.9285, 0, -42.7858) },
				{ point: new Vector3(1.5, 0, -41.5) },
				{ point: new Vector3(2.9286, 0, -35.2857) },
				{ point: new Vector3(5.2143, 0, -24.2857) },
				{ point: new Vector3(7.5, 0, -11.7142) },
				{ point: new Vector3(-11.3572, 0, -11.857) },
				{ point: new Vector3(-9.0714, 0, -17.4285) },
				{ point: new Vector3(-6.5714, 0, -22.9285) },
				{ point: new Vector3(-4.4286, 0, -29.5714) }
			]
		}*/
	],
	props: [],
	propZones: [
		/*{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePoints: [
				{ point: new Vector3(-76.578, 0, -97.405) },
				{ point: new Vector3(-77.492, 0, -66) },
				{ point: new Vector3(-39.606, 0, -66) },
				{ point: new Vector3(-34.178, 0, -75) },
				{ point: new Vector3(-22.063, 0, -75) },
				{ point: new Vector3(-16.521, 0, -66) },
				{ point: new Vector3(51.235, 0, -66) },
				{ point: new Vector3(58.606, 0, -63.175) },
				{ point: new Vector3(69.292, 0, -70.889) },
				{ point: new Vector3(83.380, 0, -71.778) },
				{ point: new Vector3(97.094, 0, -71.480) },
				{ point: new Vector3(99.437, 0, -96.530) },
				{ point: new Vector3(-76.578, 0, -97.405) },
			],
			propSparseness: 3,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 2 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				//colour: 0x547621,
				colour: 0x508100,
				//bevelColour: 0x547621,
				bevelColour: 0x508100,
				smooth: true
			},
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(-79.70288, 0, -86.66697) },
					{ point: new Vector3(-50.09736, 0, -86.47657) },
					{ point: new Vector3(-15.19903, 0, -85.96763) },
					{ point: new Vector3(40.45580, 0, -81.25774) }
				],
				attentuationDistance: 5,
				attenuatedScale: 1
			}
		},*/
	],
	propColourisation: {
		"TreeBulbous": { r: 0.35, b: 0.25, l: -0.3 },
		"TreeFir": { r: 0.75, b: 0.33, l: -0.5 },
		"TreeTall": { r: 0.75, b: 0.33, l: -0.5 },
		"MountainInitial": { r: 0.1, l: -0.25 },
		"GrassNarrow": { r: 0.5, l: -0.5 },
		"GrassWide": { r: 1, l: -0.5 },
		"ShrubWide": { r: 0.25, l: -0.25 },
	},
};
