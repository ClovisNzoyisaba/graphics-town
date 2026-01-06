/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */
import * as T from "./libs/CS559-Three/build/three.module.js";
import { GrWorld } from "./libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "./libs/CS559-Framework/WorldUI.js";

// import {main} from "../examples/main.js";

import {Train} from "./for_students/Objects/train.js";
import {TrainTrack} from "./for_students/Objects/traintrack.js";
import {Skyscraper} from "./for_students/Objects/skyskraper.js";
import {FerrisWheel} from "./for_students/Objects/ferriswheel.js";
import { shaderMaterial } from "./libs/CS559-Framework/shaderHelper.js";
import { GrObject } from "./libs/CS559-Framework/GrObject.js";
import { Bench } from "./for_students/Objects/bench.js";
import { Tree } from "./for_students/Objects/tree.js";
import { Car } from "./for_students/Objects/car.js";
import { StopSign } from "./for_students/Objects/stopsign.js";
import {Buoy} from "./for_students/Objects/buoy.js";
import { Boat } from "./for_students/Objects/boat.js";


/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplane: false, // make the ground plane big enough for a world of stuff
    lookfrom: new T.Vector3(100, 30, -20), // where the camera starts
});

// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
// main(world);

let groundWidth = 55
let groundHeight = 5
let groundDepth = 50
let groundGeometry = new T.BoxGeometry(groundWidth, groundHeight, groundDepth);
let groundMaterial = new T.MeshStandardMaterial({ color: "SaddleBrown" });
let ground = new T.Mesh(groundGeometry, groundMaterial);
ground.position.set(-10, 0, 0); // position the ground below the origin
world.scene.add(ground);

let waterWidth = 50;
let waterHeight = 1;
let waterDepth = 50;
let waterGeometry = new T.BoxGeometry(waterWidth, waterHeight, waterDepth);

let shaderMat = shaderMaterial("./for_students/Shaders/vertexshader.vs", "./for_students/Shaders/watershader.fs", {
    side: T.DoubleSide,
    uniforms: {
        uTime: { value: 0.0 }
    }
  });

let waterMesh = new T.Mesh(waterGeometry, shaderMat);
let water = new GrObject("water", waterMesh);
water.stepWorld = function(delta, timeOfDay) {
    this.objects[0].material.uniforms.uTime.value += delta / 1000;
};
waterMesh.position.set(-10 + groundWidth/2 + waterWidth/2, -groundHeight/2 + waterHeight/2, 0);
world.add(water);


let beachWidth = 4;
let beachHeight = groundHeight - waterHeight;
let beachDepth = 50;

let beachShape = new T.Shape();
beachShape.moveTo(0, 0);
beachShape.lineTo(beachWidth, -beachHeight);
beachShape.lineTo(0, -beachHeight);
beachShape.lineTo(0, 0);

let beachGeometry = new T.ExtrudeGeometry(beachShape, { depth: beachDepth, bevelEnabled: false });
let beachMaterial = new T.MeshStandardMaterial({ 
    color: "sandybrown", // color of the beach
    roughness: 0.4,
    metalness: 0.1
});
let beach = new T.Mesh(beachGeometry, beachMaterial);
beachGeometry.center(); // center the geometry around the origin
beach.position.set(-10 + groundWidth/2 + beachWidth/2, waterHeight/2, 0);


world.scene.add(beach);

let pier = new T.Group();
let pierWidth = 20;
let pierHeight = 1;
let pierDepth = 10;
let pierGeometry = new T.BoxGeometry(pierWidth, pierHeight, pierDepth);
let pierMaterial = new T.MeshStandardMaterial({ color: "saddlebrown" });
let pierMesh = new T.Mesh(pierGeometry, pierMaterial);
pierMesh.position.set(-10 + groundWidth/2 + pierWidth/2, groundHeight/2 - pierHeight/2, 0)
pier.add(pierMesh);

let pierLegsHeight = groundHeight - pierHeight;
let pierLegsRadius = 0.5; // radius of the pier legs
let pierLegsGeometry = new T.CylinderGeometry(pierLegsRadius, pierLegsRadius, pierLegsHeight, 32);
let pierLegsMaterial = new T.MeshStandardMaterial({ color: "saddlebrown" });

