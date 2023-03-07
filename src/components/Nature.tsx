import React, { useMemo } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useLoader } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";

const NatureCollider = ({ args, models }: { args: any; models: any }) => {
  const pos = new THREE.Vector3(
    Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1),
    0,
    Math.ceil(Math.random() * 200) * (Math.round(Math.random()) ? 1 : -1)
  );
  const [ref, api] = useBox(() => ({
    mass: 150,
    position: [pos.x, pos.y + 100, pos.z],
    args: args,
    fixedRotation: true,
  }));

  const idx: number = Math.floor(Math.random() * 11) + 1;

  return (
    <group ref={ref as any}>
      <primitive
        key={idx}
        position={pos}
        scale={0.1}
        object={
          idx === 1
            ? models.birch3.clone()
            : idx === 2
            ? models.birch4.clone()
            : idx === 3
            ? models.berry1.clone()
            : idx === 4
            ? models.ctree3.clone()
            : idx === 5
            ? models.ctree5.clone()
            : idx === 6
            ? models.grass2.clone()
            : idx === 7
            ? models.grass.clone()
            : idx === 8
            ? models.rock1.clone()
            : idx === 9
            ? models.rock5.clone()
            : idx === 10
            ? models.willow2.clone()
            : idx === 11
            ? models.willow5.clone()
            : models.log.clone()
        }
      />
    </group>
  );
};

const Nature: React.FC = () => {
  const [
    birch3,
    birch4,
    berry1,
    ctree3,
    ctree5,
    grass2,
    grass,
    rock1,
    rock5,
    willow2,
    willow5,
    log,
  ] = useLoader(FBXLoader, [
    "./textures/nature/BirchTree_3.fbx",
    "./textures/nature/BirchTree_4.fbx",
    "./textures/nature/BushBerries_1.fbx",
    "./textures/nature/CommonTree_3.fbx",
    "./textures/nature/CommonTree_5.fbx",
    "./textures/nature/Grass_2.fbx",
    "./textures/nature/Grass.fbx",
    "./textures/nature/Rock_1.fbx",
    "./textures/nature/Rock_5.fbx",
    "./textures/nature/Willow_2.fbx",
    "./textures/nature/Willow_5.fbx",
    "./textures/nature/WoodLog_Moss.fbx",
  ]);

  const models = {
    birch3,
    birch4,
    berry1,
    ctree3,
    ctree5,
    grass2,
    grass,
    rock1,
    rock5,
    willow2,
    willow5,
    log,
  };

  birch3.scale.setScalar(0.4);
  birch3.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  birch4.scale.setScalar(0.3);
  birch4.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  berry1.scale.setScalar(0.08);
  berry1.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  grass2.scale.setScalar(0.05);
  grass2.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  grass.scale.setScalar(0.05);
  grass.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  rock1.scale.setScalar(0.2);
  rock1.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  rock5.scale.setScalar(0.2);
  rock5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  willow2.scale.setScalar(0.4);
  willow2.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  willow5.scale.setScalar(0.5);
  willow5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  log.scale.setScalar(0.1);
  log.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  ctree3.scale.setScalar(0.4);
  ctree3.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });
  ctree5.scale.setScalar(0.4);
  ctree5.traverse((o) => {
    o.castShadow = true;
    o.receiveShadow = true;
  });

  const objects: JSX.Element[] = [];
  useMemo(() => {
    for (let i = 0; i < 100; i++) {
      objects.push(<NatureCollider args={[2, 10, 2]} models={models} />);
    }
  }, []);

  return <group>{objects.map((i) => i)}</group>;
};
export default React.memo(Nature);
