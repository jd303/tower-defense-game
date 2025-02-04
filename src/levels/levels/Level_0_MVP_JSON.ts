import { PathGeometryTypes } from '../../data/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	terrain: TerrainTypes.sand,
	paths: [
		{
			id: 1,
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [
				{
					"incomingControlPoint": {
						"x": -2.1428571428571317,
						"y": 0,
						"z": 30.42857142857143
					},
					"point": {
						"x": 1.000000000000011,
						"y": 0,
						"z": 94.42857142857143
					},
					"outgoingControlPoint": {
						"x": 1.5714285714285827,
						"y": 0,
						"z": 47
					}
				},
				{
					"incomingControlPoint": {
						"x": 4.571428571428583,
						"y": 0,
						"z": 37.92857142857142
					},
					"point": {
						"x": 7.857142857142868,
						"y": 0,
						"z": 35.42857142857143
					},
					"outgoingControlPoint": {
						"x": 14.142857142857155,
						"y": 0,
						"z": 29.78571428571429
					}
				},
				{
					"incomingControlPoint": {
						"x": 28.642857142857153,
						"y": 0,
						"z": 19.857142857142858
					},
					"point": {
						"x": 27.85714285714287,
						"y": 0,
						"z": 12.142857142857142
					},
					"outgoingControlPoint": {
						"x": 28,
						"y": 0,
						"z": 9.071428571428571
					}
				},
				{
					"incomingControlPoint": {
						"x": 28.928571428571423,
						"y": 0,
						"z": 3.642857142857146
					},
					"point": {
						"x": 13.714285714285715,
						"y": 0,
						"z": -2.6428571428571423
					},
					"outgoingControlPoint": {
						"x": -13.071428571428571,
						"y": 0,
						"z": -16.57142857142857
					}
				},
				{
					"incomingControlPoint": {
						"x": -29.285714285714285,
						"y": 0,
						"z": -10.5
					},
					"point": {
						"x": -28.642857142857142,
						"y": 0,
						"z": -25.642857142857142
					},
					"outgoingControlPoint": {
						"x": -28.142857142857146,
						"y": 0,
						"z": -30.07142857142857
					}
				},
				{
					"incomingControlPoint": {
						"x": -28.928571428571427,
						"y": 0,
						"z": -38
					},
					"point": {
						"x": -18.928571428571434,
						"y": 0,
						"z": -42.14285714285714
					},
					"outgoingControlPoint": {
						"x": -5.857142857142857,
						"y": 0,
						"z": -48.14285714285714
					}
				},
				{
					"incomingControlPoint": {
						"x": 5.21428571428571,
						"y": 0,
						"z": -41.92857142857142
					},
					"point": {
						"x": 14.142857142857139,
						"y": 0,
						"z": -49.99999999999999
					},
					"outgoingControlPoint": {
						"x": 22.28571428571428,
						"y": 0,
						"z": -57.71428571428571
					}
				},
				{
					"incomingControlPoint": {
						"x": 24.71428571428571,
						"y": 0,
						"z": -74.92857142857142
					},
					"point": {
						"x": 24.14285714285714,
						"y": 0,
						"z": -99.28571428571428
					},
					"outgoingControlPoint": {
						"x": 28.14285714285714,
						"y": 0,
						"z": -88.21428571428571
					}
				}
			],
		},
		{
			id: 2,
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [
				{
					"incomingControlPoint": {
						"x": -64.28571428571428,
						"y": 0,
						"z": 21.5
					},
					"point": {
						"x": -59.42857142857142,
						"y": 0,
						"z": 23.642857142857142
					},
					"outgoingControlPoint": {
						"x": -51.57142857142857,
						"y": 0,
						"z": 24.642857142857142
					}
				},
				{
					"incomingControlPoint": {
						"x": -45.714285714285715,
						"y": 0,
						"z": 24.42857142857143
					},
					"point": {
						"x": -39.714285714285715,
						"y": 0,
						"z": 20.071428571428573
					},
					"outgoingControlPoint": {
						"x": -30.642857142857142,
						"y": 0,
						"z": 14.571428571428571
					}
				},
				{
					"incomingControlPoint": {
						"x": -29.57142857142857,
						"y": 0,
						"z": -6.7857142857142865
					},
					"point": {
						"x": -28.928571428571427,
						"y": 0,
						"z": -15.714285714285714
					},
					"outgoingControlPoint": {
						"x": -27.642857142857146,
						"y": 0,
						"z": -26.07142857142857
					}
				},
				{
					"incomingControlPoint": {
						"x": -30.928571428571427,
						"y": 0,
						"z": -35.714285714285715
					},
					"point": {
						"x": -18.71428571428572,
						"y": 0,
						"z": -42.07142857142857
					},
					"outgoingControlPoint": {
						"x": -5.857142857142857,
						"y": 0,
						"z": -48.14285714285714
					}
				},
				{
					"incomingControlPoint": {
						"x": 5.21428571428571,
						"y": 0,
						"z": -41.92857142857142
					},
					"point": {
						"x": 14.142857142857139,
						"y": 0,
						"z": -49.99999999999999
					},
					"outgoingControlPoint": {
						"x": 22.28571428571428,
						"y": 0,
						"z": -57.71428571428571
					}
				},
				{
					"incomingControlPoint": {
						"x": 24.71428571428571,
						"y": 0,
						"z": -74.92857142857142
					},
					"point": {
						"x": 24.14285714285714,
						"y": 0,
						"z": -99.28571428571428
					},
					"outgoingControlPoint": {
						"x": 28.14285714285714,
						"y": 0,
						"z": -88.21428571428571
					}
				}
			],
		},
	],
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
							type: 'TrollDink',
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
