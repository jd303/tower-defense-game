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
	terrain: TerrainTypes.sand,
	environmentColour: {
		colour: "outdoors",
		intensity: 1.0
	},
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [{
				"incomingControlPoint": new Vector3(-15, 0, -24.4285),
				"point": new Vector3(-75, 0, -7),
				"outgoingControlPoint": new Vector3(-39.7857, 0, 15.3571)
			},
			{
				"incomingControlPoint": new Vector3(-38.0714, 0, -16.571428),
				"point": new Vector3(-11.857142, 0, -16.8571),
				"outgoingControlPoint": new Vector3(6.8571, 0, -17.14285)
			},
			{
				"incomingControlPoint": new Vector3(5.4285, 0, 2.28571428),
				"point": new Vector3(23.928571, 0, 11.14285),
				"outgoingControlPoint": new Vector3(39.7857, 0, 19.14285)
			},
			{
				"incomingControlPoint": new Vector3(59.5, 0, 6.92857),
				"point": new Vector3(75, 0, -7.78571428),
				"outgoingControlPoint": new Vector3(67.642, 0, -5.7142)
			}]
		},
	],
	towerPlacementZones: [
		{
			zonePoints: [
				{ point: new THREE.Vector3(-37.8572, 0, -27.7143) },
				{ point: new THREE.Vector3(-33.8571, 0, -31.6429) },
				{ point: new THREE.Vector3(-28.5714, 0, -32.5715) },
				{ point: new THREE.Vector3(-20.6429, 0, -27.7143) },
				{ point: new THREE.Vector3(-19.2857, 0, -23.7144) },
				{ point: new THREE.Vector3(-28.5714, 0, -20.8572) },
				{ point: new THREE.Vector3(-35.2857, 0, -16.7142) },
				{ point: new THREE.Vector3(-45.0714, 0, -8.5714) },
				{ point: new THREE.Vector3(-44.7143, 0, -19.2858) },
				{ point: new THREE.Vector3(-37.8572, 0, -27.7143) }
			]
		},
		{
			zonePoints: [
				{ point: new THREE.Vector3(-23.0001, 0, -6.8572) },
				{ point: new THREE.Vector3(-18.0715, 0, -9.1429) },
				{ point: new THREE.Vector3(-11.7858, 0, -9.7143) },
				{ point: new THREE.Vector3(-7.5715, 0, -9.2857) },
				{ point: new THREE.Vector3(-4.9286, 0, -3.4286) },
				{ point: new THREE.Vector3(-24.2857, 0, -1.0714) },
				{ point: new THREE.Vector3(-23.0001, 0, -6.8572) }
			]
		},
		{
			zonePoints: [
				{ point: new THREE.Vector3(24.8571, 0, -18.5) },
				{ point: new THREE.Vector3(37.4285, 0, -15.1429) },
				{ point: new THREE.Vector3(49.7857, 0, 2.6428) },
				{ point: new THREE.Vector3(42.7857, 0, 6) },
				{ point: new THREE.Vector3(35.7143, 0, 7.0714) },
				{ point: new THREE.Vector3(26.7143, 0, 5.7857) },
				{ point: new THREE.Vector3(18.7857, 0, -0.2143) },
				{ point: new THREE.Vector3(10.5, 0, -11.0001) },
				{ point: new THREE.Vector3(24.8571, 0, -18.5) },
			]
		}
	],
	props: [

	],
	propZones: [
		{
			propNames: [{ name: 'TreeDead', chance: 0.5 }, { name: 'TreeDead2', chance: 0.5 }],
			zonePoints: [
				{ point: new THREE.Vector3(-65.1429, 0, -32.6429) },
				{ point: new THREE.Vector3(-65.4286, 0, -39.5) },
				{ point: new THREE.Vector3(-55.9286, 0, -43) },
				{ point: new THREE.Vector3(-49, 0, -38.7144) },
				{ point: new THREE.Vector3(-39.5714, 0, -37.9287) },
				{ point: new THREE.Vector3(-49.3571, 0, -25.2858) },
				{ point: new THREE.Vector3(-51.3571, 0, -12.7857) },
				{ point: new THREE.Vector3(-68.1429, 0, -22.4285) },
				{ point: new THREE.Vector3(-72.0001, 0, -28.9286) },
				{ point: new THREE.Vector3(-65.1429, 0, -32.6429) },
			],
			propSparseness: 5,
			propScale: 2,
			positionRandom: 1.5,
			scaleRandom: { all: 3 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0xC8B54E,
				bevelColour: 0xC8B54E,
				smooth: true
			}
		},
		{
			propNames: [{ name: 'TreeDead', chance: 0.5 }, { name: 'TreeDead2', chance: 0.5 }],
			zonePoints: [
				{ point: new THREE.Vector3(-25.2857, 0, 5.2143) },
				{ point: new THREE.Vector3(-23.9286, 0, 3.4286) },
				{ point: new THREE.Vector3(-21.5, 0, 3.4286) },
				{ point: new THREE.Vector3(-3.3571, 0, 0.9286) },
				{ point: new THREE.Vector3(-1.2857, 0, 17) },
				{ point: new THREE.Vector3(-30.4286, 0, 13.3571) },
				{ point: new THREE.Vector3(-25.2857, 0, 5.2143) }
			],
			propSparseness: 5,
			propScale: 2,
			positionRandom: 1.5,
			scaleRandom: { all: 3 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0xC8B54E,
				bevelColour: 0xC8B54E,
				smooth: true
			}
		},
		{
			propNames: [{ name: 'TreeDead', chance: 0.5 }, { name: 'TreeDead2', chance: 0.5 }],
			zonePoints: [
				{ point: new THREE.Vector3(30.2143, 0, -52) },
				{ point: new THREE.Vector3(34, 0, -55.5) },
				{ point: new THREE.Vector3(45.4286, 0, -50.1428) },
				{ point: new THREE.Vector3(49.9286, 0, -32) },
				{ point: new THREE.Vector3(46.9286, 0, -21.8571) },
				{ point: new THREE.Vector3(11.5, 0, -30.6429) },
				{ point: new THREE.Vector3(6.5714, 0, -39.5) },
				{ point: new THREE.Vector3(25.6429, 0, -41.9286) },
				{ point: new THREE.Vector3(30.2143, 0, -52) },
			],
			propSparseness: 5,
			propScale: 2,
			positionRandom: 1.5,
			scaleRandom: { all: 3 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0xC8B54E,
				bevelColour: 0xC8B54E,
				smooth: true
			}
		}
	],
	propColourisation: {},
};
