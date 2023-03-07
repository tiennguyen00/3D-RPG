import { useKeyboardControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ActionName =
  | "CharacterArmature|Death"
  | "CharacterArmature|Gun_Shoot"
  | "CharacterArmature|HitRecieve"
  | "CharacterArmature|HitRecieve_2"
  | "CharacterArmature|Idle"
  | "CharacterArmature|Idle_Gun"
  | "CharacterArmature|Idle_Gun_Pointing"
  | "CharacterArmature|Idle_Gun_Shoot"
  | "CharacterArmature|Idle_Neutral"
  | "CharacterArmature|Interact"
  | "CharacterArmature|Kick_Left"
  | "CharacterArmature|Kick_Right"
  | "CharacterArmature|Punch_Left"
  | "CharacterArmature|Punch_Right"
  | "CharacterArmature|Roll"
  | "CharacterArmature|Run"
  | "CharacterArmature|Run_Back"
  | "CharacterArmature|Run_Left"
  | "CharacterArmature|Run_Right"
  | "CharacterArmature|Run_Shoot"
  | "CharacterArmature|Sword_Slash"
  | "CharacterArmature|Walk"
  | "CharacterArmature|Wave";

export type Animations = {
  [x in ActionName]: THREE.AnimationAction | null;
};

const useAnimation = (actions: Animations, names: ActionName[]) => {
  const [, getKeys] = useKeyboardControls();
  let prevAction: THREE.AnimationAction | null,
    currAction: THREE.AnimationAction | null =
      actions["CharacterArmature|Idle"];

  useEffect(() => {
    actions["CharacterArmature|Idle"]?.play();
  }, []);

  const changeAnim = () => {
    const { backward, leftward, rightward, forward, jump, run } = getKeys();
    prevAction = currAction;

    if (forward) {
      if (run) {
        currAction = actions["CharacterArmature|Run"];
      } else {
        currAction = actions["CharacterArmature|Walk"];
      }
    } else if (leftward) {
      if (run) {
        currAction = actions["CharacterArmature|Run_Left"];
      } else {
        currAction = actions["CharacterArmature|Walk"];
      }
    } else if (rightward) {
      if (run) {
        currAction = actions["CharacterArmature|Run_Right"];
      } else {
        currAction = actions["CharacterArmature|Walk"];
      }
    } else if (backward) {
      if (run) {
        currAction = actions["CharacterArmature|Run_Back"];
      } else {
        currAction = actions["CharacterArmature|Walk"];
      }
    } else {
      currAction = actions["CharacterArmature|Idle"];
    }
    // else if (jump) {
    //   currAction.current = animations["Wave"].clip;
    // } else {
    //   currAction.current = animations["idle"].clip;
    // }

    if (prevAction !== currAction) {
      prevAction!.fadeOut(0.2);

      currAction!.reset().play().fadeIn(0.2);
    } else {
      currAction!.play();
    }
  };

  return {
    changeAnim,
  };
};
export default useAnimation;
