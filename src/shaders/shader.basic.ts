export const BasicVertexShader = `
	varying vec3 vNormal;

	void main() {
		vNormal = normalize(normalMatrix * normal);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
`;

export const BasicFragmentShader = `
	uniform vec3 uColour;
	varying vec3 vNormal;

	void main() {
		gl_FragColor = vec4(uColour, 1.0);
	}
`