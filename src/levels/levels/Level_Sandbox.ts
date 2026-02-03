import { PathGeometryTypes } from '../../data/PathInterfaces';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';
import { Vector3 } from 'three';

export const levelDetails: LevelDefinition = {
	difficulty: 1,
	creepOptions: [
		{
			name: 'CreepTrollDink',
			chance: 1
		}
	],
	terrain: TerrainTypes.sand,
	paths: [
		{
			id: "1",
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [
				{
					incomingControlPoint: new Vector3(
						-90,
						0,
						0
					),
					point: new Vector3(
						-90,
						0,
						0
					),
					outgoingControlPoint: new Vector3(
						-90,
						0,
						0
					)
				},
				{
					incomingControlPoint: new Vector3(
						0,
						0,
						-0.5
					),
					point: new Vector3(
						0,
						0,
						-0.5
					),
					outgoingControlPoint: new Vector3(
						0,
						0,
						-0.5
					)
				},
				{
					incomingControlPoint: new Vector3(
						90,
						0,
						0
					),
					point: new Vector3(
						90,
						0,
						0
					),
					outgoingControlPoint: new Vector3(
						90,
						0,
						0
					)
				},
			]
			/*pathPoints: [
				{
					incomingControlPoint: new Vector3(
						-2.1428571428571317,
						0,
						30.42857142857143
					),
					point: new Vector3(
						1.000000000000011,
						0,
						94.42857142857143
					),
					outgoingControlPoint: new Vector3(
						1.5714285714285827,
						0,
						47
					}
				),
				{
					incomingControlPoint: new Vector3(
						4.571428571428583,
						0,
						37.92857142857142
					),
					point: new Vector3(
						7.857142857142868,
						0,
						35.42857142857143
					),
					outgoingControlPoint: new Vector3(
						14.142857142857155,
						0,
						29.78571428571429
					}
				),
				{
					incomingControlPoint: new Vector3(
						28.642857142857153,
						0,
						19.857142857142858
					),
					point: new Vector3(
						27.85714285714287,
						0,
						12.142857142857142
					),
					outgoingControlPoint: new Vector3(
						28,
						0,
						9.071428571428571
					}
				),
				{
					incomingControlPoint: new Vector3(
						28.928571428571423,
						0,
						3.642857142857146
					),
					point: new Vector3(
						13.714285714285715,
						0,
						-2.6428571428571423
					),
					outgoingControlPoint: new Vector3(
						-13.071428571428571,
						0,
						-16.57142857142857
					}
				),
				{
					incomingControlPoint: new Vector3(
						-29.285714285714285,
						0,
						-10.5
					),
					point: new Vector3(
						-28.642857142857142,
						0,
						-25.642857142857142
					),
					outgoingControlPoint: new Vector3(
						-28.142857142857146,
						0,
						-30.07142857142857
					}
				),
				{
					incomingControlPoint: new Vector3(
						-28.928571428571427,
						0,
						-38
					),
					point: new Vector3(
						-18.928571428571434,
						0,
						-42.14285714285714
					),
					outgoingControlPoint: new Vector3(
						-5.857142857142857,
						0,
						-48.14285714285714
					}
				),
				{
					incomingControlPoint: new Vector3(
						5.21428571428571,
						0,
						-41.92857142857142
					),
					point: new Vector3(
						14.142857142857139,
						0,
						-49.99999999999999
					),
					outgoingControlPoint: new Vector3(
						22.28571428571428,
						0,
						-57.71428571428571
					}
				),
				{
					incomingControlPoint: new Vector3(
						24.71428571428571,
						0,
						-74.92857142857142
					),
					point: new Vector3(
						24.14285714285714,
						0,
						-99.28571428571428
					),
					outgoingControlPoint: new Vector3(
						28.14285714285714,
						0,
						-88.21428571428571
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
