import { PathGeometryTypes } from '../../dataTypes/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../dataTypes/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	levelId: "2_1",
	levelName: "East Winds",
	difficulty: 2,
	creepOptions: [
		{ name: 'CreepTrollDink', chance: 0.4 },
		{ name: 'CreepLupine', chance: 0.4 },
		{ name: 'CreepTroll', chance: 0.1 },
		{ name: 'CreepWisp', chance: 0.1 },
	],
	terrain: TerrainTypes.grass,
	environmentColour: {
		colour: "outdoors",
		intensity: 0.75
	},
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.dirt,
			propCurve: {
				propNames: [{ name: "ShrubWide", chance: 1 }],
				propSparseness: 25,
				propScale: 1,
				positionRandom: 0.15,
				scaleRandom: { all: 2 },
			},
			pathPoints: [
				{
					incomingControlPoint: new Vector3(-22.7143, 0, -41.2857),
					point: new Vector3(-7.7857, 0, -61.9286),
					outgoingControlPoint: new Vector3(-6.9285, 0, -16.2857)
				},
				{
					incomingControlPoint: new Vector3(-19.3571, 0, -29.2857),
					point: new Vector3(-20.0710, 0, 2.2143),
					outgoingControlPoint: new Vector3(-21.4286, 0, 29.0714)
				},
				{
					incomingControlPoint: new Vector3(-8.9286, 0, 29),
					point: new Vector3(-8.9286, 0, 65),
					outgoingControlPoint: new Vector3(-13.2143, 0, 27)
				}
			],
		},
		{
			id: "2",
			pathGeometry: PathGeometryTypes.dirt,
			propCurve: {
				propNames: [{ name: "ShrubWide", chance: 1 }],
				propSparseness: 25,
				propScale: 1,
				positionRandom: 0.15,
				scaleRandom: { all: 2 },
			},
			pathPoints: [
				{
					incomingControlPoint: new Vector3(22.7143, 0, -45),
					point: new Vector3(7.7857, 0, -65),
					outgoingControlPoint: new Vector3(6.9285, 0, -20)
				},
				{
					incomingControlPoint: new Vector3(15, 0, -34),
					point: new Vector3(15, 0, -2),
					outgoingControlPoint: new Vector3(16, 0, 25)
				},
				{
					incomingControlPoint: new Vector3(8.9286, 0, 29),
					point: new Vector3(8.9286, 0, 67),
					outgoingControlPoint: new Vector3(13.2143, 0, 27)
				}
			],
		},
	],
	towerPlacementZones: [
		{
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
		},
		{
			zonePoints: [
				{ point: new Vector3(-8.0714, 0, 34.3572) },
				{ point: new Vector3(-12.0714, 0, 21) },
				{ point: new Vector3(-5.0714, 0, 22.4286) },
				{ point: new Vector3(6.4286, 0, 21.7143) },
				{ point: new Vector3(2, 0, 53.5714) },
				{ point: new Vector3(-4.7857, 0, 46.0714) }
			]
		}
	],
	props: [],
	propZones: [
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePoints: [
				{ point: new Vector3(-2, 0, -61.2857) },
				{ point: new Vector3(2.1429, 0, -61.0714) },
				{ point: new Vector3(2.3572, 0, -43.3571) },
				{ point: new Vector3(-2.8572, 0, -43.4285) }
			],
			propSparseness: 2,
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
		},
		{
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
		},
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePoints: [
				{ point: new Vector3(-12.4286, 0, -3.0715) },
				{ point: new Vector3(-10.8572, 0, -7.2858) },
				{ point: new Vector3(-7.0001, 0, -7.7143) },
				{ point: new Vector3(-2.1429, 0, -8) },
				{ point: new Vector3(3.7857, 0, -7.6429) },
				{ point: new Vector3(7.2142, 0, -6.2143) },
				{ point: new Vector3(8, 0, 4.3572) },
				{ point: new Vector3(6.8571, 0, 16.4286) },
				{ point: new Vector3(4.9285, 0, 18.0715) },
				{ point: new Vector3(1.2856, 0, 19) },
				{ point: new Vector3(-3.7858, 0, 19.1429) },
				{ point: new Vector3(-9.1429, 0, 17.9286) },
				{ point: new Vector3(-12.2143, 0, 13.4285) },
				{ point: new Vector3(-12.5714, 0, 6.3571) }
			],
			propSparseness: 2.5,
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
		},
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePoints: [
				{ point: new Vector3(-3.0714, 0, 62.7858) },
				{ point: new Vector3(-4.3572, 0, 49.3572) },
				{ point: new Vector3(2.9286, 0, 56.2143) },
				{ point: new Vector3(2.7142, 0, 69.8572) },
				{ point: new Vector3(-3.0714, 0, 73.7857) }
			],
			propSparseness: 2,
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
		},
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
