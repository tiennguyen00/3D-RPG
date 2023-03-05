import { PublicApi, Triplet } from "@react-three/cannon";
import { useKeyboardControls } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

const useMoving = (isDrag: boolean) => {
  const [, getKeys] = useKeyboardControls();
  // For character state
  const velocity = new THREE.Vector3(0, 0, 0);
  const acceleration = new THREE.Vector3(1, 0.125, 20.0);
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);

  const changeCharacterState = (
    delta: number,
    collider: THREE.Object3D<THREE.Event>,
    api: PublicApi,
    rolCollider: Triplet,
    posCollider: Triplet,
    velCollider: Triplet
  ) => {
    const { backward, leftward, rightward, forward, jump, run } = getKeys();

    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));
    newVelocity.add(frameDecceleration);

    const controlObject = collider;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const euler = new THREE.Euler(
      rolCollider[0],
      rolCollider[1],
      rolCollider[2]
    );
    const degreeY = THREE.MathUtils.radToDeg(euler.y);
    const degreeX = THREE.MathUtils.radToDeg(euler.x);

    const naughtyVector = new THREE.Vector3(
      Math.sin((degreeY * Math.PI) / 180) * 10,
      0,
      Math.cos((degreeY * Math.PI) / 180) *
        10 *
        (degreeX === -180 || degreeX === 180 ? -1 : 1)
    );

    if (run) {
      naughtyVector.multiplyScalar(1.5);
    }

    if (forward) {
      api.velocity.set(naughtyVector.x, naughtyVector.y, naughtyVector.z);
    }
    if (backward) {
      api.velocity.set(-naughtyVector.x, -naughtyVector.y, -naughtyVector.z);
    }
    if (leftward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (rightward) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (jump && Math.abs(Number(velCollider[1].toFixed(2))) < 0.05) {
      api.velocity.set(velCollider[0], 10, velCollider[2]);
    }

    api.quaternion.copy(_R);
    controlObject.quaternion.copy(_R);
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
    changeCharacterState,
  };
};

export default useMoving;
