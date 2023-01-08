import { PathTypes } from '../data/PathInterfaces';
import { Vector3 } from 'three';

export const levelDetails = {
	paths: [
		{
			id: 1,
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(-10, 0.5, 40), new Vector3(-10, 0.5, 20)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(-10, 0.5, 20), new Vector3(5, 0.5, 20)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 20), new Vector3(5, 0.5, 10)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 10), new Vector3(5, 0.5, -40)],
				},
			],
		},
		{
			id: 2,
			segments: [
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 40), new Vector3(5, 0.5, 20)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 20), new Vector3(5, 0.5, 10)],
				},
				{
					type: PathTypes.straight,
					points: [new Vector3(5, 0.5, 10), new Vector3(5, 0.5, -40)],
				},
			],
		},
		{
			id: 3,
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
							type: 'CreepMVPMonster',
						},
						{
							id: '2',
							type: 'CreepMVPMonster',
						},
						{
							id: '3',
							type: 'CreepMVPMonster',
						},
						{
							id: '4',
							type: 'CreepMVPMonster',
						},
						{
							id: '5',
							type: 'CreepMVPMonster',
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
							type: 'CreepMVPMonster',
						},
						{
							id: '2',
							type: 'CreepMVPMonster',
						},
						{
							id: '3',
							type: 'CreepMVPMonster',
						},
					],
				},
			],
		},
		{
			id: 3,
			delayFromLastWave: 1000,
			pathID: '3',
			difficulty: 5,
			creepGroups: [
				{
					id: '1',
					creeps: [
						{
							id: '1',
							type: 'CreepMVPMonster',
						},
						{
							id: '2',
							type: 'CreepMVPMonster',
						},
						{
							id: '3',
							type: 'CreepMVPMonster',
						},
						{
							id: '4',
							type: 'CreepMVPMonster',
						},
						{
							id: '5',
							type: 'CreepMVPMonster',
						},
						{
							id: '6',
							type: 'CreepMVPMonster',
						},
					],
				},
			],
		},
	],
};
