import { useGLTF, useHelper } from "@react-three/drei";
import * as THREE from "three";
import {
  GroupProps,
  PointLightProps,
  SpotLightProps,
} from "@react-three/fiber";
import { ReactElement, useRef } from "react";

interface SurvivalPackProps extends GroupProps {
  name: string;
  light?: ReactElement<PointLightProps | SpotLightProps, any>;
}

const SurvivalPack = ({ name, light, ...rest }: SurvivalPackProps) => {
  const ref = useRef(null);
  const urlModel = `/survival-pack/${name}.glb`;
  const model = useGLTF(urlModel);

  useHelper(!!ref ? (ref as any) : undefined, THREE.PointLightHelper);

  return (
    <group {...rest}>
      {/* <pointLight
        ref={ref}
        color="#FFA500"
        intensity={8}
        decay={3}
        distance={10}
        position-y={1.5}
      /> */}
      {!!light && light}
      <primitive object={model.scene} />
    </group>
  );
};

export default SurvivalPack;
