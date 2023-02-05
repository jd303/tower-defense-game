export class Maths {
	/**
	 * Rounds a float to the nearest 0.25
	 * */
	static roundQuarter(number: number) {
		return Math.round(number * 4) / 4;
	}
}
