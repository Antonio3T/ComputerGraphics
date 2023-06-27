
import * as THREE from 'three';
import {GLTFLoader} from 'GLTFLoader';
import {Maze, Wood} from 'Objects';

export class World
{
    static AddMaze(scene)
    {
        //Maze.AddMirrors(scene);
        Maze.AddWalls(scene);
        Maze.AddTorches(scene);
        Maze.AddStreetLamps(scene);
        Maze.AddCeilingLights(scene);
        Maze.AddCandles(scene);
        Maze.AddPorchLights(scene);   
    }

    static AddGround(scene)
    {
        const GGround = new THREE.PlaneGeometry(50, 50); // 100, 100, 1, 1
        const Texture = new THREE.TextureLoader();

        let ColorMap = Texture.load('./Textures/Ground/CGround.png', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
        }
        );
        let NormalMap = Texture.load('./Textures/Ground/NGLGround.png', (texture) => {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
        }
        );
        const MGround = new THREE.MeshStandardMaterial({
            map: ColorMap,
            aoMap: Texture.load('./Textures/Ground/AOGround.png'),
            normalMap: NormalMap,
            roughnessMap: Texture.load('./Textures/Ground/RGround.png'),
            displacementMap: Texture.load('./Textures/Ground/DGround.png'),
        }
        );
        const Mesh = new THREE.Mesh(GGround, MGround);
        Mesh.receiveShadow = true;
        Mesh.rotation.x = -Math.PI / 2;
        scene.add(Mesh);
    }

    static AddPlayerModel(scene, WorldCollisions)
    {
        const Loader = new GLTFLoader();
        Loader.load('./Models/Soldier/Soldier.glb', (gltf) => {
            const Model = gltf.scene;

            Model.position.set(21, .5, 7);
            Model.rotation.y = Math.PI / 2;

            Model.traverse((node) => {
                if(node instanceof THREE.Mesh)
                {
                    node.castShadow = node.receiveShadow = true;
                }
            });

            scene.add(Model);
            WorldCollisions.fromGraphNode(Model);

            // Animations Setup
            const Animations = gltf.animations;
            const Mixer = new THREE.AnimationMixer(Model);
            const Map = new Map();

            Animations.filter(p => p.name != 'TPose').array.forEach(element => {
                Map.set(element.name, Mixer.clipAction(element));
            });
        });
    }

    static AddMazeModel(scene, WorldCollisions)
    {
        const Loader = new GLTFLoader();
        Loader.load('./Models/Maze/Maze.gltf', (gltf) => {
            const Model = gltf.scene;

            Model.traverse((node) => {
                if(node instanceof THREE.Mesh)
                {
                    node.castShadow = node.receiveShadow = true;
                    node.material = Wood;
                }                
            });
            
            Model.position.set(65, .5, 0);
            Model.receiveShadow = true;

            scene.add(Model);
            WorldCollisions.fromGraphNode(Model);
        });
    }
}

export class PlayerModel extends THREE.Group
{
    constructor()
    {
        super();

        const GHead = new THREE.SphereGeometry(.15);
        const MHead = new THREE.Mesh(GHead, SkinColor);
        MHead.position.y = .45;
        this.add(MHead);


        const GChest = new THREE.CylinderGeometry(.15, .15, .5);
        const MChest = new THREE.Mesh(GChest, White);

        let GEdges = new THREE.EdgesGeometry(MChest.geometry);
        let MEdges = new THREE.LineSegments(GEdges, BlackEdges);

        MChest.add(MEdges);
        this.add(MChest);


        const GArm = new THREE.CylinderGeometry(.07, .07, .7);
        const MArm = new THREE.Mesh(GArm, Black);
        MArm.add(MArm);

        const MLArm = MArm.clone();
        const MRArm = MArm.clone();

        MLArm.rotateZ(-Math.PI / 7);
        MLArm.position.set(-.2, -.05, 0);
        this.add(MLArm);

        MRArm.rotateZ(Math.PI / 7);
        MRArm.position.set(.2, -.05, 0);
        this.add(MRArm);


        const GLeg = new THREE.CylinderGeometry(.07, .07, .7);
        const MLeg = new THREE.Mesh(GLeg, Black);
        MLeg.add(MLeg);

        const MLLeg = MLeg.clone();
        const MRLeg = MLeg.clone();
        
        MLLeg.rotateZ(-Math.PI / 9);
        MLLeg.position.set(-.15, -.55, 0);
        this.add(MLLeg);

        MRLeg.rotateZ(Math.PI / 9);
        MRLeg.position.set(.15, -.55, 0);
        this.add(MRLeg);
    }
}

const SkinColor = new THREE.MeshBasicMaterial({color: 0xFEE3D4});
const White = new THREE.MeshBasicMaterial({color: 'white'});
const Black = new THREE.MeshBasicMaterial({color: 'black'});
const BlackEdges = new THREE.LineBasicMaterial({color: 'black', linewidth: 2});
