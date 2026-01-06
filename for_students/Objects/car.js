import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let carCounter = 0;

export class Car extends GrObject {
    constructor(x, y, z, minZ, maxZ, stopZ) {
        let car = new T.Group();
        super(`car ${carCounter++}`, car);

        let bodyGeometry = new T.BoxGeometry(2, 0.5, 1);
        let bodyMaterial = new T.MeshStandardMaterial({ color: "blue" });
        let body = new T.Mesh(bodyGeometry, bodyMaterial);
        car.add(body);

        let wheelGeometry = new T.CylinderGeometry(0.25, 0.25, 0.5, 32);
        let wheelMaterial = new T.MeshStandardMaterial({ color: "gray" });

        for (let i = 0; i < 4; i++) {
            let wheel = new T.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.x = (i % 2 === 0 ? -0.75 : 0.75);
            wheel.position.z = (i < 2 ? -0.5 : 0.5);
            car.add(wheel);
        }

        car.position.set(x, y, z);

        // Behavior variables
        this.car = car;
        if (minZ > maxZ) {
            this.speed = -0.02
        }
        else {
            this.speed = 0.02;
        }

        this.ridePoint = new T.Object3D();
        this.ridePoint.position.set(0,2,0); 
        this.ridePoint.rotation.y = Math.PI / 2; // Rotate to face up 
        car.add(this.ridePoint);
        this.rideable = this.ridePoint;

        this.stopZ = stopZ;
        this.maxZ = maxZ;
        this.minZ = minZ;
        this.hasStopped = false;
        this.pauseTime = 0;
    }

    stepWorld(delta, timeOfDay) {
        if (this.hasStopped) {
            this.pauseTime += delta;
            if (this.pauseTime >= 1000) {
                this.hasStopped = false;
                this.pauseTime = 0;
            }
            return;
        }

        this.previousZ = this.car.position.z;
        this.car.position.z += this.speed * delta;

        // Check if we've crossed over stopZ
        if (this.minZ > this.maxZ) {
            if (this.previousZ > this.stopZ && this.car.position.z <= this.stopZ) {
                this.car.position.z = this.stopZ; // snap exactly to stopZ
                this.hasStopped = true;
                return;
            }
    
            if (this.car.position.z < this.maxZ) {
                this.maxZ = -this.maxZ; // reverse maxZ
                this.minZ = -this.minZ; // reverse minZ
                this.stopZ = -this.stopZ; // reverse stopZ as well
                this.speed = -this.speed; // reverse direction
            }
        }
        else {
            if (this.previousZ < this.stopZ && this.car.position.z >= this.stopZ) {
                this.car.position.z = this.stopZ; // snap exactly to stopZ
                this.hasStopped = true;
                return;
            }
    
            if (this.car.position.z > this.maxZ) {
                this.maxZ = -this.maxZ; // reverse maxZ
                this.minZ = -this.minZ; // reverse minZ
                this.stopZ = -this.stopZ; // reverse stopZ as well
                this.speed = -this.speed; // reverse direction
            }
        }
    }
}
