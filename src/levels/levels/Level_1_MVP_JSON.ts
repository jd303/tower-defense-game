import { PathGeometryTypes } from '../../data/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	terrain: TerrainTypes.grass,
	paths: [
		{
			id: 1,
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [{ "incomingControlPoint": { "x": -80, "y": 0, "z": -63.57142857142858 }, "point": { "x": -80, "y": 0, "z": -59.64285714285714 }, "outgoingControlPoint": { "x": -66.5, "y": 0, "z": -60.57142857142857 } }, { "incomingControlPoint": { "x": 29.642857142857146, "y": 0, "z": -59.357142857142854 }, "point": { "x": 49.642857142857146, "y": 0, "z": -59.42857142857142 }, "outgoingControlPoint": { "x": 54.42857142857143, "y": 0, "z": -59.57142857142857 } }, { "incomingControlPoint": { "x": 59.642857142857146, "y": 0, "z": -55.42857142857142 }, "point": { "x": 59.28571428571429, "y": 0, "z": -49.57142857142857 }, "outgoingControlPoint": { "x": 59.21428571428572, "y": 0, "z": -39.71428571428571 } }, { "incomingControlPoint": { "x": 59.50000000000001, "y": 0, "z": -36.14285714285714 }, "point": { "x": 59.28571428571429, "y": 0, "z": -29.857142857142854 }, "outgoingControlPoint": { "x": 59.50000000000001, "y": 0, "z": -25.571428571428573 } }, { "incomingControlPoint": { "x": 55.92857142857143, "y": 0, "z": -19.64285714285714 }, "point": { "x": 49.50000000000001, "y": 0, "z": -19.857142857142854 }, "outgoingControlPoint": { "x": 21.000000000000007, "y": 0, "z": -19.57142857142857 } }, { "incomingControlPoint": { "x": -1.9285714285714235, "y": 0, "z": -19.785714285714285 }, "point": { "x": -49.49999999999999, "y": 0, "z": -19.928571428571427 }, "outgoingControlPoint": { "x": -54.928571428571416, "y": 0, "z": -19.857142857142854 } }, { "incomingControlPoint": { "x": -59.428571428571416, "y": 0, "z": -16.357142857142854 }, "point": { "x": -59.49999999999999, "y": 0, "z": -10.07142857142857 }, "outgoingControlPoint": { "x": -59.64285714285713, "y": 0, "z": -0.42857142857142616 } }, { "incomingControlPoint": { "x": -59.49999999999999, "y": 0, "z": 5.0000000000000036 }, "point": { "x": -59.49999999999999, "y": 0, "z": 29.42857142857143 }, "outgoingControlPoint": { "x": -59.428571428571416, "y": 0, "z": 35.42857142857143 } }, { "incomingControlPoint": { "x": -54.78571428571428, "y": 0, "z": 39.50000000000001 }, "point": { "x": -49.42857142857142, "y": 0, "z": 39.42857142857143 }, "outgoingControlPoint": { "x": -29.714285714285708, "y": 0, "z": 39.57142857142858 } }, { "incomingControlPoint": { "x": -3.9285714285714235, "y": 0, "z": 39.142857142857146 }, "point": { "x": 78, "y": 0, "z": 39.57142857142858 }, "outgoingControlPoint": { "x": 39.50000000000001, "y": 0, "z": 39.57142857142858 } }],
		}
	],
	towerPlacementZones: [
		// First bend inner
		{
			points: [
				{ point: new Vector3(37.611, 0, -54.319) },
				{ point: new Vector3(52.297, 0, -52.797) },
				{ point: new Vector3(54.354, 0, -38.775) },
				{ point: new Vector3(50.697, 0, -25.464) },
				{ point: new Vector3(38.125, 0, -25.997) },
				{ point: new Vector3(32.354, 0, -38.386) },
				{ point: new Vector3(37.611, 0, -54.319) },
			]
		},
		{
			points: [
				{ point: new Vector3(-34.946, 0, -65) },
				{ point: new Vector3(-32.603, 0, -73) },
				{ point: new Vector3(-28.031, 0, -73) },
				{ point: new Vector3(-23.117, 0, -73) },
				{ point: new Vector3(-21.346, 0, -65.634) },
				{ point: new Vector3(-34.946, 0, -65) },
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
		}
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
			rotateRandom: 0.5,
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0x547621,
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
			rotateRandom: 0.5,
			environmentTile: {
				type: "land",
				distance: 1.25,
				colour: 0x547621,
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
			rotateRandom: 0.5,
			environmentTile: {
				type: "land",
				distance: 1,
				colour: 0x547621,
			},
		},
		{
			propNames: [{ name: 'MountainInitial', chance: 1 }],
			zonePathPoints: [
				{ point: new Vector3(72.358, 0, -70) },
				{ point: new Vector3(62.130, 0, -62) },
				{ point: new Vector3(65.273, 0, -49) },
				{ point: new Vector3(65.330, 0, -31) },
				{ point: new Vector3(64.130, 0, -24) },
				{ point: new Vector3(74.130, 0, -15) },
				{ point: new Vector3(94.764, 0, -14) },
				{ point: new Vector3(94.730, 0, -69) },
				{ point: new Vector3(72.358, 0, -70) },
			],
			propSparseness: 5,
			propScale: 1,
			positionRandom: 2,
			scaleRandom: { all: 5 },
			rotateRandom: 0.5,
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
			rotateRandom: 0.5,
			environmentTile: {
				type: "sea",
				distance: -1.3,
				colour: 0x82aeff,
			},
		}
	],
	propColourisation: {
		"TreeBulbous": { r: 0.35, b: 0.25, l: -0.3 },
		"TreeFir": { r: 0.75, b: 0.33, l: -0.5 },
		"TreeTall": { r: 0.75, b: 0.33, l: -0.5 },
		"MountainInitial": { r: 0.1, l: -0.25 },
	},
};
