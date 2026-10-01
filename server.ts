import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory workout session state
interface WorkoutSession {
  sessionId: string;
  exercise: 'squat' | 'pushup' | 'plank';
  reps: number;
  stage: 'up' | 'down';
  startTime: number;
  calories: number;
  formScores: number[];
  plankHoldSeconds: number;
  lastFrameTime: number;
  feedbackLog: Array<{
    id: string;
    timestamp: number;
    rep?: number;
    message: string;
    type: 'success' | 'warning' | 'info' | 'error';
  }>;
  repHistory: Array<{
    repNumber: number;
    time: number;
    formScore: number;
    minAngle: number;
    feedback: string;
  }>;
}

const sessions: Record<string, WorkoutSession> = {};

function getOrCreateSession(sessionId: string = 'default', exercise: 'squat' | 'pushup' | 'plank' = 'squat'): WorkoutSession {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      sessionId,
      exercise,
      reps: 0,
      stage: 'up',
      startTime: Date.now(),
      calories: 0,
      formScores: [],
      plankHoldSeconds: 0,
      lastFrameTime: Date.now(),
      feedbackLog: [
        {
          id: 'init-1',
          timestamp: 0,
          message: `Kinetix AI Coach ready. Select your workout and step into frame.`,
          type: 'info',
        }
      ],
      repHistory: [],
    };
  }
  return sessions[sessionId];
}

interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

function calculateAngle(p1: Landmark, p2: Landmark, p3: Landmark): number {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) {
    angle = 360.0 - angle;
  }
  return Math.round(angle * 10) / 10;
}

// REST Endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    engine: 'Kinetix AI Biomechanical Analysis Engine',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/exercises', (_req: Request, res: Response) => {
  res.json([
    {
      id: 'squat',
      name: 'Squats',
      category: 'Lower Body & Core',
      targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
      keyAngle: 'Knee Flexion',
      targetRange: '75° - 90°',
      lockoutAngle: '> 160°',
      calorieRate: '0.32 kcal / rep',
      cues: [
        'Chest upright and proud throughout the movement',
        'Push hips back as if sitting into an ergonomic chair',
        'Drive knees slightly outward inline with toes',
        'Break parallel (knee angle <= 90°) for full rep credit',
        'Drive up firmly through heels and mid-foot'
      ],
      warnings: [
        'Knees caving inward (valgus collapse)',
        'Excessive forward torso fold (chest dropping)',
        'Shallow depth (not reaching 90°)'
      ]
    },
    {
      id: 'pushup',
      name: 'Push-ups',
      category: 'Upper Body & Core',
      targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps', 'Core'],
      keyAngle: 'Elbow Flexion',
      targetRange: '80° - 90°',
      lockoutAngle: '> 160°',
      calorieRate: '0.28 kcal / rep',
      cues: [
        'Maintain a continuous straight plank line from head to heels',
        'Keep elbows tucked at roughly 45° to torso, not flared 90°',
        'Lower chest until elbows form a 90° right angle',
        'Push floor away with full extension at the top'
      ],
      warnings: [
        'Hips sagging downward (hyperextending lumbar spine)',
        'Hips piked up into tent shape',
        'Incomplete lockout or bouncing off floor'
      ]
    },
    {
      id: 'plank',
      name: 'Planks',
      category: 'Isometric Core Stability',
      targetMuscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Obliques', 'Glutes'],
      keyAngle: 'Spine Alignment',
      targetRange: '170° - 180°',
      lockoutAngle: 'Holding',
      calorieRate: '4.2 kcal / min',
      cues: [
        'Elbows stacked directly beneath shoulders',
        'Gaze down between hands to maintain neutral cervical spine',
        'Draw belly button inward toward spine',
        'Squeeze glutes and thighs tight like a steel rod'
      ],
      warnings: [
        'Sagging pelvis putting strain on lower back',
        'Elevated hips unloading core activation',
        'Craning head upward'
      ]
    }
  ]);
});

