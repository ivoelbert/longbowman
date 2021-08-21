import * as THREE from 'three';
import { OrbitControls, VRButton } from 'three-stdlib';
import { Arrow } from './arrow';

export class Longbowman {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private controls: OrbitControls;

    private controller1: THREE.Group;
    private controller2: THREE.Group;
    private controller1Mesh: THREE.Mesh;
    private controller2Mesh: THREE.Mesh;

    private isThrowing: boolean;
    private aimIndicator: THREE.Line;
    private arrow: Arrow;

    constructor() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.xr.enabled = true;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x808080);

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );
        this.camera.position.set(0, 1.6, 3);

        this.controls = new OrbitControls(this.camera, this.domElement);
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();

        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshStandardMaterial({
            color: 0xeeeeee,
            roughness: 1.0,
            metalness: 0.0,
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        this.scene.add(new THREE.HemisphereLight(0x808080, 0x606060));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, 6, 0);
        light.castShadow = true;
        light.shadow.camera.top = 2;
        light.shadow.camera.bottom = -2;
        light.shadow.camera.right = 2;
        light.shadow.camera.left = -2;
        light.shadow.mapSize.set(4096, 4096);
        this.scene.add(light);

        const geom = new THREE.SphereBufferGeometry(0.02);
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x202040),
        });
        const controllerMesh = new THREE.Mesh(geom, material);

        this.controller1Mesh = controllerMesh.clone();
        this.controller1Mesh.castShadow = true;
        this.controller1Mesh.receiveShadow = true;
        this.controller1 = this.renderer.xr.getController(1);
        this.controller1.add(this.controller1Mesh);
        this.scene.add(this.controller1);

        this.controller2Mesh = controllerMesh.clone();
        this.controller2Mesh.castShadow = true;
        this.controller2Mesh.receiveShadow = true;
        this.controller2 = this.renderer.xr.getController(0);
        this.controller2.add(this.controller2Mesh);
        this.scene.add(this.controller2);

        this.isThrowing = false;

        const indicatorGeom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, 1),
        ]);
        this.aimIndicator = new THREE.Line(indicatorGeom);
        this.aimIndicator.visible = false;
        this.controller2.add(this.aimIndicator);

        this.arrow = new Arrow();
        this.scene.add(this.arrow.mesh);
    }

    get domElement() {
        return this.renderer.domElement;
    }

    start = () => {
        window.addEventListener('resize', this.resize);
        this.controller2.addEventListener('selectstart', this.onSelectStart);
        this.controller2.addEventListener('selectend', this.onSelectEnd);

        document.body.appendChild(VRButton.createButton(this.renderer));

        this.renderer.setAnimationLoop(this.render);
    };

    dispose = () => {
        window.removeEventListener('resize', this.resize);
        this.controller2.removeEventListener('selectstart', this.onSelectStart);
        this.controller2.removeEventListener('selectend', this.onSelectEnd);
    };

    private render = () => {
        if (this.isThrowing) {
            const c1Pos = this.controller1.position;
            const c2Pos = this.controller2.position;
            this.arrow.moveToThrowingPosition(c1Pos, c2Pos);
            this.aimIndicator.lookAt(c1Pos);
            this.aimIndicator.scale.z = c1Pos.distanceTo(c2Pos) * 2;
        } else {
            this.arrow.fly();
        }

        this.renderer.render(this.scene, this.camera);
    };

    private resize = () => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    private onSelectStart = () => {
        if (this.controller1.position.distanceTo(this.controller2.position) < 0.15) {
            this.isThrowing = true;
            this.aimIndicator.visible = true;
        }
    };

    private onSelectEnd = () => {
        if (this.isThrowing) {
            this.arrow.throw(this.controller1.position.clone().sub(this.controller2.position));
        }
        this.isThrowing = false;
        this.aimIndicator.visible = false;
    };
}
