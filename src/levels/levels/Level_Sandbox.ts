import { PathGeometryTypes } from '../../data/PathInterfaces';
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
						"x": -90,
						"y": 0,
						"z": 0
					},
					"point": {
						"x": -90,
						"y": 0,
						"z": 0
					},
					"outgoingControlPoint": {
						"x": -90,
						"y": 0,
						"z": 0
					}
				}, {
					"incomingControlPoint": {
						"x": 0,
						"y": 0,
						"z": -0.5
					},
					"point": {
						"x": 0,
						"y": 0,
						"z": -0.5
					},
					"outgoingControlPoint": {
						"x": 0,
						"y": 0,
						"z": -0.5
					}
				},
				{
					"incomingControlPoint": {
						"x": 90,
						"y": 0,
						"z": 0
					},
					"point": {
						"x": 90,
						"y": 0,
						"z": 0
					},
					"outgoingControlPoint": {
						"x": 90,
						"y": 0,
						"z": 0
					}
				},
			]
			/*pathPoints: [
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
			],*/
		}
	],
	towerPlacementZones: [

	],
	props: [

	],
	propZones: [

	],
	propColourisation: {},
};
