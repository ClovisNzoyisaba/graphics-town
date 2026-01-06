import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { MTLLoader } from 'https://unpkg.com/three@0.165.0/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.165.0/examples/jsm/loaders/OBJLoader.js';

let numTrain = 0;

class Train extends GrObject {
    constructor(trainTrack) {
        // load the train model using OBJLoader
        const mtlLoader = new MTLLoader();
        let train = new T.Group();

        mtlLoader.load('/for_students/Assets/Toy Train/3dp_toytrain_hi.MTL', (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);

            objLoader.load('/for_students/Assets/Toy Train/3dp_toytrain_hi.obj', (object) => {
                object.scale.set(0.4,0.4,0.4); // Scale down the model 
     
                train.add(object);
            });

        });

        super(`train ${numTrain++}`, train);


        this.ridePoint = new T.Object3D();
        this.ridePoint.position.set(0, 2, 2);  // wherever you want the camera relative to the train
        train.add(this.ridePoint);
        this.rideable = this.ridePoint;

        this.trainTrack = trainTrack;
        this.train = train; 
        this.time = 0.0
    }

    stepWorld(delta, timeOfDay) {
        if (this.trainTrack) {
            let speed = 0.5
            this.time = (this.time + delta * speed / 3000) % 1;
            // console.log(this.time);
            const t = this.time
            const pos = this.trainTrack.getPointAt(t);
            let updatedPos = new T.Vector3(pos.x, pos.y, pos.z);
            this.train.position.copy(updatedPos);


            //Get the tangent to orient the train
            const tangent = this.trainTrack.getTangentAt(t).normalize();
            this.train.lookAt(updatedPos.clone().add(tangent));
        }
        // Update the train's position along the track
        
        // This method is called every frame, but we don't need to do anything here for now
    }
}

export { Train };