app.post('/api/analyze-frame', (req: Request, res: Response) => {
  const { exercise = 'squat', landmarks = {}, sessionId = 'default' } = req.body;
  const session = getOrCreateSession(sessionId, exercise as 'squat' | 'pushup' | 'plank');

  if (session.exercise !== exercise) {
    session.exercise = exercise;
    session.reps = 0;
    session.stage = 'up';
    session.startTime = Date.now();
    session.calories = 0;
    session.formScores = [];
    session.plankHoldSeconds = 0;
    session.lastFrameTime = Date.now();
    session.feedbackLog = [
      {
        id: `switch-${Date.now()}`,
        timestamp: 0,
        message: `Switched exercise to ${exercise.toUpperCase()}. Ready for tracking.`,
        type: 'info'
      }
    ];
  }

  const warnings: Array<{ code: string; message: string; severity: 'warning' | 'error' | 'info' }> = [];
  let currentAngle = 180;
  let targetAngleRange = [75, 95];
  let phase = 'ready';
  let formMessage = 'Maintaining good form.';
  let statusCode = 'GOOD_FORM';
  let formScore = 98;
  let coachFeedback: string | null = null;

  const now = Date.now();
  const sessionDurationSec = Math.floor((now - session.startTime) / 1000);

  if (exercise === 'squat') {
    const hip = landmarks.left_hip || landmarks.hip;
    const knee = landmarks.left_knee || landmarks.knee;
    const ankle = landmarks.left_ankle || landmarks.ankle;
    const shoulder = landmarks.left_shoulder || landmarks.shoulder;
    const rightKnee = landmarks.right_knee;
    const rightAnkle = landmarks.right_ankle;

    if (hip && knee && ankle) {
      currentAngle = calculateAngle(hip, knee, ankle);
      targetAngleRange = [75, 95];

      // Check torso lean
      if (shoulder) {
        const torsoAngle = calculateAngle(shoulder, hip, knee);
        if (torsoAngle < 65) {
          warnings.push({
            code: 'TORSO_LEAN',
            message: '⚠️ Chest dropping forward! Keep torso proud and eyes forward.',
            severity: 'warning'
          });
          formScore -= 15;
          formMessage = 'Keep your chest upright!';
          statusCode = 'WARNING';
        }
      }

      // Check knee valgus
      if (rightKnee && rightAnkle) {
        const kneeDist = Math.abs(knee.x - rightKnee.x);
        const ankleDist = Math.abs(ankle.x - rightAnkle.x);
        if (kneeDist < ankleDist * 0.72) {
          warnings.push({
            code: 'KNEE_VALGUS',
            message: '⚠️ Knees caving inward! Push knees outward over mid-toes.',
            severity: 'error'
          });
          formScore -= 20;
          formMessage = 'Push knees out inline with toes!';
          statusCode = 'WARNING';
        }
      }

      // Repetition logic
      if (currentAngle > 155) {
        if (session.stage === 'down') {
          session.reps += 1;
          session.stage = 'up';
          session.calories += 0.35;
          const repScore = Math.max(50, Math.min(100, formScore));
          session.formScores.push(repScore);
          coachFeedback = `Rep #${session.reps} completed! Excellent power through the heels.`;
          session.feedbackLog.unshift({
            id: `rep-${session.reps}-${now}`,
            timestamp: sessionDurationSec,
            rep: session.reps,
            message: coachFeedback,
            type: 'success'
          });
          session.repHistory.unshift({
            repNumber: session.reps,
            time: sessionDurationSec,
            formScore: repScore,
            minAngle: 82,
            feedback: 'Clean descent & lockout'
          });
        }
        phase = 'standing';
        if (statusCode === 'GOOD_FORM') {
          formMessage = 'Top position. Begin controlled descent.';
        }
      } else if (currentAngle <= 95) {
        session.stage = 'down';
        phase = 'inflection';
        if (currentAngle < 60) {
          warnings.push({
            code: 'DEEP_FLEXION',
            message: 'Deep squat. Maintain core tension.',
            severity: 'info'
          });
        }
        formMessage = 'Target depth reached! Drive straight up.';
      } else {
        phase = session.stage === 'up' ? 'eccentric' : 'concentric';
        formMessage = session.stage === 'up' ? 'Lowering hips smoothly...' : 'Pushing through floor...';
      }
    } else {
      statusCode = 'WAITING_FOR_POSE';
      formMessage = 'Position body so hip, knee, and ankle joints are visible.';
    }
  } else if (exercise === 'pushup') {
    const shoulder = landmarks.left_shoulder || landmarks.shoulder;
    const elbow = landmarks.left_elbow || landmarks.elbow;
    const wrist = landmarks.left_wrist || landmarks.wrist;
    const hip = landmarks.left_hip || landmarks.hip;
    const ankle = landmarks.left_ankle || landmarks.ankle;

    targetAngleRange = [80, 95];

    if (shoulder && elbow && wrist) {
      currentAngle = calculateAngle(shoulder, elbow, wrist);

      // Spine line
      if (hip && ankle) {
        const spineAngle = calculateAngle(shoulder, hip, ankle);
        if (spineAngle < 155) {
          warnings.push({
            code: 'HIP_SAG',
            message: '⚠️ Hips sagging! Engage glutes and core to keep spine straight.',
            severity: 'error'
          });
          formScore -= 20;
          formMessage = 'Hips are sagging! Squeeze core.';
          statusCode = 'WARNING';
        } else if (spineAngle > 195) {
          warnings.push({
            code: 'HIP_PIKE',
            message: '⚠️ Butt in the air! Flatten body line with shoulders.',
            severity: 'warning'
          });
          formScore -= 15;
          formMessage = 'Lower hips into straight line.';
          statusCode = 'WARNING';
        }
      }

      // Rep logic
      if (currentAngle > 155) {
        if (session.stage === 'down') {
          session.reps += 1;
          session.stage = 'up';
          session.calories += 0.28;
          const repScore = Math.max(50, Math.min(100, formScore));
          session.formScores.push(repScore);
          coachFeedback = `Rep #${session.reps} logged! Solid full lockout.`;
          session.feedbackLog.unshift({
            id: `rep-${session.reps}-${now}`,
            timestamp: sessionDurationSec,
            rep: session.reps,
            message: coachFeedback,
            type: 'success'
          });
          session.repHistory.unshift({
            repNumber: session.reps,
            time: sessionDurationSec,
            formScore: repScore,
            minAngle: 86,
            feedback: 'Crisp elbow lockout'
          });
        }
        phase = 'top_lockout';
        if (statusCode === 'GOOD_FORM') {
          formMessage = 'Plank lockout. Lower chest smoothly.';
        }
      } else if (currentAngle <= 90) {
        session.stage = 'down';
        phase = 'chest_depth';
        formMessage = 'Full depth achieved! Press explosively.';
      } else {
        phase = session.stage === 'up' ? 'eccentric' : 'concentric';
        formMessage = session.stage === 'up' ? 'Descending chest toward deck...' : 'Pressing floor away...';
      }
    } else {
      statusCode = 'WAITING_FOR_POSE';
      formMessage = 'Position camera side-on to track shoulder, elbow, and wrist.';
    }
  } else if (exercise === 'plank') {
    const shoulder = landmarks.left_shoulder || landmarks.shoulder;
    const hip = landmarks.left_hip || landmarks.hip;
    const ankle = landmarks.left_ankle || landmarks.ankle;
    targetAngleRange = [170, 180];

    const dt = Math.min(1.0, (now - session.lastFrameTime) / 1000);
    session.lastFrameTime = now;

    if (shoulder && hip && ankle) {
      currentAngle = calculateAngle(shoulder, hip, ankle);

      if (currentAngle < 165) {
        warnings.push({
          code: 'HIP_SAG',
          message: '⚠️ Hips dipping down! Tuck pelvis and engage abdominals.',
          severity: 'error'
        });
        formScore -= 25;
        statusCode = 'WARNING';
        formMessage = 'Pelvis sagging! Pull navel to spine.';
      } else if (currentAngle > 192) {
        warnings.push({
          code: 'HIP_PIKE',
          message: '⚠️ Hips piked upwards! Level shoulders and hips.',
          severity: 'warning'
        });
        formScore -= 15;
        statusCode = 'WARNING';
        formMessage = 'Level out hips with torso.';
      } else {
        session.plankHoldSeconds += dt;
        session.calories += 0.07 * dt;
        phase = 'holding';
        formMessage = 'Steel spine alignment! Maintain steady breathing.';

        const holdInt = Math.floor(session.plankHoldSeconds);
        if (holdInt > 0 && holdInt % 15 === 0 && holdInt !== session.reps) {
          session.reps = holdInt;
          coachFeedback = `${holdInt} seconds milestone reached! Flawless core stability.`;
          session.feedbackLog.unshift({
            id: `plank-${holdInt}-${now}`,
            timestamp: sessionDurationSec,
            rep: holdInt,
            message: coachFeedback,
            type: 'info'
          });
        }
      }

      session.reps = Math.floor(session.plankHoldSeconds);
    } else {
      statusCode = 'WAITING_FOR_POSE';
      formMessage = 'Position camera to view full torso line from head to ankles.';
    }
  }

  const avgScore = session.formScores.length > 0
    ? session.formScores.reduce((a, b) => a + b, 0) / session.formScores.length
    : formScore;

  res.json({
    exercise,
    status: statusCode,
    form_message: formMessage,
    current_angle: currentAngle,
    target_angle_range: targetAngleRange,
    phase,
    rep_count: session.reps,
    form_score: Math.round(avgScore * 10) / 10,
    calories_burned: Math.round(session.calories * 10) / 10,
    warnings,
    coach_feedback: coachFeedback,
  });
});

