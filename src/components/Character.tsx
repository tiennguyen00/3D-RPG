import useAnimation, { ActionName, Animations } from "@/hooks/useAnimation";
import useCamera from "@/hooks/useCamera";
import useMoving from "@/hooks/useMoving";
import {
  Quad,
  Triplet,
  useBox,
  useCompoundBody,
  useSphere,
} from "@react-three/cannon";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimationMixer, Group, Mesh } from "three";

const CharacterModel = ({ orbitControlRef }: any) => {
  const character = useGLTF("/men-pack/Adventurer.glb");
  const { camera } = useThree();
  const isDrag = useRef(false);
  const characterRef = useRef<Group>(null);
  const { changeCharacterState } = useMoving(isDrag.current);
  const { updateCameraTarget } = useCamera(
    camera,
    orbitControlRef.current,
    isDrag.current
  );
  const { actions, names } = useAnimations(
    character.animations,
    character.scene
  );
  const { changeAnim } = useAnimation(
    actions as Animations,
    names as ActionName[]
  );

  const rotationCollider = useRef<Triplet>();
  const posCollider = useRef<Triplet>();
  const quadCollider = useRef<Quad>();
  const velCollider = useRef<Triplet>();

  // const [_, api] = useCompoundBody(() => ({
  //   mass: 1,
  //   position: [0, 8, 0],
  //   shapes: [
  //     {
  //       type: "Sphere",
  //       args: [1],
  //       position: [0, 4, 0.5],
  //     },
  //     {
  //       type: "Cylinder",
  //       args: [1.5, 1.5, 7.5],
  //       position: [0, -0.5, 0],
  //     },
  //   ],
  // }));

  const [_, api] = useSphere(() => ({
    mass: 50,
    type: "Dynamic",
    args: [4.5],
    position: [0, 40, 0],
    fixedRotation: true,
  }));

  useMemo(() => {
    character.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }, []);

  useEffect(() => {
    api.rotation.subscribe((e) => {
      rotationCollider.current = e;
    });
    api.position.subscribe((e) => {
      posCollider.current = e;
    });
    api.quaternion.subscribe((e) => {
      quadCollider.current = e;
    });
    api.velocity.subscribe((e) => (velCollider.current = e));
  }, []);

  useFrame((_, delta) => {
    if (
      !characterRef.current ||
      !rotationCollider.current ||
      !posCollider.current ||
      !velCollider.current
    )
      return;

    // Update the collider and character
    changeCharacterState(
      delta,
      characterRef.current,
      api,
      rotationCollider.current,
      posCollider.current,
      velCollider.current
    );
    characterRef.current.position.set(
      posCollider.current[0],
      posCollider.current[1] - 4.5,
      posCollider.current[2]
    );

    // Update the camera
    if (!quadCollider.current || !orbitControlRef.current) return;
    updateCameraTarget(delta, posCollider.current, quadCollider.current);

    changeAnim();
  });

  return (
    <group ref={characterRef} scale={5}>
      <primitive object={character.scene} />
    </group>
  );
};

export default CharacterModel;
