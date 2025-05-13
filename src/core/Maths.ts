export class Maths {
	/**
	 * Rounds a float to the nearest 0.25
	 * */
	static roundQuarter(number: number) {
		return Math.round(number * 4) / 4;
	}

	/**
	 * Adds a random range to either side of a number
	 */
	static addBipolarRandom(original: number, randomRange: number) {
		const randomFactor = Math.random() * 2 - 1;
		return original + randomFactor * randomRange;
	}

	static getRandomFloat(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	/**
	 * Returns an attenuated value based on a max and min
	 * @param rangePosition // Where our comparison value is
	 * @param rangeStart // The minimum value of our comparison range
	 * @param rangeEnd // The maximum range of our comparison range
	 * @param attenuationStrength // How much to attenuate, higher is stronger
	 * @param minVal // Optional: change the minimum attenuated value
	 * @param minVal // Optional: change the maximum attenuated value
	 * @returns A number
	 * Usage: getAttenuatedValue(75, 0, 100, 1, 0, 1) returns 0.25, given that 75 is 75% of the way through 0-100
	 */
	static getAttenuatedValue(rangePosition: number, rangeStart = 0, rangeEnd = 100, attenuationStrength = 1, minVal = 0, maxVal = 1) {
		let t = (rangePosition - rangeStart) / (rangeEnd - rangeStart);
		t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]
		t = 1 - Math.pow(1 - t, attenuationStrength); // Attenuate

		return maxVal - t * (maxVal - minVal);
	}

	/**
	 * Generates numberOfItems positions in a grid of size range x range
	 */
	/*static generateRandomPositions(numberOfItems: number, range: number, minimumDistance: number = 1) {
		if (range === 0) throw new Error("Range cannot be 0.");

		const positions = [];

		// Helper function to calculate distance between two points
		function distance(p1: THREE.Vector3, p2: THREE.Vector3) {
			const dx = p2.x - p1.x;
			const dz = p2.z - p1.z;
			return Math.sqrt(dx * dx + dz * dz);
		}

		// Generate random positions until we have 20 positions
		const maxTries = 100;
		let currentTry = 0;
		while (positions.length < numberOfItems && currentTry < maxTries) {
			currentTry += 1;

			let newPosition: THREE.Vector3;
			if (range) newPosition = new THREE.Vector3(Math.random() * range, 0, Math.random() * range);
			else newPosition = new THREE.Vector3(0, 0, 0);

			let isValid = true;

			// Check distance from new position to existing positions
			for (const existingPosition of positions) {
				if (distance(newPosition, existingPosition) < minimumDistance) {
					isValid = false;
					break;
				}
			}

			// If position is valid, add it to the array
			if (isValid) {
				positions.push(newPosition);
			} else if (currentTry == maxTries) {
				positions.push(newPosition);
			}
		}

		if (positions.length < numberOfItems) throw new Error("Could not generate enough positions.");

		return positions;
	}*/
}
