
import * as THREE from 'three';
import {Reflector} from 'Mirror';
import {CSG} from 'CSG';


export class Flashlight extends THREE.SpotLight
{
    constructor()
    {
        super(0xffffff, 0, 20, Math.PI/5, 0.1, 2);
        
        this.castShadow = true;
        this.receiveShadow = true;

        //this.position.set(0, 0, 0);
        this.position.setY(-.4);
        this.target.position.set(0, .4, -2); // 0, 0, -1
    }

    TurnOn()
    {
        this.intensity = (this.intensity > 0) ? 0 : 20;
    }
}

export class Maze
{
    static Switches = {};
    static Lights = {};

    static CheckInteractions(Interactions)
    {
        if(Interactions[0].distance < 5)
        {
            let Name = Interactions[0].object.parent.parent?.Name;

            if(Name?.includes('Switch')) Maze.Switches[Name].TurnOn();
        }
    }

    static TurnLightsOn()
    {
        for(let Light in Maze.Lights) Maze.Lights[Light].TurnOn();
    }

    static AddMirrors(scene)
    {
        //const GMirror = new THREE.PlaneGeometry(2, 5);
        const GMirror = new THREE.CircleGeometry(1, 32);

        const MRMirror = new Reflector(GMirror, Mirror);
        MRMirror.position.set(24.45, .5, 7);
        MRMirror.rotation.y = -Math.PI/2;
        scene.add(MRMirror);

        const MLMirror = new Reflector(GMirror, Mirror);
        MLMirror.position.set(24.45, .5, -7);
        MLMirror.rotation.y = -Math.PI/2;
        scene.add(MLMirror);
    }

    static AddWalls(scene)
    {
        const GWall = new THREE.BoxGeometry(5*2, 7-2*.5, .1);
        const GCeiling = new THREE.BoxGeometry(5*2-.05, 5*2, .1);
        const GWindow = new THREE.BoxGeometry(3*2, 6, .1);


        const LWall = new THREE.Mesh(GWall, Wood);
        LWall.position.set(0, .5*3, -5);
        scene.add(LWall);


        const RWall = new THREE.Mesh(GWall, Wood);
        RWall.position.set(0, .5*3, 5);
        scene.add(RWall);
        

        const FWindow = new THREE.Mesh(GWindow, Glass);
        FWindow.position.set(5-.5, .5*3, 2);
        FWindow.rotation.y = Math.PI/2;
        scene.add(FWindow);


        const BWall = new THREE.Mesh(GWall, Wood);
        BWall.position.set(-5, .5*3, 0);
        BWall.rotation.y = Math.PI/2;
        scene.add(BWall);


        const FlWall = new THREE.Mesh(GCeiling, Wood);
        FlWall.position.set(0, .5, 0);
        FlWall.rotation.x = Math.PI/2;
        scene.add(FlWall);


        const CWall = new THREE.Mesh(GCeiling, Wood);
        CWall.position.set(0, 5-.5, 0);
        CWall.rotation.x = Math.PI/2;
        scene.add(CWall);
    }

    static AddTorches(scene)
    {
        const TRTorch = new Torch();
        TRTorch.position.set(21, .5, 7);
        scene.add(TRTorch);
        
        const TLTorch = new Torch();
        TLTorch.position.set(21, .5, -7);
        scene.add(TLTorch);

        Maze.Lights['TRTorch'] = TRTorch;
        Maze.Lights['TLTorch'] = TLTorch;
    }

    static AddStreetLamps(scene)
    {
        const Lamp = new StreetLamp();
        Lamp.position.set(11, .5, -2);
        scene.add(Lamp);

        const RLamp = new StreetLamp();
        RLamp.position.set(21, .5, 4);
        scene.add(RLamp);

        const LLamp = new StreetLamp();
        LLamp.position.set(21, .5, -4);
        scene.add(LLamp);

        Maze.Lights['Lamp'] = Lamp;
        Maze.Lights['RLamp'] = RLamp;
        Maze.Lights['LLamp'] = LLamp;
    }

    static AddCeilingLights(scene)
    {
        const Light = new CeilingLight();
        Light.position.set(31, 7.5, 0);
        scene.add(Light);

        const Switch = new LightSwitch('Switch', Light);
        Switch.position.set(31, 6, 1.5);
        Switch.rotation.x = -Math.PI/2;
        scene.add(Switch);

        Maze.Switches['Switch'] = Switch;
    }

