import { PathGeometryTypes } from '../../dataTypes/PathInterfaces';
import { LevelDefinition, TerrainTypes } from '../../dataTypes/LevelInterfaces';
import THREE, { Vector3 } from 'three';

export const levelDetails: LevelDefinition = {
	levelId: "0_0",
	levelName: "Narrow Approach",
	difficulty: 1,
	rewards: {
		money: 200,
		hearts: 0,
		power: 0
	},
	creepOptions: [
		{
			name: 'CreepTrollDink',
			chance: 1
		}
	],
	terrain: TerrainTypes.grass,
	backgroundImagePath: "assets/backgrounds/level_0.jpg",
	environmentColour: {
		colour: "outdoors",
		intensity: 1.0
	},
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.none,
			pathPoints: [{
				"incomingControlPoint": new Vector3(77.7857, 0.5, -27.1429),
				"point": new Vector3(74.8571, 0.5, -23.0714),
				"outgoingControlPoint": new Vector3(71.7857, 0.5, -15.5714)
			},
			{
				"incomingControlPoint": new Vector3(59.2143, 0.5, -15.6429),
				"point": new Vector3(53.5, 0.5, -23.2143),
				"outgoingControlPoint": new Vector3(44.2856, 0.5, -36.2144)
			},
			{
				"incomingControlPoint": new Vector3(34.1428, 0.5, -32),
				"point": new Vector3(27.4285, 0.5, -20.0714),
				"outgoingControlPoint": new Vector3(21.3572, 0.5, -7.5)
			},
			{
				"incomingControlPoint": new Vector3(27.9286, 0.5, 1.7142),
				"point": new Vector3(13.1428, 0.5, 14.3571),
				"outgoingControlPoint": new Vector3(5.6428, 0.5, 19.1429)
			},
			{
				"incomingControlPoint": new Vector3(1.7857, 0.5, 17.5),
				"point": new Vector3(-4.2144, 0.5, 11.0714),
				"outgoingControlPoint": new Vector3(-10.7858, 0.5, 3.3571)
			},
			{
				"incomingControlPoint": new Vector3(-14.4287, 0.5, 5.9286),
				"point": new Vector3(-26.3572, 0.5, 11.5714),
				"outgoingControlPoint": new Vector3(-34.8573, 0.5, 12.8572)
			},
			{
				"incomingControlPoint": new Vector3(-36.0715, 0.5, 9.4285),
				"point": new Vector3(-43.4287, 0.5, -0.7858),
				"outgoingControlPoint": new Vector3(-51.7144, 0.5, -12.1429)
			},
			{
				"incomingControlPoint": new Vector3(-61.7858, 0.5, -26.7858),
				"point": new Vector3(-73.5716, 0.5, -43.7144),
				"outgoingControlPoint": new Vector3(-33.4287, 0.5, 4.2142)
			}]
		},
		{
			id: "2",
			pathGeometry: PathGeometryTypes.none,
			pathPoints: [
				{
					"incomingControlPoint": new Vector3(75.6429, 0.5, 31.8571),
					"point": new Vector3(72.4286, 0.5, 28.7857),
					"outgoingControlPoint": new Vector3(63.4286, 0.5, 30.9286)
				},
				{
					"incomingControlPoint": new Vector3(49.9286, 0.5, 25.5714),
					"point": new Vector3(36.5, 0.5, 31.4286),
					"outgoingControlPoint": new Vector3(34.2857, 0.5, 32.1428)
				},
				{
					"incomingControlPoint": new Vector3(27.9286, 0.5, 37.1429),
					"point": new Vector3(19.8571, 0.5, 32.5),
					"outgoingControlPoint": new Vector3(13.0715, 0.5, 27.9286)
				},
				{
					"incomingControlPoint": new Vector3(14.6428, 0.5, 22.7858),
					"point": new Vector3(9.7857, 0.5, 17.8571),
					"outgoingControlPoint": new Vector3(3.4285, 0.5, 12.7857)
				},
				{
					"incomingControlPoint": new Vector3(1.1428, 0.5, 19.9286),
					"point": new Vector3(-4.8572, 0.5, 9.7143),
					"outgoingControlPoint": new Vector3(-7.5715, 0.5, 6.0714)
				},
				{
					"incomingControlPoint": new Vector3(-12.6429, 0.5, 3.5),
					"point": new Vector3(-24.4286, 0.5, 11.4286),
					"outgoingControlPoint": new Vector3(-30.8572, 0.5, 13.7143)
				},
				{
					"incomingControlPoint": new Vector3(-34.5715, 0.5, 12.8572),
					"point": new Vector3(-42.5001, 0.5, 0.0715),
					"outgoingControlPoint": new Vector3(-47.1429, 0.5, -8.9286)
				},
				{
					"incomingControlPoint": new Vector3(-59.9287, 0.5, -22.1428),
					"point": new Vector3(-72.7144, 0.5, -42.2856),
					"outgoingControlPoint": new Vector3(-79.9287, 0.5, -46.4285)
				}
			]
		}
	],
	towerPlacementZones: [
		{
			zonePoints: [
				{ point: new THREE.Vector3(-52.8571, 0, -43.1429) },
				{ point: new THREE.Vector3(-41.6428, 0, -39.5) },
				{ point: new THREE.Vector3(-37.2857, 0, -25.5714) },
				{ point: new THREE.Vector3(-44.6429, 0, -24.0714) },
				{ point: new THREE.Vector3(-50.6429, 0, -29.3571) },
				{ point: new THREE.Vector3(-53.6429, 0, -35.2142) }
			]
		},
		{
			zonePoints: [
				{ point: new THREE.Vector3(-34.3572, 0, -3.2143) },
				{ point: new THREE.Vector3(-36.9286, 0, -14.8571) },
				{ point: new THREE.Vector3(-25.5715, 0, -10.0715) },
				{ point: new THREE.Vector3(-9.0715, 0, -16.2143) },
				{ point: new THREE.Vector3(5.0714, 0, -9) },
				{ point: new THREE.Vector3(16.9286, 0, -13.0715) },
				{ point: new THREE.Vector3(17.7143, 0, 1.0714) },
				{ point: new THREE.Vector3(9.3571, 0, 10.2857) },
				{ point: new THREE.Vector3(2.9285, 0, 9.3571) },
				{ point: new THREE.Vector3(-3.9286, 0, 0.5714) },
				{ point: new THREE.Vector3(-12.1429, 0, -2.5) },
				{ point: new THREE.Vector3(-29.4286, 0, 3.5714) }
			]
		}
	],
	props: [

	],
	propZones: [
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.5 }, { name: 'TreeBulbous', chance: 0.5 }],
			zonePoints: [
				{ point: new THREE.Vector3(-55.9286, 0, -44.9999) },
				{ point: new THREE.Vector3(-59.2143, 0, -56.0714) },
				{ point: new THREE.Vector3(-51.5, 0, -56.4285) },
				{ point: new THREE.Vector3(38.2857, 0, -55.9286) },
				{ point: new THREE.Vector3(18.7143, 0, -36.6429) },
				{ point: new THREE.Vector3(16.5, 0, -32.7143) },
				{ point: new THREE.Vector3(15.2857, 0, -16.0714) },
				{ point: new THREE.Vector3(4.7143, 0, -12.3571) },
				{ point: new THREE.Vector3(-5.8571, 0, -17.7143) },
				{ point: new THREE.Vector3(-12, 0, -18) },
				{ point: new THREE.Vector3(-25.5714, 0, -11.9286) },
				{ point: new THREE.Vector3(-36.2858, 0, -16.9285) },
				{ point: new THREE.Vector3(-36.6429, 0, -34.8571) },
				{ point: new THREE.Vector3(-39.0715, 0, -41.4285) }
			],
			propSparseness: 3,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 3 },
			/*environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0xC8B54E,
				bevelColour: 0xC8B54E,
				smooth: true
			}*/
			environmentTile: false
		},
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.5 }, { name: 'TreeBulbous', chance: 0.5 }],
			zonePoints: [
				{ point: new THREE.Vector3(-74.2857, 0, -1.1428) },
				{ point: new THREE.Vector3(-73.8572, 0, -34.8571) },
				{ point: new THREE.Vector3(-61.6429, 0, -11) },
				{ point: new THREE.Vector3(-45.1429, 0, 18.8571) },
				{ point: new THREE.Vector3(-15.5, 0, 47.1428) },
				{ point: new THREE.Vector3(4.7857, 0, 37.5) },
				{ point: new THREE.Vector3(25.5, 0, 67.0714) },
				{ point: new THREE.Vector3(-73.3571, 0, 64.2857) }
			],
			propSparseness: 3,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 3 },
			environmentTile: false
		}
	],
	propColourisation: {},
};
