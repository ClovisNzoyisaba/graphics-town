import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let ferrisWheelCtr = 0;

export class FerrisWheel extends GrObject {
    constructor(params = {}) {
      let ferrisWheel = new T.Group();
      let wheel_radius = 3;
      let wheel_thickness = 0.25;
  
      // Group to rotate just the wheels and cabins
      let rotatingWheelGroup = new T.Group();
      rotatingWheelGroup.position.y = wheel_radius * 2; // raise above base
      ferrisWheel.add(rotatingWheelGroup);
  
      let wheel_geom = new T.TorusGeometry(wheel_radius, wheel_thickness, 16, 32);
      let wheel_mat = new T.MeshStandardMaterial({
        color: "lightblue",
        metalness: 0.3,
        roughness: 0.8
      });
  
      // Save cabin pivots for rotation
      let cabinPivots = [];
  
      createWheels();
      createCabins();
      createCenterPiece();
      createBase();
  
      function createWheels() {
        for (let i = 0; i < 2; i++) {
          let wheel = new T.Mesh(wheel_geom, wheel_mat);
          wheel.position.z = (i === 0) ? -1 : 1; // left and right wheels
          rotatingWheelGroup.add(wheel);
      
          for (let j = 0; j < 16; j++) {
            let angle = (2 * j * Math.PI) / 16;
            let spoke_group = new T.Group();
            spoke_group.rotation.z = angle;
            spoke_group.position.z = wheel.position.z;
      
            let spoke_geom = new T.CylinderGeometry(0.05, 0.05, wheel_radius - wheel_thickness, 8);
            let spoke_mat = new T.MeshStandardMaterial({
              color: "#777777",
              metalness: 0.8,
              roughness: 0.2
            });
            let spoke = new T.Mesh(spoke_geom, spoke_mat);
            spoke.position.y = (wheel_radius - wheel_thickness) / 2;
            spoke_group.add(spoke);
      
            rotatingWheelGroup.add(spoke_group);
          }
        }
      }
      
  
      function createCabins() {
        let cabin_geom = new T.BoxGeometry(0.5, 0.5, 1);
        let cabin_mat = new T.MeshStandardMaterial({
          color: "yellow",
          metalness: 0.3,
          roughness: 0.6
        });
        for (let i = 0; i < 8; i++) {
          let angle = (2 * i * Math.PI) / 8;
          let x = wheel_radius * Math.cos(angle);
          let y = wheel_radius * Math.sin(angle);
      
          // Pivot group allows cabins to hang and stay upright if needed
          let cabin_pivot = new T.Group();
          cabin_pivot.position.set(x, y, 0);
      

          let cabin = new T.Mesh(cabin_geom, cabin_mat);
          cabin_pivot.add(cabin);
      
          rotatingWheelGroup.add(cabin_pivot);
        }
      }
      
  
      function createCenterPiece() {
        let center_geom = new T.CylinderGeometry(0.5, 0.5, 2, 16);
        let center_mat = new T.MeshStandardMaterial({
          color: "#777777",
          metalness: 0.8,
          roughness: 0.5
        });
        let center = new T.Mesh(center_geom, center_mat);
        center.rotation.x = Math.PI / 2;
        center.position.y = wheel_radius * 2;
        ferrisWheel.add(center);

        let cap_geom = new T.CylinderGeometry(0.75, 0.75, 0.75, 16);
        let cap_mat = new T.MeshStandardMaterial({
          color: "#777777",
          metalness: 0.8,
          roughness: 0.5
        });

        for (let i = 0; i < 2; ++i) {
          
          let cap = new T.Mesh(cap_geom, cap_mat);
          cap.rotation.x = Math.PI / 2;
          cap.position.y = wheel_radius * 2;
          cap.position.z = i === 0 ? -1.5 : 1.5;
          ferrisWheel.add(cap);

          let support_geom = new T.CylinderGeometry(0.1, 0.1, wheel_radius * 2, 8);
          let support_mat = new T.MeshStandardMaterial({
            color: "gray",
            metalness: 0.8,
            roughness: 0.2
          });

          for (let j = 0; j < 2; ++j) {
            let support = new T.Mesh(support_geom, support_mat);
            support.position.set(
              (j === 0 ? 0.5 : -0.5) * wheel_radius,
              0,
              cap.position.z
            );
            support.rotation.z = j === 0 ? Math.PI / 6 : -Math.PI / 6;
            support.position.y = wheel_radius;
            ferrisWheel.add(support);
          }
        }
      }
  
      function createBase() {
        let base_geom = new T.CylinderGeometry(4, 4, 0.5, 16);
        let base_mat = new T.MeshStandardMaterial({
          color: "#888888",
          metalness: 0.5,
          roughness: 0.8
        });
        let base = new T.Mesh(base_geom, base_mat);
        ferrisWheel.add(base);
      }
  
      // Final setup
      super(`FerrisWheel-${ferrisWheelCtr++}`, ferrisWheel);
  
      ferrisWheel.position.x = params.x ? Number(params.x) : 0;
      ferrisWheel.position.y = params.y ? Number(params.y) : 0;
      ferrisWheel.position.z = params.z ? Number(params.z) : 0;
      let scale = params.size ? Number(params.size) : 1;
      ferrisWheel.scale.set(scale, scale, scale);
  
      // Save rotating wheel group for animation
      this.rotatingGroup = rotatingWheelGroup;
      this.cabinPivots = cabinPivots; // Save cabin pivots for counter-rotation
      this.rotationSpeed = 0.0005; // customizable speed

      this.ridePoint = new T.Object3D();
      this.ridePoint.position.set(0,2,0); 
      this.ridePoint.rotation.y = Math.PI / 2; // Rotate to face up 
      ferrisWheel.add(this.ridePoint);
    }
  
    stepWorld(delta, timeOfDay) {
      if (this.rotatingGroup) {
        let rotationAmount = this.rotationSpeed * delta;
        this.rotatingGroup.rotation.z += rotationAmount;
  
        // Counter-rotate cabins to stay upright
        for (let pivot of this.cabinPivots) {
          pivot.rotation.z += rotationAmount;
        }
      }
    }
  }
  