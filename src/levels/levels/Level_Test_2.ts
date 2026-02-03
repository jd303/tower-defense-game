import { PathGeometryTypes } from '../../data/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	difficulty: 2,
	creepOptions: [
		{ name: 'CreepTrollDink', chance: 0.4 },
		{ name: 'CreepLupine', chance: 0.4 },
		{ name: 'CreepTroll', chance: 0.1 },
		{ name: 'CreepWisp', chance: 0.1 },
	],
	terrain: TerrainTypes.grass,
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.dirt,
			propCurve: {
				//propNames: [{ name: "ShrubWide", chance: 0.9 }, { name: 'GrassNarrow', chance: 0.05 }, { name: 'GrassWide', chance: 0.05 }],
				propNames: [{ name: "ShrubWide", chance: 1 }],
				propSparseness: 15,
				propScale: 3,
				positionRandom: 0.5,
				scaleRandom: { all: 2 },
			},
			pathPoints: [
				{ incomingControlPoint: new Vector3(-90, 0, -63.57142857142858), point: new Vector3(-90, 0, -59.64285714285714), outgoingControlPoint: new Vector3(-66.5, 0, -60.57142857142857) },
				{ incomingControlPoint: new Vector3(29.642857142857146, 0, -59.357142857142854), point: new Vector3(49.642857142857146, 0, -59.42857142857142), outgoingControlPoint: new Vector3(54.42857142857143, 0, -59.57142857142857) },
				{ incomingControlPoint: new Vector3(59.642857142857146, 0, -55.42857142857142), point: new Vector3(59.28571428571429, 0, -49.57142857142857), outgoingControlPoint: new Vector3(59.21428571428572, 0, -39.71428571428571) },
				{ incomingControlPoint: new Vector3(59.50000000000001, 0, -36.14285714285714), point: new Vector3(59.28571428571429, 0, -29.857142857142854), outgoingControlPoint: new Vector3(59.50000000000001, 0, -25.571428571428573) },
				{ incomingControlPoint: new Vector3(55.92857142857143, 0, -19.64285714285714), point: new Vector3(49.50000000000001, 0, -19.857142857142854), outgoingControlPoint: new Vector3(21.000000000000007, 0, -19.57142857142857) },
				{ incomingControlPoint: new Vector3(-1.9285714285714235, 0, -19.785714285714285), point: new Vector3(-49.49999999999999, 0, -19.928571428571427), outgoingControlPoint: new Vector3(-54.928571428571416, 0, -19.857142857142854) },
				{ incomingControlPoint: new Vector3(-59.428571428571416, 0, -16.357142857142854), point: new Vector3(-59.49999999999999, 0, -10.07142857142857), outgoingControlPoint: new Vector3(-59.64285714285713, 0, -0.42857142857142616) },
				{ incomingControlPoint: new Vector3(-59.49999999999999, 0, 5.0000000000000036), point: new Vector3(-59.49999999999999, 0, 29.42857142857143), outgoingControlPoint: new Vector3(-59.428571428571416, 0, 35.42857142857143) },
				{ incomingControlPoint: new Vector3(-54.78571428571428, 0, 39.50000000000001), point: new Vector3(-49.42857142857142, 0, 39.42857142857143), outgoingControlPoint: new Vector3(-29.714285714285708, 0, 39.57142857142858) },
				{ incomingControlPoint: new Vector3(-3.9285714285714235, 0, 39.142857142857146), point: new Vector3(78, 0, 39.57142857142858), outgoingControlPoint: new Vector3(39.50000000000001, 0, 39.57142857142858) },
			],
		},
	],
	towerPlacementZones: [
		// First bend inner
		{
			points: [
				{ point: new Vector3(37, 0, -52.5) },
				{ point: new Vector3(37.5, 0, -53) },
				{ point: new Vector3(52.5, 0, -53) },
				{ point: new Vector3(53, 0, -38.775) },
				{ point: new Vector3(52.5, 0, -26.5) },
				{ point: new Vector3(36.5, 0, -26.5) },
				{ point: new Vector3(37, 0, -52.5) },
			]
		},
		{
			points: [
				{ point: new Vector3(-36.5, 0, -66.5) },
				{ point: new Vector3(-32.5, 0, -72.5) },
				{ point: new Vector3(-30, 0, -72.5) },
				{ point: new Vector3(-23.5, 0, -72.5) },
				{ point: new Vector3(-20, 0, -65.5) },
				{ point: new Vector3(-36, 0, -65.5) },
				{ point: new Vector3(-36.5, 0, -66.5) },
			]
		},
		{
			points: [
				{ point: new Vector3(-11.482, 0, -54.169) },
				{ point: new Vector3(-7.539, 0, -47.589) },
				{ point: new Vector3(-2.282, 0, -46.789) },
				{ point: new Vector3(2.461, 0, -47.531) },
				{ point: new Vector3(5.261, 0, -54.389) },
				{ point: new Vector3(-11.482, 0, -54.169) },
			]
		},
		{
			points: [
				{ point: new Vector3(-23.221, 0, -25.042) },
				{ point: new Vector3(-24.250, 0, -25.830) },
				{ point: new Vector3(-19.793, 0, -30.928) },
				{ point: new Vector3(-14.707, 0, -31.499) },
				{ point: new Vector3(-8.650, 0, -30.421) },
				{ point: new Vector3(-6.250, 0, -26.707) },
				{ point: new Vector3(-7.678, 0, -24.927) },
				{ point: new Vector3(-23.221, 0, -25.042) },
			]
		},
		{
			points: [
				{ point: new Vector3(-32.891, 0, -14.414) },
				{ point: new Vector3(-33.005, 0, 0.103) },
				{ point: new Vector3(-11.348, 0, 1.318) },
				{ point: new Vector3(-10.948, 0, -14.505) },
				{ point: new Vector3(-32.891, 0, -14.414) },
			]
		},
		{
			points: [
				{ point: new Vector3(12.357142857142858, 4, 34) },
				{ point: new Vector3(11.714285714285715, 4, 32) },
				{ point: new Vector3(15.928571428571432, 4, 27) },
				{ point: new Vector3(25.571428571428573, 4, 27) },
				{ point: new Vector3(30.071428571428573, 4, 32) },
				{ point: new Vector3(29.071428571428573, 4, 34) },
				{ point: new Vector3(12.357142857142858, 4, 34) },
			]
		},
	],
	props: [],
	propZones: [
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePathPoints: [
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
				colour: 0x547621,
				bevelColour: 0x547621
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
			propNames: [{ name: 'TreeBulbous', chance: 0.65 }, { name: 'TreeTall', chance: 0.3 }, { name: 'LogSubmerged', chance: 0.05 }],
			zonePathPoints: [
				{ point: new Vector3(-36.461, 0, -13.132) },
				{ point: new Vector3(-51.146, 0, -12.828) },
				{ point: new Vector3(-53.946, 0, -10.162) },
				{ point: new Vector3(-54.061, 0, 28.538) },
				{ point: new Vector3(-50.289, 0, 33.184) },
				{ point: new Vector3(6.796, 0, 33.413) },
				{ point: new Vector3(14.846, 0, 24.399) },
				{ point: new Vector3(27.132, 0, 24.018) },
				{ point: new Vector3(34.732, 0, 33.084) },
				{ point: new Vector3(83.132, 0, 33.160) },
				{ point: new Vector3(89.312, 0, -12.430) },
				{ point: new Vector3(72.169, 0, -12.582) },
				{ point: new Vector3(64.341, 0, -18.448) },
				{ point: new Vector3(60.969, 0, -18.295) },
				{ point: new Vector3(54.969, 0, -14.182) },
				{ point: new Vector3(-4.173, 0, -13.191) },
				{ point: new Vector3(-7.488, 0, -10.754) },
				{ point: new Vector3(-8.631, 0, 2.959) },
				{ point: new Vector3(-11.373, 0, 5.930) },
				{ point: new Vector3(-34.663, 0, 5.373) },
				{ point: new Vector3(-37.863, 0, 0.726) },
				{ point: new Vector3(-36.461, 0, -13.132) },
			],
			propSparseness: 2.25,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 2 },
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0x547621,
				bevelColour: 0x547621
			},
		},
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePathPoints: [
				{ point: new Vector3(-72.226, 0, -53.610) },
				{ point: new Vector3(-16.626, 0, -53.667) },
				{ point: new Vector3(-9.197, 0, -45) },
				{ point: new Vector3(3.368, 0, -45) },
				{ point: new Vector3(8.968, 0, -54.251) },
				{ point: new Vector3(33.939, 0, -53.794) },
				{ point: new Vector3(29.025, 0, -40.932) },
				{ point: new Vector3(32.339, 0, -25.784) },
				{ point: new Vector3(-0.975, 0, -25.847) },
				{ point: new Vector3(-8.118, 0, -33) },
				{ point: new Vector3(-21.661, 0, -33) },
				{ point: new Vector3(-28.861, 0, -25.964) },
				{ point: new Vector3(-76.810, 0, -25.818) },
				{ point: new Vector3(-78.067, 0, -54.500) },
				{ point: new Vector3(-72.226, 0, -53.610) }
			],
			propSparseness: 2.25,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 2 },
			environmentTile: {
				type: "land",
				distance: 1,
				colour: 0x547621,
				bevelColour: 0x547621
			},
		},
		{
			propNames: [{ name: 'TreeBulbous', chance: 0.75 }, { name: 'TreeTall', chance: 0.25 }],
			zonePathPoints: [
				{ point: new Vector3(-46.5, 0, 48) },
				{ point: new Vector3(84.85714285714286, 0, 47) },
				{ point: new Vector3(87.14285714285715, 0, 106) },
				{ point: new Vector3(-80.28571428571426, 0, 105) },
				{ point: new Vector3(-82.4285714285710, 0, 69) },
				{ point: new Vector3(-54.99999999999997, 0, 66) },
				{ point: new Vector3(-46.357142857142826, 0, 56) },
				{ point: new Vector3(-46.5, 0, 48) },
			],
			propSparseness: 3,
			propScale: 4,
			positionRandom: 1.5,
			scaleRandom: { all: 2 },
			environmentTile: {
				type: "land",
				distance: 1,
				colour: 0x547621,
				bevelColour: 0x547621
			},
		},

		{
			propNames: [{ name: 'MountainInitial', chance: 1 }],
			zonePathPoints: [
				{ point: new Vector3(74, 0, -70) },
				{ point: new Vector3(63, 0, -62) },
				{ point: new Vector3(65.273, 0, -49) },
				{ point: new Vector3(65.330, 0, -31) },
				{ point: new Vector3(64.130, 0, -24) },
				{ point: new Vector3(74.130, 0, -15) },
				{ point: new Vector3(94.764, 0, -14) },
				{ point: new Vector3(94.730, 0, -69) },
				{ point: new Vector3(74, 0, -70) },
			],
			propSparseness: 3,
			propScale: 0.1,
			positionRandom: 2,
			scaleRandom: { all: 3 },
			environmentTile: false,
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(75.286, 0, -64.668) },
					{ point: new Vector3(70.429, 0, -58.070) },
					{ point: new Vector3(70.772, 0, -38.874) },
					{ point: new Vector3(73.058, 0, -22.127) },
					{ point: new Vector3(85.743, 0, -18.410) },
					{ point: new Vector3(92.772, 0, -21.066) },
					{ point: new Vector3(93.515, 0, -61.766) },
					{ point: new Vector3(75.286, 0, -64.668) },
				],
				attentuationDistance: 1,
				attenuatedScale: 10
			}
		},
		{
			propNames: [{ name: 'WaveSubtle', chance: 1 }],
			zonePathPoints: [
				{ point: new Vector3(-67.143, 0, -23.425) },
				{ point: new Vector3(-63.600, 0, -21.825) },
				{ point: new Vector3(-64.743, 0, -18.549) },
				{ point: new Vector3(-66.400, 0, -9.941) },
				{ point: new Vector3(-66.629, 0, 30.281) },
				{ point: new Vector3(-63.771, 0, 37.138) },
				{ point: new Vector3(-60.743, 0, 42.927) },
				{ point: new Vector3(-52.571, 0, 46.203) },
				{ point: new Vector3(-50.400, 0, 48.488) },
				{ point: new Vector3(-50.552, 0, 55.437) },
				{ point: new Vector3(-56.952, 0, 59.703) },
				{ point: new Vector3(-67.066, 0, 62.978) },
				{ point: new Vector3(-77.923, 0, 63.207) },
				{ point: new Vector3(-88.552, 0, 59.322) },
				{ point: new Vector3(-94.609, 0, 29.688) },
				{ point: new Vector3(-90.037, 0, -14.191) },
				{ point: new Vector3(-83.735, 0, -22.156) },
				{ point: new Vector3(-67.143, 0, -23.425) },
			],
			propSparseness: 5,
			propScale: 2,
			positionRandom: 3,
			scaleRandom: { all: 1 },
			environmentTile: {
				type: "sea",
				distance: -1.3,
				colour: 0x82aeff,
				bevelColour: 0x00291A
			},
		}
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