for (let i = 0; i < Math.floor(pierWidth/2); i++) {
    let t = i / Math.floor(pierWidth/2); 
    let leftPierLegs = new T.Mesh(pierLegsGeometry, pierLegsMaterial);
    let rightPierLegs = new T.Mesh(pierLegsGeometry, pierLegsMaterial);
    
    leftPierLegs.position.set(-10 + groundWidth/2 + t * pierWidth, groundHeight/2 - pierHeight/2 - pierLegsHeight/2, -pierDepth/2 + 0.5);
    rightPierLegs.position.set(-10 + groundWidth/2 + t * pierWidth, groundHeight/2 - pierHeight/2 - pierLegsHeight/2, pierDepth/2 - 0.5);

    pier.add(rightPierLegs);
    pier.add(leftPierLegs);
}

world.scene.add(pier);

let grassWidth = 5
let grassDepth = groundDepth;
let grassHeight = 0.05; // offset to place grass slightly above the ground
let grassGeometry = new T.BoxGeometry(grassWidth,grassHeight, grassDepth) // thin box for grass

let grassMaterial = new T.MeshStandardMaterial({ 
    color: "green",
});

let grassMesh = new T.Mesh(grassGeometry, grassMaterial);
grassMesh.position.set(2, groundHeight/2 + 0.05, 0); // position the grass on top of the ground;

world.scene.add(grassMesh);

let road = new T.Group();
let roadWidth = 13;
let roadHeight = 0.05; // offset to place road slightly above the ground
let roadDepth = groundDepth;
let roadGeometry = new T.BoxGeometry(roadWidth, roadHeight, roadDepth); // thin box for road
let roadMaterial = new T.MeshStandardMaterial({ color: "black" });
let roadMesh = new T.Mesh(roadGeometry, roadMaterial);
// position road after grass
roadMesh.position.set(2+grassWidth/2 + roadWidth/2, groundHeight/2 + 0.05, 0); // position the road on top of the grass
road.add(roadMesh);
// create road lines
let roadLineWidth = 0.2; // width of the road line
let roadLineHeight = 0.01; // height of the road line

let roadLineGeometry = new T.BoxGeometry(roadLineWidth, roadLineHeight, roadDepth); // thin box for road line
let roadLineMaterial = new T.MeshStandardMaterial({ color: "white" });
// create dashed road lines
for (let i = -roadWidth/2 + 0.5; i < roadWidth/2; i += 1) {
    if (i % 2 === 0) { // create dashed lines every 2 units
        let roadLineMesh = new T.Mesh(roadLineGeometry, roadLineMaterial);
        roadLineMesh.position.set(2+grassWidth/2 + roadWidth/2 + i, groundHeight/2 + 0.1, 0); // position the road line on top of the road
        road.add(roadLineMesh);
    }
}

world.scene.add(road);

let cityFloorHeight = 0.05
let cityFloorWidth = groundWidth - grassWidth - roadWidth;
let cityFloorDepth = groundDepth; // same depth as the ground
let cityFloorGeometry = new T.BoxGeometry(cityFloorWidth, cityFloorHeight, cityFloorDepth); // thin box for city floor

let cityFloorMaterial = new T.MeshStandardMaterial({ 
    color: "gray",
});
let cityFloorMesh = new T.Mesh(cityFloorGeometry, cityFloorMaterial);
cityFloorMesh.position.set(-10 - groundWidth/2 + cityFloorWidth/2, groundHeight/2 + cityFloorHeight/2, 0); // position the city floor on top of the road


world.scene.add(cityFloorMesh);

let ferrisWheel = new FerrisWheel();
ferrisWheel.objects[0].position.set(-10 + groundWidth/2 + pierWidth/2, groundHeight/2, 0);
ferrisWheel.objects[0].rotation.y = Math.PI / 2; // rotate the ferris wheel to face the water
world.add(ferrisWheel);

let trackPoints = [
    new T.Vector3(-9, 10, -20),   // Bottom-right
    new T.Vector3(-9, 10, 20),    // Top-right
    new T.Vector3(-18, 10, 24),   // Top-center-left curve
    new T.Vector3(-24, 10, 20),   // Top-left
    new T.Vector3(-24, 10, -20),  // Bottom-left
    new T.Vector3(-18, 10, -24),  // Bottom-center-left curve
  ];

let trainTrack = new TrainTrack(trackPoints)
world.add(trainTrack);

let train = new Train(trainTrack);
world.add(train);


for (let i = 0; i < 3; i++) {
    let car = new Car(grassWidth + 1 + i * 4, groundHeight/2 + 0.5, groundDepth/2 - 5, -20, 20, -5);
    car.objects[0].rotation.y = Math.PI / 2;
    world.add(car)
}

for (let i = 0; i < 3; i++) {
    let car = new Car(grassWidth + 3 + i * 4, groundHeight/2 + 0.5, -groundDepth/2 + 5, 20, -20, 5);
    car.objects[0].rotation.y = Math.PI / 2;
    world.add(car)
}

