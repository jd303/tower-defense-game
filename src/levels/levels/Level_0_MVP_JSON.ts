import { PathGeometryTypes, PathTypes } from '../../data/PathInterfaces';
import { Vector3 } from 'three';
import { LevelDefinition, TerrainTypes } from '../../data/LevelInterfaces';

export const levelDetails: LevelDefinition = {
	terrain: TerrainTypes.sand,
	paths: [
		{
			id: 1,
			pathGeometry: PathGeometryTypes.dirt,
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(1.25, 0, 95), new Vector3(1.75, 0, 67.75)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(1.75, 0, 67.75), new Vector3(2.75, 0, 47)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(2.75, 0, 47), new Vector3(7, 0, 35.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(7, 0, 35.25), new Vector3(18.25, 0, 26)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(18.25, 0, 26), new Vector3(26, 0, 17)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(26, 0, 17), new Vector3(30, 0, 8)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(30, 0, 8), new Vector3(21, 0, 0)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(21, 0, 0), new Vector3(12, 0, -5.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(12, 0, -5.25), new Vector3(1, 0, -8)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(1, 0, -8), new Vector3(-9, 0, -13)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-9, 0, -13), new Vector3(-20.5, 0, -15)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-20.5, 0, -15), new Vector3(-26.25, 0, -15)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-26.25, 0, -15), new Vector3(-29, 0, -20)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-29, 0, -20), new Vector3(-29, 0, -27.75)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-29, 0, -27.75), new Vector3(-26.75, 0, -34.75)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-26.75, 0, -34.75), new Vector3(-22.25, 0, -38.75)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-22.25, 0, -38.75), new Vector3(-13.5, 0, -41.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-13.5, 0, -41.25), new Vector3(-0.25, 0, -46.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-0.25, 0, -46.25), new Vector3(10.25, 0, -51.5)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(10.25, 0, -51.5), new Vector3(17.25, 0, -52.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(17.25, 0, -52.25), new Vector3(19.75, 0, -57.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(19.75, 0, -57.25), new Vector3(20.5, 0, -65.75)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(20.5, 0, -65.75), new Vector3(21.25, 0, -81)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(21.25, 0, -81), new Vector3(22, 0, -94.25)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(22, 0, -94.25), new Vector3(22.25, 0, -99.75)],
				},
			],
		},
		{
			id: 2,
			//pathGeometry: PathGeometryTypes.rock,
			pathGeometry: PathGeometryTypes.dirt,
			segments: [
				{
					type: PathTypes.bezier,
					points: [new Vector3(-61, 0.5, 23), new Vector3(-30, 0, -10)],
					controlPoints: [new Vector3(-45, 0, 25), new Vector3(-34, 0, 26)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(-30, 0, -10), new Vector3(-30, 0, -30)],
					controlPoints: [new Vector3(-30, 0, -10), new Vector3(-30, 0, -35)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(-30, 0, -30), new Vector3(-12, 0, -45)],
					controlPoints: [new Vector3(-20, 0, -45), new Vector3(-20, 0, -45)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(-12, 0, -45), new Vector3(12, 0, -45)],
					controlPoints: [new Vector3(-6, 0, -45), new Vector3(-6, 0, -45)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(12, 0, -45), new Vector3(22, 0, -65)],
					controlPoints: [new Vector3(2, 0, -44), new Vector3(22, 0, -47)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(22, 0, -65), new Vector3(22, 0, -100)],
					controlPoints: [new Vector3(22, 0, -75), new Vector3(22, 0, -75)],
				},
			],
		},
		/*{
			// TEST PATH
			id: 3,
			pathGeometry: PathGeometryTypes.rock,
			segments: [
				{
					type: PathTypes.bezier,
					points: [new Vector3(-75, 0, -75), new Vector3(-22, 0, 64)],
					controlPoints: [new Vector3(-45, 0, -75), new Vector3(-45, 0, 57)],
				},
				{
					type: PathTypes.bezier,
					points: [new Vector3(-22, 0, 64), new Vector3(65, 0, -75)],
					controlPoints: [new Vector3(50, 0, 90), new Vector3(20, 0, -45)],
				},
			],
		},*/
	],
	waves: [
		{
			id: 1,
			delayFromLastWave: 0,
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
			delayFromLastWave: 1000,
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
							type: 'Troll',
						},
						{
							id: '4',
							type: 'Wisp',
						},
					],
				},
			],
		},
	],
};
