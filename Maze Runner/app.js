
import * as THREE from 'three';

import {Capsule} from 'Capsule';
import {Octree} from 'Octree';

import {PointerLockControls} from 'PointerLockControls';

import {World, PlayerModel} from 'World';
//import {Teleport, PlayerPosition, PlayerControls} from 'Player';
import {Flashlight, Maze} from 'Objects';

/////////////////////
function Teleport()
{
    if(PerspectiveCamera.position.y <= -5)
    {
        PlayerCapsule.start.set(0, 2*.5, 0); // 0, .5, 0
        PlayerCapsule.end.set(0, .5+2, 0); // 0, 2, 0
        PlayerCapsule.radius = .35;
        PerspectiveCamera.position.copy(PlayerCapsule.end);
        PerspectiveCamera.rotation.set(0, 0, 0);
    }
}

function PlayerCollisions()
{
    let Result = WorldCollisions.capsuleIntersect(PlayerCapsule);

    POnGround = false;

    if(Result)
    {
        POnGround = Result.normal.y > 0;

        if(!POnGround) PVelocity.addScaledVector(Result.normal, -Result.normal.dot(PVelocity));
        
        PlayerCapsule.translate(Result.normal.multiplyScalar(Result.depth));
    }
}

function GetForwardVector()
{
    PerspectiveCamera.getWorldDirection(PDirection);
    PDirection.y = 0;
    PDirection.normalize();

    return PDirection;
}

function GetSideVector()
{
    PerspectiveCamera.getWorldDirection(PDirection);
    PDirection.y = 0;
    PDirection.normalize();
    PDirection.cross(PerspectiveCamera.up);

    return PDirection;
}

function PlayerPosition(deltaTime)
{
    let damping = Math.exp(-4 * deltaTime) - 1;

    if(!POnGround)
    {
        PVelocity.y -= Gravity * deltaTime;
        damping *= .1; // Air Resistance
    }

    PVelocity.addScaledVector(PVelocity, damping);

    const PPosition = PVelocity.clone().multiplyScalar(deltaTime);

    PlayerCapsule.translate(PPosition);

    PlayerCollisions(PVelocity, PlayerCapsule, WorldCollisions, POnGround);

    PerspectiveCamera.position.copy(PlayerCapsule.end);

    const Position = PlayerCapsule.end;

    OrthographicCamera.position.set(Position.x + 1, Position.y, Position.z + 2);

    OrthographicCamera.lookAt(PlayerCapsule.start);
}

function PlayerControls(deltaTime)
{
    const Speed = deltaTime * (POnGround ? MoveSpeed : MoveSpeed * .5)

    if(KeyStates['KeyW']) PVelocity.add(GetForwardVector().multiplyScalar(Speed));

    if(KeyStates['KeyA']) PVelocity.add(GetSideVector().multiplyScalar(-Speed));

    if(KeyStates['KeyS']) PVelocity.sub(GetForwardVector().multiplyScalar(Speed));

    if(KeyStates['KeyD']) PVelocity.sub(GetSideVector().multiplyScalar(-Speed));

    if(POnGround)
        if(KeyStates['Space'])
            PVelocity.y = Jump;
}
/////////////////////

/////////////////////
// Variables and Constants
//
//Clock and Scene
const Clock = new THREE.Clock();
const scene = new THREE.Scene();

//Lighting
const AmbientLight = new THREE.AmbientLight(0xffffe0, 1.5); // 0xffffff, 0.5
scene.add(AmbientLight);

const HemisphereLight = new THREE.HemisphereLight(0xc1445, 0x01322, 1); // 0xffffff, 0x000000, 0.5
scene.add(HemisphereLight);

//Mouse Picking
const RayCaster = new THREE.Raycaster();
let Interactions = [];

