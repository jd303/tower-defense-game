import * as THREE from 'three';
import { Main } from '../../core/Main';
import { Maths } from '../../core/Maths';
import { PropGroup } from '../PropGroup';
import { TreeCone1_2 } from './TreeCone1_2';
import { Prop2 } from '../Prop2';

import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// TODO: Allow users to pass a type of tree

export class Forest extends PropGroup {
	trees: Prop2[] = [];

	constructor(main: Main, number: number, scale: number, scaleRandom: number, positionRandom: number) {
		super(main);

		this.groupMain = new THREE.Group();
		this.groupMain.name = 'main-outer';

		this.groupTransforms = new THREE.Group();
		this.groupTransforms.name = 'transforms-mid';

		this.groupModel = new THREE.Group();
		this.groupModel.name = 'model-inner';

		this.groupTransforms.add(this.groupModel);
		this.groupMain.add(this.groupTransforms);

		const positions = Maths.generateRandomPositions(number, positionRandom, 1);
		console.log(positions);

		for (let i = 0; i < number; i++) {
			const newTree = new TreeCone1_2(main);

			const positionRandomSeed = Math.random();
			newTree.groupMain.position.x = positions[i].x + (positionRandomSeed * 2 * positionRandom) - positionRandom;
			newTree.groupMain.position.z = positions[i].z + (positionRandomSeed * 2 * positionRandom) - positionRandom;

			const scaleRandomSeed = Math.random();
			const scaleValue = scale + (scaleRandomSeed * 2 * scaleRandom) - scaleRandom;
			newTree.groupMain.scale.set(scaleValue, scaleValue, scaleValue);
			this.trees.push(newTree);
			//this.groupModel.add(newTree.groupMain);
		}

		console.log("%c !!!!!!! Forest to be finished:", 'color: green');
		console.log("T!", this.trees[0]);
		console.log("NOT LOADING - NEEDS WORK");

		Promise.all(this.trees.map(tree => tree.loadCompletePromise))
			.then(() => {
				console.log("LOADED");
				const groups = [...this.trees.map(tree => tree.groupMain)]; console.log(groups);
				const treeMeshes: any[] = [];

				groups.forEach((group: THREE.Group) => {
					console.log("G", group, group.children, group.up.y);
					group.children.forEach((mesh: any) => {
						console.log("M", mesh);
						treeMeshes.push(mesh);
					});
				});

				console.log("TM", treeMeshes);
			});
		/*const mergedTrees = BufferGeometryUtils.mergeGeometries([...this.trees.map(tree => [...tree.groupMain.children])]);
		console.log(mergedTrees);*/
	}
}
