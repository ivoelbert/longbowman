import * as THREE from 'three';

const ARROW_LENGTH = 0.5;

export class Arrow {
    public mesh: THREE.Group;
    private velocity: THREE.Vector3;
    private isFlying: boolean;

    constructor() {
        const arrowGeom = new THREE.CylinderGeometry(0.01, 0.01, ARROW_LENGTH, 8);
        const arrowMat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x602020),
        });
        const arrowMesh = new THREE.Mesh(arrowGeom, arrowMat);
        arrowMesh.position.z += ARROW_LENGTH * 0.5;
        arrowMesh.rotation.x = Math.PI / 2;
        arrowMesh.castShadow = true;
        arrowMesh.receiveShadow = true;

        this.mesh = new THREE.Group();
        this.mesh.add(arrowMesh);
        this.mesh.position.set(0, 0, 0);

        this.velocity = new THREE.Vector3(0, 0, 0);

        this.isFlying = false;
    }

    public moveToThrowingPosition = (c1Pos: THREE.Vector3, c2Pos: THREE.Vector3) => {
        this.mesh.position.copy(c2Pos);
        this.mesh.lookAt(c1Pos);
    };

    public throw = (towards: THREE.Vector3) => {
        this.isFlying = true;
        this.velocity = towards;
    };

    public fly = () => {
        if (!this.isFlying) {
            return;
        }

        this.mesh.lookAt(this.mesh.position.clone().add(this.velocity));

        this.velocity.y -= 0.002;
        this.velocity.multiplyScalar(0.995);

        const movement = this.velocity.clone().multiplyScalar(0.35);
        this.mesh.position.add(movement);

        if (this.mesh.position.y < 0.01) {
            this.velocity.set(0, 0, 0);
            this.mesh.position.y = 0.01;
            this.isFlying = false;
        }
    };
}
