import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";

class TrainTrack extends GrObject {
    constructor(trackPoints = []) {
        let trainTrack = new T.Group();
        super(`TrainTrack`, trainTrack);

        // Default simple square track if no points provided
        if (trackPoints.length === 0) {
            trackPoints = [
                new T.Vector3(-10, 5, 0),
                new T.Vector3(-5, 5, -1),
                new T.Vector3(0, 5, 1),
                new T.Vector3(5, 5, -1),
                new T.Vector3(10, 5, 0)
            ];
        }



        this.curve = new T.CatmullRomCurve3(trackPoints, true); // closed loop

        // Create visual track segments (simple boxes along the curve)

        const trackMaterial = new T.MeshStandardMaterial({ color: "darkgrey" });
        const pillarMaterial = new T.MeshStandardMaterial({ color: "darkgrey" });

        let segmentWidth = 2;
        let segmentHeight = 0.5;
        let segmentDepth = 2;

        this.segmentHeight = segmentHeight;



        let pillarWidth = 1;
        let pillarHeight = 8; // taller than the track

        
        const segmentGeometry = new T.BoxGeometry(segmentWidth, segmentHeight, segmentDepth);
        const pillarGeometry = new T.CylinderGeometry(pillarWidth, pillarWidth, pillarHeight, 32); // cylinder for pillars


        const numSegments = 100;

        for (let i = 0; i < numSegments; i++) {
            const t = i / numSegments;
            const pos = this.curve.getPointAt(t);
            const tangent = this.curve.getTangentAt(t).normalize();

            const nextT = (i + 1) / numSegments;
            const nextPos = this.curve.getPointAt(nextT);

            // Create track segment
            const segment = new T.Mesh(segmentGeometry, trackMaterial);

            segment.position.copy(pos);
            segment.lookAt(new T.Vector3(nextPos.x, pos.y, nextPos.z));
            trainTrack.add(segment);

            // Create pillar at the segment position
            if (i % 5 == 0) {
                const pillar = new T.Mesh(pillarGeometry, pillarMaterial);
                pillar.position.copy(new T.Vector3(pos.x, pos.y - pillarHeight / 2 - segmentHeight/2, pos.z)); // place on the ground
                trainTrack.add(pillar);
            }
        }


    }

    getPointAt(t) {
        return this.curve.getPointAt(t);
    }

    getTangentAt(t) {
        return this.curve.getTangentAt(t);
    }
}

export { TrainTrack };