import { PathTypes } from '../data/PathInterfaces';
import { Vector3 } from 'three';

export const levelDetails = {
	paths: [
		{
			id: 1,
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(3, 0.5, 90), new Vector3(3, 0.5, 40)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(3, 0.5, 40), new Vector3(28, 0.5, 15)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(28, 0.5, 15), new Vector3(28, 0.5, 0)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(28, 0.5, 0), new Vector3(-30, 0.5, -10)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-30, 0.5, -10), new Vector3(-30, 0.5, -30)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-30, 0.5, -30), new Vector3(22, 0.5, -48)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(22, 0.5, -48), new Vector3(22, 0.5, -90)],
				},
			],
		},
		{
			id: 2,
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(-50, 0.5, -3), new Vector3(-5, 0.5, -3)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-5, 0.5, -3), new Vector3(-5, 0.5, -40)],
				},
			],
		},
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
					],
				},
			],
		},
		{
			id: 2,
			delayFromLastWave: 2000,
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
							type: 'Troll',
						},
					],
				},
			],
		},
		{
			id: 3,
			delayFromLastWave: 3000,
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
