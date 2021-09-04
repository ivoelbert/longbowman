import * as THREE from 'three';
// import { glsl } from './gameUtils';

const SKYDOME_VERTEX_SHADER = `
    varying vec3 vWorldPosition;

    void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const SKYDOME_FRAGMENT_SHADER = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;

    varying vec3 vWorldPosition;

    void main() {
        float h = normalize( vWorldPosition + offset ).y;

        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
    }
`;

export class Sky {
    public mesh: THREE.Group;
    public bottomColor: THREE.Color;

    constructor() {
        this.mesh = new THREE.Group();

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        this.mesh.add(hemiLight);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 6, 0);
        light.castShadow = true;
        light.shadow.camera.top = 2;
        light.shadow.camera.bottom = -2;
        light.shadow.camera.right = 2;
        light.shadow.camera.left = -2;
        light.shadow.mapSize.set(4096, 4096);
        this.mesh.add(light);

        const uniforms = {
            topColor: { value: new THREE.Color(0x0077ff) },
            bottomColor: { value: new THREE.Color(0xcfcfff) },
            offset: { value: 15 },
            exponent: { value: 0.4 },
        };
        uniforms['topColor'].value.copy(hemiLight.color);
        this.bottomColor = uniforms['bottomColor'].value;

        const skyGeo = new THREE.SphereGeometry(50, 32, 15);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: SKYDOME_VERTEX_SHADER,
            fragmentShader: SKYDOME_FRAGMENT_SHADER,
            side: THREE.BackSide,
        });

        const sky = new THREE.Mesh(skyGeo, skyMat);

        this.mesh.add(sky);
    }
}