    static AddCandles(scene)
    {
        const FRCandle = new Candle();
        FRCandle.position.set(21, .5, 1);
        scene.add(FRCandle);

        const FLCandle = new Candle();
        FLCandle.position.set(21, .5, -1);
        scene.add(FLCandle);

        Maze.Lights['FRCandle'] = FRCandle;
        Maze.Lights['FLCandle'] = FLCandle;
    }

    static AddPorchLights(scene)
    {
        const Light = new PorchLight();
        Light.position.set(4, 2.3, -4.75);
        Light.rotation.y = Math.PI/2;
        scene.add(Light);

        const CCandle = new Candle();
        CCandle.position.set(4, 2.3, -4.75);
        scene.add(CCandle);


        const RLight = new PorchLight();
        RLight.position.set(24.3, 1.8, 7);
        scene.add(RLight);

        const RCCandle = new Candle();
        RCCandle.position.set(24.3, 1.8, 7);
        scene.add(RCCandle);


        const LLight = new PorchLight();
        LLight.position.set(24.3, 1.8, -7);
        scene.add(LLight);

        const LCCandle = new Candle();
        LCCandle.position.set(24.3, 1.8, -7);
        scene.add(LCCandle);


        Maze.Lights['CCandle'] = CCandle;
        Maze.Lights['RCCandle'] = RCCandle;
        Maze.Lights['LCCandle'] = LCCandle;
    }
}

class Candle extends THREE.Group
{
    constructor()
    {
        super();

        const GCandle = new THREE.CylinderGeometry(.05, .05, .2);
        const MtCandle = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1});
        const MCandle = new THREE.Mesh(GCandle, MtCandle);
        MCandle.position.set(0, .125, 0);
        MCandle.castShadow = true;
        super.add(MCandle);

        const GFlame = new THREE.ConeGeometry(.02, .06);
        const MtFlame = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2});

        const Light = new THREE.PointLight(0xfbb741, 1, 100, 2);
        Light.add(new THREE.Mesh(GFlame, MtFlame));
        Light.position.set(0, .25, 0);
        Light.power = 20;
        super.add(Light);
        super.rotateY(Math.PI/2);

        this.Light = Light;
        this.Candle = MtCandle;
        this.Flame = MtFlame;
        super.traverse((child) => child.castShadow = child.receiveShadow = true);
    }

    TurnOn()
    {
        this.Light.power = this.Light.power == 0 ? 20 : 0;

        this.Candle.emissiveIntensity = this.Candle.emissiveIntensity == 0 ? 1 : 0;
        this.Flame.emissiveIntensity = this.Flame.emissiveIntensity == 0 ? 2 : 0;
    }
}

class Torch extends THREE.Group
{
    constructor()
    {
        super();

        const GBase = new THREE.CylinderGeometry(.05, .05, .05, 16);
        const MBase = new THREE.Mesh(GBase, Metal);
        super.add(MBase);

        const GPole = new THREE.CylinderGeometry(.01, .01, .5, 16);
        const MPole = new THREE.Mesh(GPole, Metal);
        MPole.position.set(0, .25, 0);
        super.add(MPole);

        const GFlame = new THREE.ConeGeometry(.05, .15);
        const MtFlame = new THREE.MeshStandardMaterial({color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2});

        const Light = new THREE.PointLight(0xff0000, 1, 100, 2);
        Light.add(new THREE.Mesh(GFlame, MtFlame));
        Light.position.set(0, .4, 0);
        Light.power = 20;
        super.add(Light);

        this.Light = Light;
        this.Flame = MtFlame;
        super.traverse((child) => child.castShadow = child.receiveShadow = true);
    }

    TurnOn()
    {
        this.Light.power = this.Light.power == 0 ? 20 : 0;

        this.Flame.emissiveIntensity = this.Flame.emissiveIntensity == 0 ? 2 : 0;
    }
}

