import { useEffect, useRef } from "react";
import { Quaternion, Vector3 } from "three";
import { Quad, Triplet } from "@react-three/cannon";
import { Camera } from "@react-three/fiber";

const useCamera = (camera: Camera, orbitControlsRef: any, isDrag: boolean) => {
  const currentPosition = useRef(new Vector3());

  const updateCameraTarget = (
    delta: number,
    position: Triplet,
    quaCollider: Quad
  ) => {
    const posToVec3 = new Vector3(position[0], position[1], position[2]);
    if (!isDrag) {
      const idealOffset = new Vector3(0, 15, -20);
      idealOffset.applyQuaternion(new Quaternion().fromArray(quaCollider));
      idealOffset.add(posToVec3);

      const t = 1.0 - Math.pow(0.001, delta);

      currentPosition.current.lerp(idealOffset, t);

      camera.position.copy(currentPosition.current);
    } else {
      currentPosition.current = camera.position;
      orbitControlsRef.target = posToVec3;
    }

    camera.lookAt(position[0], position[1] + 2, position[2]);
    camera.updateProjectionMatrix();
  };

  const handleMouseDown = () => {
    isDrag = true;
  };
  const handleMouseUp = () => {
    isDrag = false;
  };

  // const handleMouseMove
  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return {
    updateCameraTarget,
  };
};

export default useCamera;
