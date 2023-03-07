import { useGLTF, useHelper } from "@react-three/drei";
import * as THREE from "three";
import {
  GroupProps,
  PointLightProps,
  SpotLightProps,
} from "@react-three/fiber";
import { ReactElement, useRef } from "react";
import { useBox, useSphere } from "@react-three/cannon";

interface SurvivalPackProps extends GroupProps {
  name: string;
  light?: ReactElement<PointLightProps | SpotLightProps, any>;
}

const SurvivalPack = ({ name, light, ...rest }: SurvivalPackProps) => {
  const lightRef = useRef(null);
  const urlModel = `/survival-pack/${name}.glb`;
  const model = useGLTF(urlModel);

  useHelper(!!lightRef ? (lightRef as any) : undefined, THREE.PointLightHelper);
  const [ref] = useSphere(() => ({
    position: [0, 50, 0],
    args: [1],
    mass: 10,
    fixedRotation: true,
  }));

  return (
    <group ref={ref as any} {...rest}>
      {/* <pointLight
        ref={ref}
        color="#FFA500"
        intensity={8}
        decay={3}
        distance={10}
        position-y={1.5}
      /> */}
      {!!light && light}
      <primitive position-y={-1} object={model.scene} />
    </group>
  );
};

export default SurvivalPack;
