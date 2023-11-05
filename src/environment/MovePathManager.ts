import { ModelAsset } from './ModelAsset';
import { MovePathDefinition } from '../data/PathInterfaces';
import { TowerStats } from './towers/TowerStats';
import { Vector3 } from 'three';
import { PathService } from '../game/PathService';

export class MovePathManager {
	/**
	 * Core Properties
	 * */
	parent: ModelAsset;
	paths: MovePathDefinition[] = [];
	activePath?: MovePathDefinition;

	/**
	 * Constructor
	 * */
	constructor(parent: ModelAsset) {
		this.parent = parent;
	}

	addPath(path: MovePathDefinition) {
		this.paths.push(path);
	}

	removePath(pathID: string) {
		this.paths = this.paths.filter(path => path.id !== pathID);
	}

	setActivePath(id: string, switchToPrevious: boolean = true) {
		const startingPath = this.activePath;
		const path = this.paths.find(path => path.id == id);
		if (path && !(this.parent.stats instanceof TowerStats)) {
			this.paths.forEach(path => path.active = false);
			path.active = true;
			this.activePath = path;
			this.activePath.pathTravelPercentagePerSec = this.parent.stats.movement.speed / path.pathLength;

			if (switchToPrevious && startingPath) {
				this.activePath.switchToOnComplete = startingPath.id;
			}
		}
	}

	resolveEndOfPath(): boolean {
		if (this.activePath?.switchToOnComplete) {
			const switchablePath = this.paths.find(path => path.id = this.activePath!.switchToOnComplete!);
			
			if (switchablePath) {
				this.removePath(this.activePath.id);
				this.activePath = switchablePath;
				return false;
			}
		}

		return true;
	}

	completeActivePath() {
		this.paths = this.paths.filter(path => path !== this.activePath);

		if (this.activePath!.switchToOnComplete) {
			this.setActivePath(this.activePath!.switchToOnComplete);
		} else {
			this.activePath = undefined;
		}
	}

	/**
	 * Asks a model to rejoin the core path
	 * */
	rejoinCorePath() {
		const corePath = this.paths.find(path => path.id = "core");
		
		if (corePath) {
			const sPath: PathService = this.parent.main.s('Path');
			corePath.pathProgress += 0.03;
			const rejoinPoint = corePath.path.getPointAt(corePath.pathProgress) as Vector3;
			const rejoinPath = sPath.createMovePath('rejoin', sPath.createStraightPathSegments(this.parent.groupMain.position, rejoinPoint));
			rejoinPath.switchToOnComplete = "core";
			this.parent.stateMachine.activateStateByName('uninterceptable');
			this.parent.movePathManager.addPath(rejoinPath);
			this.parent.movePathManager.setActivePath(rejoinPath.id, false);
		} else {
			return new Error('Core Path not set');			
		}
	}
}