class StreetLamp extends THREE.Group
{
    constructor()
    {
        super();
    
        const GBase = new THREE.CylinderGeometry(0.5, 0.5, 0.05);
        const MBase = new THREE.Mesh(GBase, Metal);
        super.add(MBase);
    
        const GPole = new THREE.CylinderGeometry(0.05, 0.05, 3.5);
        const MPole = new THREE.Mesh(GPole, Metal);
        MPole.position.set(0, 1.7, 0);
        super.add(MPole);
    
        const GLight = new THREE.SphereGeometry(0.2, 32, 32);
        const MtLight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
    
        const Light = new THREE.PointLight(0xffffff, 1, 100, 2);
        Light.add(new THREE.Mesh(GLight, MtLight));
        Light.position.set(0, 3.5, 0);
        Light.power = 200;
        super.add(Light);
    
        this.Light = Light;
        this.Bulb = MtLight;

        super.castShadow = true;
        super.receiveShadow = true;
        //super.traverse((child) => child.castShadow = child.receiveShadow = true);
      }

      TurnOn()
      {
        this.Light.power = this.Light.power == 0 ? 200 : 0;

        this.Bulb.emissiveIntensity = this.Bulb.emissiveIntensity == 0 ? 3 : 0;
      }
}

class CeilingLight extends THREE.Group
{
    constructor()
    {
        super();

        const GOLamp = new THREE.CylinderGeometry(.06, .16, .2);
        const GILamp = new THREE.CylinderGeometry(.05, .15, .2);
        const MLamp = new THREE.MeshPhysicalMaterial({color: 'white', transmission: .2});

        const MOLamp = new THREE.Mesh(GOLamp, MLamp);
        const MILamp = new THREE.Mesh(GILamp, MLamp);

        const Mesh = CSG.subtract(MOLamp, MILamp);
        this.add(Mesh);

        const Light = new THREE.PointLight(0xffffff, 1, 100, 2);
        Light.power = 0;

        const GBulb = new THREE.SphereGeometry(.05);
        const MBulb = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2});

        Light.add(new THREE.Mesh(GBulb, MBulb));
        Light.position.set(0, -.02, 0);
        super.add(Light);

        this.Light = Light;
    }

    TurnOn()
    {
        this.Light.power = this.Light.power == 0 ? 140 : 0;
    }
}

class LightSwitch extends THREE.Group
{
    constructor(Name, Light)
    {
        super();

        this.Name = Name;
        this.Light = Light;

        const MSwitch = new THREE.MeshStandardMaterial({color: 'white'});
        const GSwitch = new THREE.CylinderGeometry(.09, .1, .01, 4);
        const Mesh = new THREE.Mesh(GSwitch, MSwitch);
        Mesh.rotateY(Math.PI / 4);

        let GEdges = new THREE.EdgesGeometry(Mesh.geometry);
        let MEdges = new THREE.LineBasicMaterial({color: 'black', linewidth: 2});
        let Edges = new THREE.LineSegments(GEdges, MEdges);
        Mesh.add(Edges);
        this.add(Mesh);

        const GButton = new THREE.BoxGeometry(.01, .01, .05);
        const MButton = new THREE.Mesh(GButton, MSwitch);
        MButton.rotateX(-Math.PI / 4);

        GEdges = new THREE.EdgesGeometry(MButton.geometry);
        MEdges = new THREE.LineBasicMaterial({color: 'black', linewidth: 2});
        Edges = new THREE.LineSegments(GEdges, MEdges);

        MButton.add(Edges);
        
        this.Switch = MButton;
        this.add(MButton);
        this.rotateX(Math.PI / 2);
    }

    TurnOn()
    {
        if(this.rotation.x >= -Math.PI / 4) this.Switch.rotateX(Math.PI / 2);
        else this.Switch.rotateX(-Math.PI / 2);
        
        this.Light.TurnOn();
    }
}

