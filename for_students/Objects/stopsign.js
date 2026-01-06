import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";

let stopSignCounter = 0;

export class StopSign extends GrObject {
    constructor() {
        let stopSign = new T.Group();
        super(`stopSign ${stopSignCounter++}`, stopSign);

        let poleGeometry = new T.CylinderGeometry(0.1, 0.1, 1);
        let poleMaterial = new T.MeshStandardMaterial({ color: "gray" });
        let pole = new T.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 0.5;
        stopSign.add(pole);

        let signGeometry = new T.CylinderGeometry(0.5, 0.5, 0.25, 6);
        let signMaterial = new T.MeshStandardMaterial({ color: "red" });
        let sign = new T.Mesh(signGeometry, signMaterial);
        sign.position.y = 1.5;
        sign.rotation.x = Math.PI / 2; 
        stopSign.add(sign);

        this.mesh = stopSign;
    }
}