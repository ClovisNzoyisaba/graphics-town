import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";

let benchCounter = 0;  

class Bench extends GrObject {
    constructor() {
        let bench = new T.Group();
        super(`bench ${benchCounter++}`, bench);
        let seatGeometry =  new T.BoxGeometry(0.75, 0.1, 0.75);
        let legGeometry =  new T.BoxGeometry(0.1, 0.5, 0.1);
        let backRestGeometry =  new T.BoxGeometry(0.75, 0.05, 0.1);
        
        let chairMaterial = new T.MeshStandardMaterial({color: "brown"})
        
        let seatWidth = seatGeometry.parameters.width;
        let seatHeight = seatGeometry.parameters.height;
        let legWidth = legGeometry.parameters.width;
        let legHeight = legGeometry.parameters.height;
        let backRestWidth = backRestGeometry.parameters.width;
        let backRestHeight = backRestGeometry.parameters.height;
        
        for (let i = 0; i < 2; ++i) {
            createChair(new T.Vector3(i * (seatWidth), 0, 0));
        }

        function createChair(seatPosition) {
            let seat = new T.Mesh(seatGeometry, chairMaterial)
            seat.position.copy(seatPosition);

            bench.add(seat)
          
            for (let i = 0; i < 2; ++i) {
              for (let j = 0; j < 2; ++j) {
                let x = seat.position.x - seatWidth / 2 + legWidth / 2 + (j * (seatWidth - legWidth))
                let y = seat.position.y - seatHeight / 2 - legHeight / 2
                let z = seat.position.z - seatWidth / 2 + legWidth / 2 + (i * (seatWidth - legWidth))
                let leg = new T.Mesh(legGeometry, chairMaterial)
                leg.position.set(x,y,z)
                bench.add(leg)
              }
            }
          
            for (let i = 0; i < 2; ++i) {
              let x = seat.position.x - seatWidth / 2 + legWidth / 2 + (i * (seatWidth - legWidth))
              let y = seat.position.y + seatHeight / 2 + legHeight / 2
              let z = seat.position.z - seatWidth / 2 + legWidth / 2
              let upperLeg = new T.Mesh(legGeometry, chairMaterial)
              upperLeg.position.set(x,y,z)
              bench.add(upperLeg)
            }
          
            for (let i = 0; i < 2; ++i) {
              let x = seat.position.x
              let y = seat.position.y + seatHeight / 2 + legHeight - (i * (legHeight/2))
              let z = seat.position.z - seatWidth / 2 + legWidth / 2
              let backrest = new T.Mesh(backRestGeometry, chairMaterial)
              backrest.position.set(x,y,z)
              bench.add(backrest)
            }
        }
    }
}

export { Bench };