class PorchLight extends THREE.Group
{
    constructor()
    {
        super();

        const GBase = new THREE.BoxGeometry(.2, .05, .2); // 0.1, 0.1, 0.1
        const MBase = new THREE.Mesh(GBase, Metal);
        super.add(MBase);


        const GSide = new THREE.BoxGeometry(.02, .3, .02);
        const SidePositions = [[-.09, -.09], [.09, -.09], [.09, .09], [-.09, .09]];

        SidePositions.forEach((pos) => {
            const MSide = new THREE.Mesh(GSide, Metal);
            MSide.position.set(pos[0], .175, pos[1]); // 0.15
            super.add(MSide);
        });


        const GGlass = new THREE.BoxGeometry(.01, .3, .16);
        const GlassPositions = [[-.09, 0], [0, -.09], [.09, 0], [0, .09]];

        GlassPositions.forEach((pos, i) => {
            const MGlass = new THREE.Mesh(GGlass, Glass);
            MGlass.position.set(pos[0], .175, pos[1]);
            MGlass.rotateY(i * Math.PI/2);
            super.add(MGlass);
        });


        const GTop = new THREE.ConeGeometry(.15, .1, 4);
        const MTop = new THREE.Mesh(GTop, Metal);
        MTop.position.set(0, .375, 0);
        MTop.rotateY(Math.PI/4);
        super.add(MTop);


        const GHolder = new THREE.BoxGeometry(.2, .015, .015);
        const MHolder = new THREE.Mesh(GHolder, Metal);
        MHolder.position.set(.08, .61, 0);
        super.add(MHolder);

        const GHolderBase = new THREE.BoxGeometry(.02, .1, .1);
        const MHolderBase = new THREE.Mesh(GHolderBase, Metal);
        MHolderBase.position.set(.19, .61, 0);
        super.add(MHolderBase);


        const Ring = new Ellipse(.015, .03);
        const GRing = new THREE.TubeGeometry(Ring, 64, .005, 16, true);
        const Chain = new THREE.Group();
        for(let i = 0; i < 4; i++)
        {
            const MRing = new THREE.Mesh(GRing, Metal);
            MRing.position.set(0, i * .05, 0);
            Chain.add(MRing);
        }
        Chain.position.set(0, .435, 0);
        Chain.traverse((child) => child.castShadow = child.receiveShadow = true);
        super.add(Chain);
    }
}

class Ellipse extends THREE.Curve
{
    constructor(rx, ry)
    {
        super();
        this.rx = rx;
        this.ry = ry;
    }

    getPoint(t)
    {
        const theta = 2 * Math.PI * t;
        return new THREE.Vector3(this.rx * Math.cos(theta), this.ry * Math.sin(theta), 0);
    }
}

const Texture = new THREE.TextureLoader();

const Metal = new THREE.MeshPhysicalMaterial({
    map: Texture.load('./Textures/PorchLight/MCPorchLights.png'),
    displacementMap: Texture.load('./Textures/PorchLight/MDPorchLights.png'),
    metalnessMap: Texture.load('./Textures/PorchLight/MPorchLights.png'),
    normalMap: Texture.load('./Textures/PorchLight/MNGLPorchLights.png'),
    roughnessMap: Texture.load('./Textures/PorchLight/MRPorchLights.png'),

    displacementScale: 0
})

const Glass = new THREE.MeshPhysicalMaterial({
    map: Texture.load('./Textures/PorchLight/FCPorchLights.png'),
    displacementMap: Texture.load('./Textures/PorchLight/FDPorchLights.png'),
    metalnessMap: Texture.load('./Textures/PorchLight/FMPorchLights.png'),
    normalMap: Texture.load('./Textures/PorchLight/FNGLPorchLights.png'),
    roughnessMap: Texture.load('./Textures/PorchLight/FRPorchLights.png'),

    displacementScale: 0,
    opacity: .7,
    transmission: 1,
    transparent: true
})

export const Wood = new THREE.MeshStandardMaterial({
    map: Texture.load('./Textures/Walls/Wood/CWood.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(5, 5);
    }),
    aoMap: Texture.load('./Textures/Walls/Wood/AOWood.png'),
    displacementMap: Texture.load('./Textures/Walls/Wood/DWood.png'),
    normalMap: Texture.load('./Textures/Walls/Wood/NGLWood.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(5, 5);
    }),
    roughnessMap: Texture.load('./Textures/Walls/Wood/RWood.png'),

    displacementScale: 0
})

export const MWood = new THREE.MeshStandardMaterial({
    map: Texture.load('./Textures/Walls/Wood/CWood.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(1/200, 1/200);
    }),
    aoMap: Texture.load('./Textures/Walls/Wood/AOWood.png'),
    displacementMap: Texture.load('./Textures/Walls/Wood/DWood.png'),
    normalMap: Texture.load('./Textures/Walls/Wood/NGLWood.png', (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(1/200, 1/200);
    }),
    roughnessMap: Texture.load('./Textures/Walls/Wood/RWood.png'),

    displacementScale: 0
})

const Mirror = {
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0x777777
}
