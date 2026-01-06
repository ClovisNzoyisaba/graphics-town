import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let boatCounter = 0;
export class Boat extends GrObject {
    constructor(boatPath) {
        let boat = new T.Group();
        super(`boat ${boatCounter++}`, boat);

        let hullWidth = 8;
        let hullLength = 4;
        let hullHeight = 0.5;
        
        let hullGeometry = new T.BoxGeometry(hullWidth, hullHeight, hullLength);
        let hullMaterial = new T.MeshStandardMaterial({ color: "saddlebrown" });
        let hull = new T.Mesh(hullGeometry, hullMaterial);
        hull.position.y = 0.25; // raise the hull above the water
        boat.add(hull);

        let mastRadius = 0.25;
        let mastHeight = 4;

        // Add a mast for the sail
        let mastGeometry = new T.CylinderGeometry(mastRadius, mastRadius, mastHeight, 32);
        let mastMaterial = new T.MeshStandardMaterial({ color: "brown" });
        let mast = new T.Mesh(mastGeometry, mastMaterial);
        mast.position.set(0, hullHeight/2 + mastHeight/2, 0); // position the mast at the base of the sail
        boat.add(mast);

        let sailShape = new T.Shape();
        // create equilateral triangle
        sailShape.moveTo(0, 0);
        sailShape.lineTo(3, 0);
        sailShape.lineTo(1.5, 2.5);
        sailShape.lineTo(0, 0);
        let sailGeometry = new T.ExtrudeGeometry(sailShape, {
            depth: 0.5,
            bevelEnabled: false
        });
        sailGeometry.center();
        let sailMaterial = new T.MeshStandardMaterial({ color: "red", side: T.DoubleSide });
        let sailMaterial2 = new T.MeshStandardMaterial({ color: "white", side: T.DoubleSide });
        let sail = new T.Mesh(sailGeometry, sailMaterial);
        sail.position.set(- mastRadius - 1.25, hullHeight/2 + mastHeight, 0); // position the sail above the hull
        sail.rotation.z = Math.PI / 2; // tilt the sail
        boat.add(sail);

        let sail2 = new T.Mesh(sailGeometry, sailMaterial2);
        sail2.position.set(mastRadius + 1.25, hullHeight/2 + mastHeight, 0); // position the sail above the hull
        sail2.rotation.z = Math.PI / 2; // tilt the sail
        sail2.rotation.y = Math.PI; // flip the sail to face the opposite direction 
        boat.add(sail2);

        let sidesWidth = hullWidth;
        let sidesHeight = hullHeight * 2;
        let sidesDepth = 0.5;
        let sideGeometry = new T.BoxGeometry(sidesWidth, sidesHeight, sidesDepth);
        let sideMaterial = new T.MeshStandardMaterial({ color: "brown" });
        let side1 = new T.Mesh(sideGeometry, sideMaterial);
        side1.position.set(0, hullHeight + sidesHeight/2, -hullLength / 2 + sidesDepth / 2); // position the side at the back of the boat
        boat.add(side1);

        let side2 = new T.Mesh(sideGeometry, sideMaterial);
        side2.position.set(0, hullHeight + sidesHeight/2, hullLength / 2 - sidesDepth / 2); // position the side at the front of the boat
        boat.add(side2);

        let shortSidesWidth = sidesDepth
        let shortSidesHeight = hullHeight * 2;
        let shortSidesDepth = hullLength
        let shortSideGeometry = new T.BoxGeometry(shortSidesWidth, shortSidesHeight, shortSidesDepth);
        let shortSideMaterial = new T.MeshStandardMaterial({ color: "brown" });
        let shortSide1 = new T.Mesh(shortSideGeometry, shortSideMaterial);
        shortSide1.position.set(-hullWidth / 2  + shortSidesWidth/2, hullHeight + shortSidesHeight/2, 0); // position the side at the left of the boat
        boat.add(shortSide1);

        let shortSide2 = new T.Mesh(shortSideGeometry, shortSideMaterial);
        shortSide2.position.set(hullWidth / 2 - shortSidesWidth/2, hullHeight + shortSidesHeight/2, 0); // position the side at the right of the boat
        boat.add(shortSide2);

        let saddleHeight = 5; // height of the saddle
        let saddleRadius = 0.25; // radius of the saddle
        let saddleGeometry = new T.CylinderGeometry(saddleRadius, saddleRadius, saddleHeight, 32);
        let saddleMaterial = new T.MeshStandardMaterial({ color: "saddlebrown" });
        let saddle = new T.Mesh(saddleGeometry, saddleMaterial);
        saddle.position.set(hullWidth/4, hullHeight + sidesHeight, hullLength/2); // position the rower in the boat
        saddle.rotation.x = -Math.PI / 4; // orient the rower upright
        boat.add(saddle);

        let saddle2 = new T.Mesh(saddleGeometry, saddleMaterial);
        saddle2.position.set(-hullWidth/4, hullHeight + sidesHeight, -hullLength/2); // position the rower in the boat
        saddle2.rotation.x = Math.PI / 4; // orient the rower upright
        boat.add(saddle2);


        this.boat = boat;
        this.saddle1 = saddle;
        this.saddle2 = saddle2;
        this.boatPath = boatPath;
        this.time = 0;
        this.pauseTime = 0;
        this.paused = false;
        this.speed = 1

        this.ridePoint = new T.Object3D();
        this.ridePoint.position.set(0,2,0); 
        this.ridePoint.rotation.y = Math.PI / 2; // Rotate to face up 
        boat.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }

    stepWorld(delta, timeOfDay) {
        if (this.boatPath) {
            if (!this.paused) {
                const t = this.time;
                const pos = this.boatPath.getPointAt(t);
                this.boat.position.copy(pos);
    
                // Get the tangent to orient the boat
                const tangent = this.boatPath.getTangentAt(t).normalize();
                this.boat.lookAt(pos.clone().add(tangent));
                this.boat.rotateY(-Math.PI / 2);

                const paddleAmplitude = Math.PI / 8;  // how far to swing (in radians)
                const paddleSpeed = 10;               // how fast to swing
                
                // Animate rotation based on time
                const angle = Math.sin(this.time * Math.PI * paddleSpeed) * paddleAmplitude;
                
                this.saddle1.rotation.z = angle;
                this.saddle2.rotation.z = -angle;  // opposite phase for rowing feel
    
                // Advance time
                this.time += delta * this.speed / 3000;
    
                // If it reaches either end, pause and reverse
                if (this.time > 1) {
                    this.time = 1; // Clamp at end
                    this.paused = true;
                }
                else if (this.time < 0) {
                    this.time = 0; // Clamp at start
                    this.paused = true;
                }
            }
            else {
                this.pauseTime += delta;
                if (this.pauseTime >= 1000) {
                    this.pauseTime = 0;
                    this.speed = -this.speed;  // Reverse speed
                    this.paused = false;
                }
            }
        }
    }
}