for (let i = 0; i < 4; i++) {
    let bench = new Bench();
    bench.objects[0].position.set(2, groundHeight/2 + 0.5, -15 + i * 10);
    bench.objects[0].rotation.y = Math.PI / 2; // rotate the bench to face the water
    world.add(bench);
}

for (let i = 0; i < 5; ++i) {
    let tree = new Tree();
    tree.objects[0].scale.set(1.5,1.5,1.5) // scale down the tree
    tree.objects[0].position.set(2, groundHeight/2 + 0.5, -20 + i * 10);
    world.add(tree);
}

for (let i = 0; i < 7; ++i) {
    let stopSign = new StopSign();
    stopSign.objects[0].position.set(5 + i * 2, groundHeight/2, 0);
    world.add(stopSign);
}

for (let i = 0; i < 5; ++i) {
    let buoy = new Buoy();
    buoy.objects[0].position.set(-10 + groundWidth/2 + pierWidth/2 + waterWidth/2, 0.25, -20 + i * 10);
    world.add(buoy);
}


for (let i = 0; i < 9; i++) {
    let skyscraper = new Skyscraper({ width: 3 + i % 2, depth: 3 + i % 2, floors: 2 + (i % 2) * 2, color: i % 2 == 0? "skyblue" : "lightgray" });
    skyscraper.objects[0].position.set(-3, groundHeight/2, 20 - i * 5);
    world.add(skyscraper);
}

for (let i = 0; i < 9; i++) {
    let skyscraper = new Skyscraper({ width: 3 + i % 2, depth: 3 + i % 2, floors: 2 + (i % 2) * 2, color: i % 2 == 0? "skyblue" : "lightgray" });
    skyscraper.objects[0].position.set(-35, groundHeight/2, 20 - i * 5);
    world.add(skyscraper);
}


for (let i = 0; i < 5; i++) {
    let skyscraper = new Skyscraper({ width: 3 + i % 2, depth: 3 + i % 2, floors: 5 + (i % 2) * 2, color: i % 2 == 0? "skyblue" : "lightgray" });
    skyscraper.objects[0].position.set(-15, groundHeight/2, -5 + i * 5);
    world.add(skyscraper);
}


//create stacked skysraper
let superSkyskraperBase = new Skyscraper({ width: 8, depth: 8, floors: 5, color: "lightgray" });
superSkyskraperBase.objects[0].position.set(-17, groundHeight/2, -15);
world.add(superSkyskraperBase);

let superSkyskraperMiddle = new Skyscraper({ width: 6, depth: 6, floors: 10, color: "skyblue" });
superSkyskraperMiddle.objects[0].position.set(-17, groundHeight/2 + 5, -15);
world.add(superSkyskraperMiddle);

let superSkyskraperTop = new Skyscraper({ width: 4, depth: 4, floors: 10, color: "lightgray" });
superSkyskraperTop.objects[0].position.set(-17, groundHeight/2 + 15, -15);
world.add(superSkyskraperTop);

let boatPath = new T.CatmullRomCurve3([
    new T.Vector3(-10 + groundWidth/2 + pierWidth/2, -groundHeight/2 + waterHeight/2 + 1, -10),
    new T.Vector3(-10 + groundWidth/2 + pierWidth/2 + waterWidth/4, -groundHeight/2 + waterHeight/2 + 1, -10),
    new T.Vector3(-10 + groundWidth/2 + pierWidth/2 + waterWidth/3, -groundHeight/2 + waterHeight/2 + 1, 0),
    new T.Vector3(-10 + groundWidth/2 + pierWidth/2 + waterWidth/4, -groundHeight/2 + waterHeight/2 + 1, 10),
    new T.Vector3(-10 + groundWidth/2 + pierWidth/2, -groundHeight/2 + waterHeight/2 + 1, 10),
]);

let boat = new Boat(boatPath);
boat.objects[0].position.set(-10 + groundWidth/2 + pierWidth/2, groundHeight/2 + 2, -20);
boat.objects[0].rotation.y = Math.PI / 2; // rotate the boat to face the water

world.add(boat);

const ambientLight = new T.AmbientLight(0xffffff, 0.8);
world.scene.add(ambientLight);

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("train 0");
highlight("FerrisWheel-0");
highlight("car 0")
highlight("boat 0")
highlight("bench 0")
highlight("buoy 0")
highlight("stopSign 0")
highlight("tree 0")
highlight("skyscraper-0")
highlight("TrainTrack")

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
