import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";

let treeCounter = 0;

class Tree extends GrObject {
  constructor(params = {}) {
    let tree = new T.Group();
    super(`tree ${treeCounter++}`, tree);

    function createTree () {
        let trunkGeo =  new T.BoxGeometry(0.25, 1, 0.25);
        let trunkMat = new T.MeshStandardMaterial({color: "red"})
        let leafGeo = new T.SphereGeometry(0.25,32);
        let leafMat = new T.MeshStandardMaterial({color: "darkgreen"})
      
        let trunkH = trunkGeo.parameters.height
        let trunkW = trunkGeo.parameters.width
        let trunkD = trunkGeo.parameters.depth
        let leafR = leafGeo.parameters.radius
      
        let trunk = new T.Mesh(trunkGeo, trunkMat)
        tree.add(trunk)
      
        for (let x = 0; x < 3; ++x) {
          for (let y = 0; y < 3; ++y) {
            for (let z = 0; z < 3; ++z) {
              let leaf = new T.Mesh(leafGeo, leafMat)
              let py = leaf.position.y + trunkH / 2 + leafR + (y * leafR * 2)
              let px = leaf.position.x - trunkW - leafR + (x * leafR * 2)
              let pz = leaf.position.z - trunkD - leafR + (z * leafR * 2)
              leaf.position.y = py
              leaf.position.x = px
              leaf.position.z = pz
              tree.add(leaf)
            }
            }
        }
    }

    createTree();
  }
}

export { Tree };