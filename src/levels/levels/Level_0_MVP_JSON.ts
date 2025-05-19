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
			],
		},
		{
			id: 2,
			pathGeometry: PathGeometryTypes.dirt,
			pathPoints: [
				{
					"incomingControlPoint": {
						"x": -64.28571428571428,
						"y": 0,
						"z": 21.5
					},
					"point": {
						"x": -59.42857142857142,
						"y": 0,
						"z": 23.642857142857142
					},
					"outgoingControlPoint": {
						"x": -51.57142857142857,
						"y": 0,
						"z": 24.642857142857142
					}
				},
				{
					"incomingControlPoint": {
						"x": -45.714285714285715,
						"y": 0,
						"z": 24.42857142857143
					},
					"point": {
						"x": -39.714285714285715,
						"y": 0,
						"z": 20.071428571428573
					},
					"outgoingControlPoint": {
						"x": -30.642857142857142,
						"y": 0,
						"z": 14.571428571428571
					}
				},
				{
					"incomingControlPoint": {
						"x": -29.57142857142857,
						"y": 0,
						"z": -6.7857142857142865
					},
					"point": {
						"x": -28.928571428571427,
						"y": 0,
						"z": -15.714285714285714
					},
					"outgoingControlPoint": {
						"x": -27.642857142857146,
						"y": 0,
						"z": -26.07142857142857
					}
				},
				{
					"incomingControlPoint": {
						"x": -30.928571428571427,
						"y": 0,
						"z": -35.714285714285715
					},
					"point": {
						"x": -18.71428571428572,
						"y": 0,
						"z": -42.07142857142857
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
			],
		},
	],
	towerPlacementZones: [
		// West
		{
			points: [
				{ point: new Vector3(-44.350, 0, 7.333) },
				{ point: new Vector3(-42.950, 0, 7.000) },
				{ point: new Vector3(-40.283, 0, 9.066) },
				{ point: new Vector3(-38.016, 0, 9.633) },
				{ point: new Vector3(-39.550, 0, 13.333) },
				{ point: new Vector3(-42.983, 0, 16.500) },
				{ point: new Vector3(-47.916, 0, 18.800) },
				{ point: new Vector3(-52.283, 0, 19.400) },
				{ point: new Vector3(-52.950, 0, 15.466) },
				{ point: new Vector3(-48.083, 0, 12.566) },
				{ point: new Vector3(-44.350, 0, 7.333) },
			]
		},
		// Crossroads
		{
			points: [
				{ point: new Vector3(-24.186, 0, -10.042) },
				{ point: new Vector3(-25.380, 0, -0.138) },
				{ point: new Vector3(-26.309, 0, 4.726) },
				{ point: new Vector3(-24.540, 0, 5.832) },
				{ point: new Vector3(-20.251, 0, 0.526) },
				{ point: new Vector3(-14.547, 0, -2.967) },
				{ point: new Vector3(-9.993, 0, -4.913) },
				{ point: new Vector3(-9.860, 0, -6.549) },
				{ point: new Vector3(-19.455, 0, -8.892) },
				{ point: new Vector3(-24.186, 0, -10.042) },
			]
		},
		// AfterCrossroads
		{
			points: [
				{ point: new Vector3(-16.068, 0, -37.316) },
				{ point: new Vector3(-14.101, 0, -36.083) },
				{ point: new Vector3(-14.368, 0, -33.383) },
				{ point: new Vector3(-14.135, 0, -28.916) },
				{ point: new Vector3(-15.235, 0, -27.250) },
				{ point: new Vector3(-21.768, 0, -24.950) },
				{ point: new Vector3(-23.501, 0, -25.316) },
				{ point: new Vector3(-22.635, 0, -30.550) },
				{ point: new Vector3(-20.301, 0, -34.483) },
				{ point: new Vector3(-16.068, 0, -37.316) },
			]
		},
		// Northern Forest
		{
			points: [
				{ point: new Vector3(20.282, 0, -15.464) },
				{ point: new Vector3(10.054, 0, -12.264) },
				{ point: new Vector3(10.339, 0, -9.921) },
				{ point: new Vector3(21.254, 0, -5.121) },
				{ point: new Vector3(27.196, 0, -0.949) },
				{ point: new Vector3(30.054, 0, 2.022) },
				{ point: new Vector3(31.996, 0, 0.936) },
				{ point: new Vector3(31.539, 0, -7.006) },
				{ point: new Vector3(28.739, 0, -12.264) },
				{ point: new Vector3(20.282, 0, -15.464) },
			]
		},
		// Long Path Forest Crook
		{
			points: [
				{ point: new Vector3(-2.090, 0, 44.182) },
				{ point: new Vector3(-0.998, 0, 44.686) },
				{ point: new Vector3(-1.670, 0, 52.121) },
				{ point: new Vector3(-2.426, 0, 62.622) },
				{ point: new Vector3(-3.476, 0, 62.790) },
				{ point: new Vector3(-5.114, 0, 58.044) },
				{ point: new Vector3(-6.921, 0, 50.987) },
				{ point: new Vector3(-5.997, 0, 47.668) },
				{ point: new Vector3(-2.090, 0, 44.182) },
			]
		},
		// Long Path Forest Crook 2
		{
			points: [
				{ point: new Vector3(20.643, 0, 8.248) },
				{ point: new Vector3(21.909, 0, 9.848) },
				{ point: new Vector3(22.776, 0, 12.615) },
				{ point: new Vector3(21.676, 0, 15.382) },
				{ point: new Vector3(18.443, 0, 18.682) },
				{ point: new Vector3(13.009, 0, 14.182) },
				{ point: new Vector3(13.143, 0, 13.148) },
				{ point: new Vector3(20.643, 0, 8.248) },
			]
		},
		// South East Wing
		{
			points: [
				{ point: new Vector3(6.538, 0, 68.418) },
				{ point: new Vector3(9.681, 0, 70.076) },
				{ point: new Vector3(15.795, 0, 67.676) },
				{ point: new Vector3(18.081, 0, 59.383) },
				{ point: new Vector3(20.252, 0, 42.062) },
				{ point: new Vector3(32.709, 0, 29.819) },
				{ point: new Vector3(35.395, 0, 25.134) },
				{ point: new Vector3(31.967, 0, 22.734) },
				{ point: new Vector3(29.281, 0, 22.791) },
				{ point: new Vector3(22.538, 0, 29.876) },
				{ point: new Vector3(11.338, 0, 39.534) },
				{ point: new Vector3(9, 0, 45) },
				{ point: new Vector3(8, 0, 50) },
				{ point: new Vector3(6.538, 0, 68.418) },
			]
		},
		// End Path
		{
			points: [
				{ point: new Vector3(-17.722, 0, -47.914) },
				{ point: new Vector3(-19.436, 0, -48.829) },
				{ point: new Vector3(-20.293, 0, -52.016) },
				{ point: new Vector3(-22.407, 0, -56.713) },
				{ point: new Vector3(-20.922, 0, -60.714) },
				{ point: new Vector3(-13.150, 0, -64.828) },
				{ point: new Vector3(-4.522, 0, -64.885) },
				{ point: new Vector3(3.935, 0, -66.085) },
				{ point: new Vector3(12.850, 0, -69.857) },
				{ point: new Vector3(17.307, 0, -70.657) },
				{ point: new Vector3(15.935, 0, -62.596) },
				{ point: new Vector3(13.135, 0, -56.635) },
				{ point: new Vector3(8.221, 0, -52.521) },
				{ point: new Vector3(0.164, 0, -50.578) },
				{ point: new Vector3(-10.179, 0, -50.143) },
				{ point: new Vector3(-17.722, 0, -47.914) },
			]
		}
	],
	props: [
		{
			assetName: 'mountain_4',
			position: new Vector3(65, 0, 72),
			scale: new Vector3(1.25, 0.75, 1.25),
			rotate: new Vector3(0, -1, 0)
		},
		{
			assetName: 'mountain_5',
			position: new Vector3(50, 0, 85),
			scale: new Vector3(1, 1, 1),
			rotate: new Vector3(0, 1.5, 0)
		},
	],
	propZones: [
		// Northern Forest
		{
			propNames: ['tree_thin', 'tree_lollipop', 'tree_forked', 'tree_spread'],
			zonePathPoints: [
				{ point: new Vector3(-19.571, 0, -21.928) },
				{ point: new Vector3(6.928, 0, -15.0000) },
				{ point: new Vector3(20.928, 0, -18.0000) },
				{ point: new Vector3(32.928, 0, -12.0000) },
				{ point: new Vector3(35.142, 0, 10.2) },
				{ point: new Vector3(45.428, 0, 25.5) },
				{ point: new Vector3(80, 0, 35) },
				{ point: new Vector3(120, 0, 35) },
				{ point: new Vector3(120, 0, -29) },
				{ point: new Vector3(80, 0, -35) },
				{ point: new Vector3(42, 0, -40) },
				{ point: new Vector3(24, 0, -48.5) },
				{ point: new Vector3(13.928, 0, -40.8571) },
				{ point: new Vector3(-11.357, 0, -35.7857) },
				{ point: new Vector3(-12.214, 0, -26.3571) },
				{ point: new Vector3(-20.500, 0, -22.8571) },
				{ point: new Vector3(-19.571, 0, -21.928) },
			],
			propDensityFactor: 4,
			propScale: 3,
			positionRandom: 1.5,
			scaleRandom: { all: 0.25 },
			rotateRandom: 0.5,
			environmentTile: {
				show: true,
				distance: 1.25,
				colour: 0x6B8B42,
			},
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(1.50769, 0, -27.200) },
					{ point: new Vector3(11.0766, 0, -27.571) },
					{ point: new Vector3(30.0920, 0, -34.894) },
					{ point: new Vector3(44.3689, 0, -20.618) },
					{ point: new Vector3(55.5074, 0, -4.6180) },
					{ point: new Vector3(77.51429, 0, -21.43008) },
					{ point: new Vector3(78.71429, 0, -1.88722) },
				],
				attentuationDistance: 20,
				attenuatedScale: 0.75
			}
		},
		// Southern Forest
		{
			propNames: ['tree_cone', 'tree_cone_2'],
			zonePathPoints: [
				{ point: new Vector3(-35.4285, 0, 27.7857) },
				{ point: new Vector3(-19.78571428571429, 0, 5.214285714285714) },
				{ point: new Vector3(-10, 0, -1.5) },
				{ point: new Vector3(0, 0, -1) },
				{ point: new Vector3(16.7142, 0, 8) },
				{ point: new Vector3(9.8571428, 0, 13.42857) },
				{ point: new Vector3(14.71428, 0, 19.5714) },
				{ point: new Vector3(3.571, 0, 30) },
				{ point: new Vector3(-3, 0, 40.6428) },
				{ point: new Vector3(-9.78571, 0, 48.142) },
				{ point: new Vector3(-5, 0, 71) },
				{ point: new Vector3(-10, 0, 81) },
				{ point: new Vector3(-60.3571, 0, 86.42857142857143) },
				{ point: new Vector3(-85, 0, 60) },
				{ point: new Vector3(-80.5, 0, 38) },
				{ point: new Vector3(-60.5714, 0, 29.7857) },
				{ point: new Vector3(-36.8571, 0, 29.2857) },
				{ point: new Vector3(-35.4285, 0, 27.7857) }
			],
			propDensityFactor: 3,
			propScale: 4,
			positionRandom: 3,
			scaleRandom: { all: 0.25, y: 0.25 },
			rotateRandom: 2.5,
			environmentTile: {
				show: true,
				distance: 2,
				colour: 0x6B8B42,
			},
			dynamicScaling:
			{
				scalePoints: [
					{ point: new Vector3(-52.66225961538462, 0, 49.18698069092138) },
					{ point: new Vector3(-7.659014423076934, 0, 21.8194081950816) },
					{ point: new Vector3(-25.295432692307653, 0, 57.686420062091976) }
				],
				attentuationDistance: 32,
				attenuatedScale: 0.75
			}
		},
		// Western Forest
		{
			propNames: ['tree_cone', 'tree_cone', 'tree_cone', 'tree_cone_2'],
			zonePathPoints: [
				{ point: new Vector3(-95.40783942269796, 0, -56.880699061193134) },
				{ point: new Vector3(-75, 0, -60) },
				{ point: new Vector3(-65.60518129642527, 0, -56) },
				{ point: new Vector3(-55.72677214221129, 0, -50.350903179590794) },
				{ point: new Vector3(-51.45729021962728, 0, -41.728224002603085) },
				{ point: new Vector3(-41.83002706085942, 0, -37.45874208001695) },
				{ point: new Vector3(-35.37477854750678, 0, -33.10554482561538) },
				{ point: new Vector3(-35.62592454295289, 0, -21.971405694165238) },
				{ point: new Vector3(-36.630508524737365, 0, -13.516157180808358) },
				{ point: new Vector3(-38.04908518381423, 0, -6.400353976498126) },
				{ point: new Vector3(-42.99287374270569, 0, -3.3866020311432017) },
				{ point: new Vector3(-45.34607099710507, 0, 2.138609868674172) },
				{ point: new Vector3(-49.448122256058326, 0, 9.924135727507727) },
				{ point: new Vector3(-56.06163346947278, 0, 14.69590964098636) },
				{ point: new Vector3(-55.326531410272324, 0, 18.044522913602947) },
				{ point: new Vector3(-55.833407382949034, 0, 27.67178607237563) },
				{ point: new Vector3(-68.61893324177869, 0, 28.425224058714356) },
				{ point: new Vector3(-83.0179703140228, 0, 24.49060346338987) },
				{ point: new Vector3(-96.16127740903632, 0, 9.254413072984413) },
				{ point: new Vector3(-90.71978084103709, 0, -5.060908667451491) },
				{ point: new Vector3(-83.10168564583817, 0, -9.832682580930118) },
				{ point: new Vector3(-74.81386779611627, 0, -7.237507294652269) },
				{ point: new Vector3(-67.53063392817884, 0, -8.158375944621833) },
				{ point: new Vector3(-57.317363446703375, 0, -10.16754390819178) },
				{ point: new Vector3(-50.11784491058132, 0, -21.552797276420655) },
				{ point: new Vector3(-50.368990906027435, 0, -30.594139154187932) },
				{ point: new Vector3(-54.55475749679608, 0, -37.040281048522004) },
				{ point: new Vector3(-60.66597671931828, 0, -40.054142794180464) },
				{ point: new Vector3(-76.9067510915006, 0, -39.719276488087914) },
				{ point: new Vector3(-95.40783942269796, 0, -56.880699061193134) },
			],
			propDensityFactor: 4,
			propScale: 3,
			positionRandom: 3,
			scaleRandom: { all: 0.5 },
			rotateRandom: 0.5,
			environmentTile: {
				show: true,
				distance: 2,
				colour: 0x6B8B42,
			},
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(-74.33028846153846, 0, -51.90823840722425) },
					{ point: new Vector3(-72.49903846153845, 0, 7.807626978579599) },
					{ point: new Vector3(-48.99134615384614, 0, -32.00775763682493) }
				],
				attentuationDistance: 30,
				attenuatedScale: 0.75
			}
		},
		// Small Rock Pile
		{
			propNames: ['rubble_1'],
			zonePathPoints: [
				{ point: new Vector3(-34.734, 0, -2.850) },
				{ point: new Vector3(-36.067, 0, -3.916) },
				{ point: new Vector3(-40.134, 0, -1.850) },
				{ point: new Vector3(-41.400, 0, -0.050) },
				{ point: new Vector3(-42.900, 0, 4.850) },
				{ point: new Vector3(-41.867, 0, 6.750) },
				{ point: new Vector3(-39.200, 0, 8.517) },
				{ point: new Vector3(-37.300, 0, 7.684) },
				{ point: new Vector3(-35.967, 0, 2.984) },
				{ point: new Vector3(-34.734, 0, -2.850) },
			],
			propDensityFactor: 1.5,
			propScale: 3,
			positionRandom: 1.5,
			scaleRandom: { all: 1 },
			rotateRandom: 0.75,
			environmentTile: {
				show: true,
				distance: 0,
				colour: 0x9E8D51
			}
		},
		// North West Rubble
		{
			propNames: ['rubble_1'],
			zonePathPoints: [
				{ point: new Vector3(-34.010, 0, -37.243) },
				{ point: new Vector3(-30.696, 0, -37.929) },
				{ point: new Vector3(-27.668, 0, -42.843) },
				{ point: new Vector3(-20.868, 0, -47.361) },
				{ point: new Vector3(-25.039, 0, -57.933) },
				{ point: new Vector3(-30.068, 0, -59.876) },
				{ point: new Vector3(-41.268, 0, -54.557) },
				{ point: new Vector3(-50.925, 0, -52.957) },
				{ point: new Vector3(-50.925, 0, -49.815) },
				{ point: new Vector3(-48.353, 0, -44.443) },
				{ point: new Vector3(-44.696, 0, -42.043) },
				{ point: new Vector3(-34.010, 0, -37.243) },
			],
			propDensityFactor: 1.5,
			propScale: 3,
			positionRandom: 5.5,
			scaleRandom: { all: 0.5, y: 0.5 },
			rotateRandom: 3,
			environmentTile: {
				show: true,
				distance: 0,
				colour: 0x9E8D51,
			}
		},
		// South East Rubble
		{
			propNames: ['rubble_1'],
			zonePathPoints: [
				{ point: new Vector3(95.3855, 0, 46.3055) },
				{ point: new Vector3(48.7394, 0, 36.58245) },
				{ point: new Vector3(34.1548, 0, 36.70552) },
				{ point: new Vector3(28.4932, 0, 42.36706) },
				{ point: new Vector3(24.8009, 0, 51.53629) },
				{ point: new Vector3(29.9086, 0, 58.18245) },
				{ point: new Vector3(36.4932, 0, 64.27475) },
				{ point: new Vector3(35.0778, 0, 71.96706) },
				{ point: new Vector3(30.4009, 0, 79.47475) },
				{ point: new Vector3(32.3331, 0, 90.40528) },
				{ point: new Vector3(42.3639, 0, 105.5591) },
				{ point: new Vector3(57.3793, 0, 105.0514) },
				{ point: new Vector3(82.8574, 0, 100.7502) },
				{ point: new Vector3(95.3855, 0, 46.3055) },
			],
			propDensityFactor: 1.5,
			propScale: 6,
			positionRandom: 5.5,
			scaleRandom: { all: 0.5, y: 0.5 },
			rotateRandom: 3,
			environmentTile: {
				show: true,
				distance: 2,
				colour: 0x9E8D51,
			},
			dynamicScaling: {
				scalePoints: [
					{ point: new Vector3(59.28293269230771, 0, 54.36514668020505) },
					{ point: new Vector3(63.529086538461556, 0, 70.36514668021304) },
					{ point: new Vector3(49.806009615384625, 0, 84.94976206483574) },
				],
				attentuationDistance: 25,
				attenuatedScale: 0.25
			}
		},
		// North west Mountains
		{
			propNames: ['mountain_1', 'mountain_2'],
			zonePathPoints: [
				{ point: new Vector3(12, 0, -104) },
				{ point: new Vector3(-80, 0, -104) },
				{ point: new Vector3(-70, 0, -75) },
				{ point: new Vector3(-50, 0, -60) },
				{ point: new Vector3(-11, 0, -77) },
				{ point: new Vector3(5, 0, -76) },
				{ point: new Vector3(12, 0, -104) },
			],
			propDensityFactor: 6,
			propScale: 0.65,
			positionRandom: 5.5,
			scaleRandom: { all: 0.1, y: 0.5 },
			rotateRandom: 0.75,
			environmentTile: {
				show: false
			}
		},
		// North East Mountains
		{
			propNames: ['mountain_1', 'mountain_2'],
			zonePathPoints: [
				{ point: new Vector3(35, 0, -99) },
				{ point: new Vector3(35, 0, -71) },
				{ point: new Vector3(38, 0, -55) },
				{ point: new Vector3(107, 0, -50) },
				{ point: new Vector3(116, 0, -99) },
				{ point: new Vector3(35, 0, -99) },
			],
			propDensityFactor: 6,
			propScale: 0.6,
			positionRandom: 5.5,
			scaleRandom: { all: 0.1, y: 0.5 },
			rotateRandom: 0.75,
			environmentTile: {
				show: false
			}
		},
		// West Mountains
		{
			propNames: ['mountain_3', 'mountain_5'],
			zonePathPoints: [
				{ point: new Vector3(-93.89255, 0, -51.47957) },
				{ point: new Vector3(-100.16947, 0, -1.01802) },
				{ point: new Vector3(-83.43101, 0, -11.60264) },
				{ point: new Vector3(-75.12332, 0, -8.64879) },
				{ point: new Vector3(-58.56947, 0, -11.29495) },
				{ point: new Vector3(-51.43101, 0, -22.00265) },
				{ point: new Vector3(-53.58486, 0, -30.18727) },
				{ point: new Vector3(-61.89255, 0, -38.67957) },
				{ point: new Vector3(-79.43101, 0, -36.64880) },
				{ point: new Vector3(-93.89255, 0, -51.47957) },
			],
			propDensityFactor: 6,
			propScale: 0.8,
			positionRandom: 5.5,
			scaleRandom: { y: 0.25 },
			rotateRandom: 0.75,
			environmentTile: {
				show: false
			}
		},
		// Southern Mesas
		{
			propNames: ['mesa_1'],
			zonePathPoints: [
				{ point: new Vector3(28.870673076923076, 0, 93.5919078742053) },
				{ point: new Vector3(27.70144230769231, 0, 73.71498479727228) },
				{ point: new Vector3(20.316826923076924, 0, 70.3919078741937) },
				{ point: new Vector3(14.43701923076922, 0, 72.79190787419489) },
				{ point: new Vector3(8.206249999999997, 0, 82.82267710496916) },
				{ point: new Vector3(10.470673076923076, 0, 92.60729248958941) },
				{ point: new Vector3(28.870673076923076, 0, 93.5919078742053) },
			],
			propDensityFactor: 3,
			propScale: 1,
			positionRandom: 2,
			scaleRandom: { all: 0.5, y: 0.5 },
			rotateRandom: 1.5,
			environmentTile: {
				show: true,
				distance: 2,
				colour: 0x9E8D51,
			}
		}
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
