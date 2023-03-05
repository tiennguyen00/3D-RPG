import { useGLTF } from "@react-three/drei";
import React, { useMemo } from "react";
import { Mesh } from "three";

const CharacterModel = () => {
  const character = useGLTF("/men-pack/Adventurer.glb");

  useMemo(() => {
    character.scene.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
  }, []);

  return (
    <group scale={5}>
      <primitive object={character.scene} />
    </group>
  );
};

export default CharacterModel;
