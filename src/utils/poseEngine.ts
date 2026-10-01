import { ExerciseType, JointLandmarks, LandmarkPoint } from '../types/workout';

export type SimulatedErrorType = 'none' | 'knee_valgus' | 'torso_lean' | 'hip_sag' | 'hip_pike' | 'shallow_depth';

export function calculateJointAngle(p1: LandmarkPoint, p2: LandmarkPoint, p3: LandmarkPoint): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle * 10) / 10;
}

/**
 * Generates natural kinematic landmark positions for simulated workout streams
 */
export function generateSimulatedPose(
  exercise: ExerciseType,
  cycleTimeSec: number,
  activeError: SimulatedErrorType = 'none'
): { landmarks: JointLandmarks; phase: string; rawAngle: number } {
  // Period of 1 complete repetition in seconds
  const repDuration = exercise === 'plank' ? 10.0 : 3.4;
  const progress = (cycleTimeSec % repDuration) / repDuration; // 0.0 to 1.0

  // Sinusoidal movement: 0 (top/start) -> 1 (inflection bottom) -> 0 (top/start)
  // Using smooth cosine curve
  const motionPhase = 0.5 * (1 - Math.cos(progress * 2 * Math.PI));

  const landmarks: JointLandmarks = {};
  let phase = 'ready';
  let rawAngle = 180;

  if (exercise === 'squat') {
    // Standing: depthFactor = 0, Deep squat: depthFactor = 1
    let depthFactor = motionPhase;
    if (activeError === 'shallow_depth') {
      depthFactor *= 0.55; // Stop high
    }

    // Determine phase name
    if (progress < 0.45) phase = 'eccentric'; // Lowering
    else if (progress >= 0.45 && progress <= 0.55) phase = 'inflection'; // Bottom depth
    else phase = 'concentric'; // Pressing up

    const headY = 0.22 + depthFactor * 0.19;
    const shoulderY = 0.32 + depthFactor * 0.20;
    const hipY = 0.52 + depthFactor * 0.24;
    const kneeY = 0.72 + depthFactor * 0.06;
    const ankleY = 0.90;

    // Torso lean modification if error is active
    let hipX = 0.48 - depthFactor * 0.06;
    let shoulderX = 0.50;
    if (activeError === 'torso_lean') {
      shoulderX = 0.58 + depthFactor * 0.08; // Torso tilted excessively forward
    }

    // Knee tracking
    let leftKneeX = 0.43;
    let rightKneeX = 0.57;
    const leftAnkleX = 0.42;
    const rightAnkleX = 0.58;

    if (activeError === 'knee_valgus' && depthFactor > 0.4) {
      // Knees cave inward
      leftKneeX = 0.48;
      rightKneeX = 0.52;
    }

    landmarks['left_shoulder'] = { x: shoulderX - 0.06, y: shoulderY, visibility: 0.99 };
    landmarks['right_shoulder'] = { x: shoulderX + 0.06, y: shoulderY, visibility: 0.99 };
    landmarks['left_elbow'] = { x: shoulderX - 0.10, y: shoulderY + 0.12, visibility: 0.95 };
    landmarks['right_elbow'] = { x: shoulderX + 0.10, y: shoulderY + 0.12, visibility: 0.95 };
    landmarks['left_wrist'] = { x: shoulderX - 0.04, y: shoulderY + 0.08, visibility: 0.95 };
    landmarks['right_wrist'] = { x: shoulderX + 0.04, y: shoulderY + 0.08, visibility: 0.95 };

    landmarks['left_hip'] = { x: hipX, y: hipY, visibility: 0.99 };
    landmarks['right_hip'] = { x: hipX + 0.08, y: hipY, visibility: 0.99 };

    landmarks['left_knee'] = { x: leftKneeX, y: kneeY, visibility: 0.99 };
    landmarks['right_knee'] = { x: rightKneeX, y: kneeY, visibility: 0.99 };

    landmarks['left_ankle'] = { x: leftAnkleX, y: ankleY, visibility: 0.99 };
    landmarks['right_ankle'] = { x: rightAnkleX, y: ankleY, visibility: 0.99 };

    // Head
    landmarks['nose'] = { x: shoulderX, y: headY, visibility: 0.99 };

    rawAngle = calculateJointAngle(landmarks['left_hip'], landmarks['left_knee'], landmarks['left_ankle']);
  } else if (exercise === 'pushup') {
    // Side profile push-up
    const depthFactor = motionPhase;
    if (progress < 0.45) phase = 'eccentric';
    else if (progress >= 0.45 && progress <= 0.55) phase = 'chest_depth';
    else phase = 'concentric';

    // Baseline straight plank: Shoulder (0.35, 0.52), Hip (0.55, 0.52), Ankle (0.80, 0.72)
    // As chest lowers: Shoulder and Hip drop
    const shoulderX = 0.35;
    const shoulderY = 0.52 + depthFactor * 0.18;
    const elbowX = 0.30 - depthFactor * 0.08;
    const elbowY = 0.56 + depthFactor * 0.08;
    const wristX = 0.35;
    const wristY = 0.76;

    let hipY = 0.55 + depthFactor * 0.14;
    const hipX = 0.56;
    const ankleX = 0.82;
    const ankleY = 0.76;

    if (activeError === 'hip_sag') {
      hipY += 0.12; // Sagging pelvis
    } else if (activeError === 'hip_pike') {
      hipY -= 0.12; // Piked butt
    }

    landmarks['left_shoulder'] = { x: shoulderX, y: shoulderY, visibility: 0.99 };
    landmarks['left_elbow'] = { x: elbowX, y: elbowY, visibility: 0.99 };
    landmarks['left_wrist'] = { x: wristX, y: wristY, visibility: 0.99 };
    landmarks['left_hip'] = { x: hipX, y: hipY, visibility: 0.99 };
    landmarks['left_knee'] = { x: (hipX + ankleX) / 2, y: (hipY + ankleY) / 2, visibility: 0.99 };
    landmarks['left_ankle'] = { x: ankleX, y: ankleY, visibility: 0.99 };
    landmarks['nose'] = { x: shoulderX - 0.08, y: shoulderY - 0.05, visibility: 0.95 };

    rawAngle = calculateJointAngle(landmarks['left_shoulder'], landmarks['left_elbow'], landmarks['left_wrist']);
  } else if (exercise === 'plank') {
    // Isometric hold
    phase = 'holding';
    const subtleBreath = Math.sin(cycleTimeSec * 2) * 0.008;

    const shoulderX = 0.32;
    const shoulderY = 0.60 + subtleBreath;
    const elbowX = 0.32;
    const elbowY = 0.76;
    const wristX = 0.38;
    const wristY = 0.76;

    let hipY = 0.62 + subtleBreath * 0.8;
    const hipX = 0.56;
    const ankleX = 0.82;
    const ankleY = 0.76;

    if (activeError === 'hip_sag') {
      hipY += 0.10;
    } else if (activeError === 'hip_pike') {
      hipY -= 0.10;
    }

    landmarks['left_shoulder'] = { x: shoulderX, y: shoulderY, visibility: 0.99 };
    landmarks['left_elbow'] = { x: elbowX, y: elbowY, visibility: 0.99 };
    landmarks['left_wrist'] = { x: wristX, y: wristY, visibility: 0.99 };
    landmarks['left_hip'] = { x: hipX, y: hipY, visibility: 0.99 };
    landmarks['left_knee'] = { x: (hipX + ankleX) / 2, y: (hipY + ankleY) / 2, visibility: 0.99 };
    landmarks['left_ankle'] = { x: ankleX, y: ankleY, visibility: 0.99 };
    landmarks['nose'] = { x: shoulderX - 0.07, y: shoulderY - 0.04, visibility: 0.95 };

    rawAngle = calculateJointAngle(landmarks['left_shoulder'], landmarks['left_hip'], landmarks['left_ankle']);
  }

  return { landmarks, phase, rawAngle };
}
