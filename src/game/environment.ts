import * as THREE from 'three';
import { chance, random } from './gameUtils';

const GRASS_RADIUS = 8;
const GRASS_HEIGHT = 0.5;
const TREE_WIDTH = 1;
const TREE_HEIGHT = 2;
const BUSH_WIDTH = 0.75;
const BUSH_HEIGHT = 0.75;
const DECORATION_SLOTS_COUNT = 64;
const DECORATION_FILL_PROBABILITY = 0.5;
const TREE_TO_BUSH_PROBABILITY = 0.3;

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
        this.addDecoration();
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
        const grassTexture = this.textureLoader.load('textures/grass.png');
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

    private addDecoration() {
        for (let i = 0; i < DECORATION_SLOTS_COUNT; i++) {
            if (!chance(DECORATION_FILL_PROBABILITY)) {
                continue;
            }
            const angle = (i * Math.PI * 2) / DECORATION_SLOTS_COUNT;
            if (chance(TREE_TO_BUSH_PROBABILITY)) {
                this.addTree(angle);
            } else {
                this.addBush(angle);
            }
        }
    }

    private addTree(angle: number) {
        const offsetSize = random(-0.4, 0.2);
        const treeGeom = new THREE.PlaneBufferGeometry(
            TREE_WIDTH + offsetSize,
            TREE_HEIGHT + offsetSize
        );
        const treeMat = new THREE.MeshBasicMaterial({
            map: this.treeTexture,
            transparent: true,
        });

        const tree = new THREE.Mesh(treeGeom, treeMat);

        tree.position.x = Math.cos(angle) * (GRASS_RADIUS + 1);
        tree.position.z = Math.sin(angle) * (GRASS_RADIUS + 1);
        tree.lookAt(0, 0, 0);
        tree.position.y = TREE_HEIGHT * 0.5;

        this.mesh.add(tree);
    }

    private addBush(angle: number) {
        const offsetSize = random(-0.4, 0.2);
        const bushGeom = new THREE.PlaneBufferGeometry(
            BUSH_WIDTH + offsetSize,
            BUSH_HEIGHT + offsetSize
        );
        const bushMat = new THREE.MeshBasicMaterial({
            map: this.bushTexture,
            transparent: true,
        });

        const bush = new THREE.Mesh(bushGeom, bushMat);

        bush.position.x = Math.cos(angle) * (GRASS_RADIUS + 1);
        bush.position.z = Math.sin(angle) * (GRASS_RADIUS + 1);
        bush.lookAt(0, 0, 0);
        bush.position.y = BUSH_HEIGHT * 0.5;

        this.mesh.add(bush);
    }
}
