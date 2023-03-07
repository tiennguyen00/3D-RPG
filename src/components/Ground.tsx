import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Triplet, useHeightfield, usePlane } from "@react-three/cannon";

type GenerateHeightmapArgs = {
  height: number;
  number: number;
  scale: number;
  width: number;
};

const scale = 1000;

const Heightfield = ({
  elementSize,
  heights,
  position,
  rotation,
}: {
  elementSize: number;
  heights: number[][];
  position: Triplet;
  rotation: Triplet;
}): JSX.Element => {
  const ref = useRef<THREE.BufferGeometry>(null);
  useHeightfield(() => ({
    args: [
      heights,
      {
        elementSize,
      },
    ],
    position,
    rotation,
  }));

  useEffect(() => {
    if (!ref.current) return;
    const dx = elementSize;
    const dy = elementSize;

    /* Create the vertex data from the heights. */
    const vertices = heights.flatMap((row, i) =>
      row.flatMap((z, j) => [i * dx, j * dy, z])
    );

    /* Create the faces. */
    const indices = [];
    for (let i = 0; i < heights.length - 1; i++) {
      for (let j = 0; j < heights[i].length - 1; j++) {
        const stride = heights[i].length;
        const index = i * stride + j;
        indices.push(index + 1, index + stride, index + stride + 1);
        indices.push(index + stride, index + 1, index);
      }
    }

    ref.current.setIndex(indices);
    ref.current.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    ref.current.computeVertexNormals();
    ref.current.computeBoundingBox();
    ref.current.computeBoundingSphere();
  }, [heights]);

  return (
    <mesh
      castShadow
      receiveShadow
      position={[-scale / 2, 0, scale / 2]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <meshPhongMaterial color={"#69b581"} />
      <bufferGeometry ref={ref} />
    </mesh>
  );
};

const Ground: React.FC = () => {
  /* Generates a 2D array using Worley noise. */
  function generateHeightmap({
    width,
    height,
    number,
    scale,
  }: GenerateHeightmapArgs) {
    const data = [];
    const seedPoints: [x: number, y: number][] = [];

    Array.from(Array(number).keys()).map((i) => {
      seedPoints.push([Math.random(), Math.random()]);
    });

    let max = 0;
    for (let i = 0; i < width; i++) {
      const row = [];
      for (let j = 0; j < height; j++) {
        let min = Infinity;
        seedPoints.forEach((p) => {
          const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2;
          if (distance2 < min) {
            min = distance2;
          }
        });
        const d = Math.sqrt(min);
        if (d > max) {
          max = d;
        }
        row.push(d);
      }
      data.push(row);
    }

    /* Normalize and scale. */
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        data[i][j] *= scale / max;
      }
    }

    return data;
  }

  return (
    <mesh receiveShadow>
      <Heightfield
        elementSize={(scale * 1) / 128}
        position={[-scale / 2, 0, scale / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        heights={generateHeightmap({
          height: 128,
          number: 100,
          scale: 40,
          width: 128,
        })}
      />
    </mesh>
  );
};

export { Ground };
