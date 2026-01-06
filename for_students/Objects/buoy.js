import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import { shaderMaterial } from "/libs/CS559-Framework/shaderHelper.js";

let buoyCounter = 0;

export class Buoy extends GrObject {
    constructor() {
        let buoy = new T.Group();
        super(`buoy ${buoyCounter++}`, buoy);

        let sphereRadius = 1;
        let mainBodyGeometry = new T.SphereGeometry(sphereRadius, 32, 32);

        let shaderMat = shaderMaterial("/for_students/Shaders/vertexshader.vs", "/for_students/Shaders/buoyshader.fs", {
            side: T.DoubleSide
          });
        let mainBody = new T.Mesh(mainBodyGeometry, shaderMat);
        buoy.add(mainBody);

        let ringGeometry = new T.TorusGeometry(0.5, 0.1, 32, 32);
        let ringMaterial = new T.MeshStandardMaterial({ color: "grey" });
        let ring = new T.Mesh(ringGeometry, ringMaterial);
        ring.position.y = -sphereRadius;
        ring.rotation.x = Math.PI / 2; // rotate to horizontal
        buoy.add(ring);

        let ring2 = new T.Mesh(ringGeometry, ringMaterial);
        ring2.position.y = sphereRadius;
        ring2.rotation.x = Math.PI / 2; // rotate to horizontal
        buoy.add(ring2);

        this.buoy = buoy;
        this.time = 0
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta / 1000; // convert delta from ms to seconds
    
        // bob up and down
        this.buoy.position.y = Math.sin(this.time * 5) * 0.5 - 0.5; // *2 controls bobbing speed

    }
}