app.get('/api/session-stats', (req: Request, res: Response) => {
  const sessionId = (req.query.session_id as string) || 'default';
  const session = getOrCreateSession(sessionId);
  const durationSec = Math.floor((Date.now() - session.startTime) / 1000);
  const avgScore = session.formScores.length > 0
    ? session.formScores.reduce((a, b) => a + b, 0) / session.formScores.length
    : 96;

  res.json({
    session_id: session.sessionId,
    exercise: session.exercise,
    total_reps: session.reps,
    calories_burned: Math.round(session.calories * 10) / 10,
    duration_seconds: durationSec,
    average_form_score: Math.round(avgScore * 10) / 10,
    rep_history: session.repHistory,
    feedback_log: session.feedbackLog.slice(0, 30),
  });
});

app.post('/api/reset-session', (req: Request, res: Response) => {
  const { session_id = 'default', exercise = 'squat' } = req.body;
  const session = getOrCreateSession(session_id, exercise);
  session.exercise = exercise;
  session.reps = 0;
  session.stage = 'up';
  session.startTime = Date.now();
  session.calories = 0;
  session.formScores = [];
  session.plankHoldSeconds = 0;
  session.lastFrameTime = Date.now();
  session.repHistory = [];
  session.feedbackLog = [
    {
      id: `reset-${Date.now()}`,
      timestamp: 0,
      message: `Session reset for ${exercise.toUpperCase()}. Ready to track.`,
      type: 'info'
    }
  ];

  res.json({
    status: 'success',
    message: `Session '${session_id}' reset for exercise '${exercise}'`,
    session_id,
    exercise,
    total_reps: 0,
    calories_burned: 0,
  });
});

app.get('/api/fastapi-code', (_req: Request, res: Response) => {
  try {
    const fastApiPath = path.join(__dirname, 'backend', 'main.py');
    if (fs.existsSync(fastApiPath)) {
      const code = fs.readFileSync(fastApiPath, 'utf-8');
      res.json({ code });
      return;
    }
    res.json({ code: '# FastAPI file not found' });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to read FastAPI code' });
  }
});

// Production / Dev handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[Kinetix AI] Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
