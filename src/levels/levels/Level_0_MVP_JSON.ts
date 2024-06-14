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
					point: new Vector3(1.25, 0, 95)
				},
				{
					point: new Vector3(1.75, 0, 67.75)
				},
				{
					point: new Vector3(2.75, 0, 47),
				},
				{
					point: new Vector3(7, 0, 35.25),
				},
				{
					point: new Vector3(18.25, 0, 26),
				},
				{
					incomingControlPoint: new Vector3(25, 0, 18),
					point: new Vector3(26, 0, 17),
					outgoingControlPoint: new Vector3(26, 0, 15)
				},
				{
					point: new Vector3(30, 0, 8),
				},
				{
					point: new Vector3(21, 0, 0),
				},
				{
					point: new Vector3(12, 0, -5.25),
				},
				{
					point: new Vector3(1, 0, -8),
				},
				{
					point: new Vector3(-9, 0, -13),
				},
				{
					point: new Vector3(-20.5, 0, -15),
				},
				{
					point: new Vector3(-26.25, 0, -15),
				},
				{
					point: new Vector3(-29, 0, -20),
				},
				{
					point: new Vector3(-29, 0, -27.75),
				},
				{
					point: new Vector3(-26.75, 0, -34.75),
				},
				{
					point: new Vector3(-22.25, 0, -38.75),
				},
				{
					point: new Vector3(-13.5, 0, -41.25),
				},
				{
					point: new Vector3(-0.25, 0, -46.25),
				},
				{
					point: new Vector3(10.25, 0, -51.5),
				},
				{
					point: new Vector3(17.25, 0, -52.25),
				},
				{
					point: new Vector3(19.75, 0, -57.25),
				},
				{
					point: new Vector3(20.5, 0, -65.75),
				},
				{
					point: new Vector3(21.25, 0, -81),
				},
				{
					point: new Vector3(22, 0, -94.25),
				},
				{
					point: new Vector3(22.25, 0, -99.75),
				},
			],
		},
		{
			id: 2,
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [
				{
					point: new Vector3(-61, 0.5, 23),
					outgoingControlPoint: new Vector3(-45, 0, 25)
				},
				{
					incomingControlPoint: new Vector3(-34, 0, 26),
					point: new Vector3(-30, 0, -10),
					outgoingControlPoint: new Vector3(-30, 0, -10)
				},
				{
					incomingControlPoint: new Vector3(-30, 0, -35),
					point: new Vector3(-30, 0, -30),
					outgoingControlPoint: new Vector3(-20, 0, -45)
				},
				{
					incomingControlPoint: new Vector3(-20, 0, -45),
					point: new Vector3(-12, 0, -45),
					outgoingControlPoint: new Vector3(-6, 0, -45)
				},
				{
					incomingControlPoint: new Vector3(-6, 0, -45),
					point: new Vector3(12, 0, -45),
					outgoingControlPoint: new Vector3(2, 0, -44)
				},
				{
					incomingControlPoint: new Vector3(22, 0, -47),
					point: new Vector3(22, 0, -65),
					outgoingControlPoint: new Vector3(22, 0, -75)
				},
				{
					incomingControlPoint: new Vector3(22, 0, -75),
					point: new Vector3(22, 0, -100),
					outgoingControlPoint: new Vector3(22, 0, -75)
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
