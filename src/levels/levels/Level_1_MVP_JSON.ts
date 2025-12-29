import { PathGeometryTypes } from '../../data/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	terrain: TerrainTypes.sand,
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
			propNames: ['tree_thin', 'tree_lollipop', 'tree_forked', 'tree_spread'],
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
			propDensityFactor: 2.25,
			propScale: 2,
			positionRandom: 1.5,
			scaleRandom: { all: 0.25 },
			rotateRandom: 0.5,
			environmentTile: {
				show: true,
				distance: 1.25,
				colour: 0x6B8B42,
			},
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(-79.70288, 0, -86.66697) },
					{ point: new Vector3(-50.09736, 0, -86.47657) },
					{ point: new Vector3(-15.19903, 0, -85.96763) },
					{ point: new Vector3(40.45580, 0, -81.25774) }
				],
				attentuationDistance: 20,
				attenuatedScale: 0.5
			}
		},
		{
			propNames: ['tree_thin', 'tree_lollipop', 'tree_forked', 'tree_spread'],
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
			propDensityFactor: 2.25,
			propScale: 1,
			positionRandom: 1.5,
			scaleRandom: { all: 0.25 },
			rotateRandom: 0.5,
			environmentTile: {
				show: true,
				distance: 1,
				colour: 0x6B8B42,
			},
		},
		{
			propNames: ['rock_1'],
			zonePathPoints: [
				{ point: new Vector3(72.358, 0, -68.730) },
				{ point: new Vector3(62.130, 0, -60.759) },
				{ point: new Vector3(65.273, 0, -47.101) },
				{ point: new Vector3(65.330, 0, -29.896) },
				{ point: new Vector3(64.130, 0, -22.788) },
				{ point: new Vector3(74.130, 0, -13.131) },
				{ point: new Vector3(94.764, 0, -12.411) },
				{ point: new Vector3(94.730, 0, -67.545) },
				{ point: new Vector3(72.358, 0, -68.730) },
			],
			propDensityFactor: 2.5,
			propScale: 4,
			positionRandom: 0.5,
			scaleRandom: { all: 2, y: 4 },
			rotateRandom: 0.5,
			environmentTile: {
				show: false,
			},
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
		}
	],
	propColourisation: {
		"tree_cone_2": { g: 0.5 },
		"tree_spread": { g: 0.5 },
		"mesa_1": { b: 0.25 },
		"rubble_1": { l: -0.5 },
	},
	waves: [
		{
			id: 1,
			waveStartTime: 0,
			pathID: '1',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'TrollDink',
						},
						/*{
							id: '2',
							type: 'TrollDink',
						},
						{
							id: '3',
							type: 'TrollDink',
						},
						{
							id: '4',
							type: 'TrollDink',
						},*/
						{
							id: '5',
							type: 'Troll',
						},
						{
							id: '6',
							type: 'Wisp',
						},
					],
				},
			],
		},
		{
			id: 2,
			waveStartTime: 4000,
			pathID: '2',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'TrollDink',
						},
						{
							id: '2',
							type: 'TrollDink',
						},
						{
							id: '3',
							type: 'TrollDink',
						},
						{
							id: '4',
							type: 'Wisp',
						},
						{
							id: '5',
							type: 'Lupine',
						},
						{
							id: '6',
							type: 'Lupine',
						},
						{
							id: '7',
							type: 'Lupine',
						},
						{
							id: '8',
							type: 'Lupine',
						},
					],
				},
			],
		},
		{
			id: 3,
			waveStartTime: 10000,
			pathID: '1',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'TrollDink',
						},
						{
							id: '2',
							type: 'TrollDink',
						},
						{
							id: '3',
							type: 'TrollDink',
						},
						{
							id: '4',
							type: 'TrollDink',
						},
						{
							id: '5',
							type: 'Lupine',
						},
						{
							id: '6',
							type: 'Lupine',
						},
					],
				},
			],
		},
		{
			id: 4,
			waveStartTime: 17500,
			pathID: '1',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'TrollDink',
						},
						{
							id: '2',
							type: 'TrollDink',
						},
						{
							id: '3',
							type: 'TrollDink',
						},
						{
							id: '4',
							type: 'TrollDink',
						},
						{
							id: '5',
							type: 'Troll',
						},
						{
							id: '6',
							type: 'Troll',
						},
					],
				},
			],
		},
		{
			id: 5,
			waveStartTime: 24000,
			pathID: '2',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'TrollDink',
						},
						{
							id: '2',
							type: 'TrollDink',
						},
						{
							id: '3',
							type: 'TrollDink',
						},
						{
							id: '4',
							type: 'TrollDink',
						},
						{
							id: '5',
							type: 'Troll',
						},
						{
							id: '6',
							type: 'Troll',
						},
					],
				},
			],
		},
	],
};
