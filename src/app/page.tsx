"use client";

import { Fog, Ground, Light, Nature } from "@/components";
import CharacterModel from "@/components/Character";
import SurvivalPack from "@/components/SurvivalPack";
import { Physics, Debug } from "@react-three/cannon";
import {
  KeyboardControls,
  Loader,
  OrbitControls,
  Sparkles,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { Suspense, useRef } from "react";

export default function Main() {
  const orbitControlRef = useRef(null);

  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
      ]}
    >
      <div className="w-screen h-screen">
        <Loader
          containerStyles={{
            innerWidth: "100%",
            innerHeight: "100%",
            justifyContent: "center",
            alginItems: "center",
          }}
          dataInterpolation={(p) => {
            return `Loading ${p.toFixed(2)}%`;
          }}
          initialState={(active) => active}
        />
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 15, -25],
            frustumCulled: true,
          }}
          shadows
        >
          <axesHelper position-y={3} />
          <Physics gravity={[0, -9.81, 0]}>
            <Debug>
              <color attach="background" args={["#182D09"]} />
              {/* Enviroments */}
              <Fog />
              <Light />
              <Suspense fallback={null}>
                <Ground />
                <Nature />
              </Suspense>
              <Sparkles
                size={6}
                speed={2}
                scale={[100, 50, 100]}
                count={1000}
                position-y={25}
                color="#FFD700"
              />

              {/* Control camera */}
              <OrbitControls ref={orbitControlRef} />

              {/* Load character moodel */}
              <Suspense fallback={null}>
                <CharacterModel />
              </Suspense>

              {/* Survival pack */}
              <SurvivalPack
                name="Bonfire"
                position={[7, 0, 5]}
                light={
                  <pointLight
                    color="#FFA500"
                    intensity={10}
                    decay={3}
                    distance={15}
                    position-y={1.5}
                  />
                }
              />
            </Debug>
          </Physics>
          <Perf position="top-left" />
        </Canvas>
      </div>
    </KeyboardControls>
  );
}
