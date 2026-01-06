import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";

let skyscraperCt = 0;

class Skyscraper extends GrObject {
    constructor(params = {}) {
        const group = new T.Group();
        super(`skyscraper-${skyscraperCt++}`, group);

        // Default parameters
        const width = params.width || 4;
        const depth = params.depth || 4;
        const floorHeight = params.floorHeight || 2;
        const floors = params.floors || 10;
        const color = params.color || "lightgray";

        const totalHeight = floors * floorHeight;

        // const loader = new T.TextureLoader();
        // const texture = loader.load("/for_students/Assets/beautiful-exterior-building-with-glass-window-pattern-textures.jpg");

        const buildingMaterial = new T.MeshStandardMaterial({ color: color});
        const buildingGeometry = new T.BoxGeometry(width, totalHeight, depth);
        const building = new T.Mesh(buildingGeometry, buildingMaterial);

        building.position.y = totalHeight / 2; // sit on the ground
        group.add(building);

        // Optional: add a simple flat roof decoration
        const roofGeometry = new T.BoxGeometry(width * 0.8, 0.5, depth * 0.8);
        const roofMaterial = new T.MeshStandardMaterial({ color: "dimgray" });
        const roof = new T.Mesh(roofGeometry, roofMaterial);
        roof.position.y = totalHeight + 0.25;
        group.add(roof);

        // Optional: add a simple antenna
        const antennaGeometry = new T.CylinderGeometry(0.1, 0.1, 3, 8);
        const antennaMaterial = new T.MeshStandardMaterial({ color: "black" });
        const antenna = new T.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.y = totalHeight + 2;
        group.add(antenna);
    }
}

export { Skyscraper };