let MPosition = new THREE.Vector2();
document.addEventListener('mousemove', (event) => {
    MPosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    MPosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

//Skybox
const Skybox = new THREE.CubeTextureLoader().load([
    './Textures/Skybox/posx.png',
    './Textures/Skybox/negx.png',
    './Textures/Skybox/posy.png',
    './Textures/Skybox/negy.png',
    './Textures/Skybox/posz.png',
    './Textures/Skybox/negz.png'
]);

scene.background = Skybox;

//Cameras and Renderer
//
const PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .1, 1000); // 45, 4/3, 0.1, 100
//PerspectiveCamera.position.set(1, 2*.5, 0); // 0, .5, 0

const OrthographicCamera = new THREE.OrthographicCamera(window.innerWidth/-50, window.innerWidth/50, window.innerHeight/50, window.innerHeight/-50, -100, 1000); // -1, 1, 1, -1, -10, 10
OrthographicCamera.zoom = 2;

//
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap; // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.useLegacyLights = false; // renderer.physicallyCorrectLights = true;

document.body.appendChild(renderer.domElement);

//Switch Cameras
const Cameras = [PerspectiveCamera, OrthographicCamera];
let CurrentCamera = 0;

//Player Collisions
const WorldCollisions = new Octree();
const PlayerCapsule = new Capsule(new THREE.Vector3(3, .8, 2), new THREE.Vector3(3, 2.5, 2), .2); // 0, 0, 0, 0, 0, 0, 0, 0

//Player Variables
const PVelocity = new THREE.Vector3();
const PDirection = new THREE.Vector3();
let POnGround = false;

//Player Movement and Controls
const Gravity = 9.8;
const Steps = 5;
const JumpHeight = 2;
const Jump = Math.sqrt(2 * Gravity * JumpHeight);
const MoveSpeed = 15;
const RunSpeed = 21;

const KeyStates = {};
document.addEventListener('keydown', (event) => KeyStates[event.code] = true);
document.addEventListener('keyup', (event) => KeyStates[event.code] = false);
/////////////////////

/////////////////////
//Menu
const Menu = document.getElementById("Menu");
const StartButton = document.getElementById("StartButton");
let MenuControls = new PointerLockControls(PerspectiveCamera, renderer.domElement);

StartButton.addEventListener('click', () => MenuControls.lock(), false);
MenuControls.addEventListener('lock', () => Menu.style.display = 'none');
MenuControls.addEventListener('unlock', () => Menu.style.display = 'block');

//Function Controls
document.addEventListener('keydown', Ondocumentkeydown);

function Ondocumentkeydown(event) {
    if(event.key == 'f') FlashLight.TurnOn();
    if(event.key == 'c') CurrentCamera = CurrentCamera == 0 ? 1 : 0;
    if(event.key == 'e') Maze.CheckInteractions(Interactions);
    if(event.key == 't') AmbientLight.visible = !AmbientLight.visible;
    if(event.key == 'g') HemisphereLight.visible = !HemisphereLight.visible;
    if(event.key == 'h') Maze.TurnLightsOn();
}
/////////////////////

/////////////////////
//Player Model
const PlayerM = new PlayerModel();
PlayerM.position.set(1.5, -.5, 0); //2, -2*.5, 0
PerspectiveCamera.add(PlayerM);

//Flashlight
const FlashLight = new Flashlight();

PerspectiveCamera.add(FlashLight.target);
PerspectiveCamera.add(FlashLight);
scene.add(PerspectiveCamera);
/////////////////////

/////////////////////
World.AddGround(scene);
World.AddPlayerModel(scene, WorldCollisions);
World.AddMaze(scene);

World.AddMazeModel(scene, WorldCollisions);

WorldCollisions.fromGraphNode(scene);
/////////////////////

/////////////////////
function Start()
{
    const deltaTime = Math.min(.05, Clock.getDelta())/Steps;

    for(let i = 0; i < Steps; i++)
    {
        //PlayerControls(deltaTime, PVelocity, MoveSpeed, Jump, KeyStates, PerspectiveCamera, PDirection, POnGround);
        //PlayerPosition(deltaTime, PVelocity, PlayerCapsule, PerspectiveCamera, OrthographicCamera, POnGround, Gravity, WorldCollisions);
        //Teleport(PlayerCapsule, PerspectiveCamera);

        PlayerControls(deltaTime);
        PlayerPosition(deltaTime);
        Teleport();

        //RayCaster.setFromCamera(new THREE.Vector2(0, 0), PerspectiveCamera);
        RayCaster.setFromCamera(MPosition, PerspectiveCamera);
        Interactions = RayCaster.intersectObjects(scene.children);
    }

    renderer.render(scene, Cameras[CurrentCamera]);
    requestAnimationFrame(Start);
}
/////////////////////

/////////////////////
function Window()
{
    window.addEventListener('resize', () => {
        Cameras[CurrentCamera].aspect = window.innerWidth / window.innerHeight;
        Cameras[CurrentCamera].updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        Start();
    }, false);
}
/////////////////////

Window();
Start();