export const VertexDisplacementVertexShader = `
	varying vec2 vUv;
	varying float vHeight;
	varying vec3 vNormal;

	float displacement = 0.25;

	float hash(vec2 p) {
		return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
	}

	float noise(vec2 p) {
		vec2 i = floor(p);
		vec2 f = fract(p);
		float a = hash(i);
		float b = hash(i + vec2(0.0, 0.0));
		vec2 u = f * f * (3.0 - 2.0 * f);
		return mix(a, b, u.x);
	}

	void main() {
		vUv = uv;
		vHeight = position.y;

		float d = noise(position.xz * 3.0);  // was 3.0
		//vDisplacement = d;

		// World Normalise
		vNormal = normalize(normalMatrix * normal);

		vec3 newPosition = position;
		
		// Shift the vertices so that we get a noisy edge
		newPosition.xz += vec2(d * displacement);

		// Set the vertex positions
		gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
	}
`;

export const VertexDisplacementFragmentShader = `
	uniform vec3 uTopColour;
	uniform vec3 uEdgeColour;

	varying vec2 vUv;
	varying float vHeight;
	varying vec3 vNormal;

	void main() {
		vec3 colour;
		vec3 topColour = uTopColour;
		vec3 edgeColour = uEdgeColour;
		float edgeWidth = 0.05;
		bool isTop = vNormal.y > 0.1;
		
		// Apply Colour
		if (isTop) {
			colour = topColour;
		} else {
			colour = edgeColour;
		}

		gl_FragColor = vec4(colour, 1.0);
	}
`



// OLD CODE
/*const VertexDisplacementFragmentShader = `
	varying vec2 vUv;
	varying float vHeight;
	varying vec3 vNormal;
	varying float vDisplacement;

	void main() {
		// 1. Base Colors
		vec3 sandColor = vec3(0.76, 0.70, 0.50);
		vec3 dirtColor = vec3(0.5, 0.45, 0.25);

		// 2. The Top vs Side Logic (from height)
		float topMask = smoothstep(0.3, 0.45, vHeight);

		// 3. Fake Lighting (Ambient Occlusion)
		// We darken the color where the displacement noise is low.
		// This makes the "bumpy" parts pop.
		float shadow = mix(1.8, 1.9, vDisplacement); 

		// 4. Edge Blend (Creeping dirt on the top edges)
		float edgeCreep = abs(vUv.y - 0.5) * 2.0;
		float dirtOnTop = smoothstep(0.6, 0.95, edgeCreep);

		// 5. Final Mix
		vec3 topFinal = mix(sandColor, dirtColor, dirtOnTop);
		vec3 finalColor = mix(dirtColor, topFinal, topMask);

		// 6. APPLY THE SHADOWS
		// This multiplies the color by our noise-based light map
		gl_FragColor = vec4(finalColor * shadow, 1.0);
	}
`;
*/