import * as THREE from 'three';

const GRASS_RADIUS = 8;
const GRASS_HEIGHT = 3;

export class Environment {
    public mesh: THREE.Group;
    private textureLoader: THREE.TextureLoader;
    private treeTexture: THREE.Texture;
    private bushTexture: THREE.Texture;

    constructor() {
        this.mesh = new THREE.Group();
        this.textureLoader = new THREE.TextureLoader();
        this.treeTexture = this.textureLoader.load('textures/tree.png');
        this.bushTexture = this.textureLoader.load('textures/bushv2.png');

        this.addFloor();
        this.addGrass();
    }

    private addFloor() {
        const floorTexture = this.textureLoader.load('textures/floorDark.jpg');
        const floorGeometry = new THREE.PlaneGeometry(GRASS_RADIUS * 2, GRASS_RADIUS * 2);
        const floorMaterial = new THREE.MeshStandardMaterial({
            map: floorTexture,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;

        this.mesh.add(floor);
    }

    private addGrass() {
        const grassTexture = this.textureLoader.load('textures/grassv2.png');
        const grassGeometry = new THREE.CylinderGeometry(
            GRASS_RADIUS,
            GRASS_RADIUS,
            GRASS_HEIGHT,
            64,
            1,
            true
        );
        const grassMaterial = new THREE.MeshBasicMaterial({
            map: grassTexture,
            side: THREE.BackSide,
            transparent: true,
        });
        const grass = new THREE.Mesh(grassGeometry, grassMaterial);
        grass.position.y = GRASS_HEIGHT * 0.5;

        this.mesh.add(grass);
    }
}
