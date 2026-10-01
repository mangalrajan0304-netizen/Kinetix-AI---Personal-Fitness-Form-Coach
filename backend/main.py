"""
Kinetix AI - Personal Fitness & Form Coach
FastAPI Backend Server

To run this backend independently:
    pip install fastapi uvicorn pydantic numpy
    uvicorn main:app --reload --port 8000
"""

from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import math
import time

app = FastAPI(
    title="Kinetix AI Fitness Form Coach API",
    description="Real-time biomechanical pose analysis, form verification, and rep counting engine.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Data Models -----------------

class Landmark(BaseModel):
    x: float = Field(..., description="Normalized X coordinate [0.0, 1.0]")
    y: float = Field(..., description="Normalized Y coordinate [0.0, 1.0]")
    z: Optional[float] = Field(0.0, description="Normalized Z depth coordinate")
    visibility: Optional[float] = Field(1.0, description="Confidence/visibility score")

class FrameAnalysisRequest(BaseModel):
    exercise: str = Field(..., description="Exercise type: 'squat', 'pushup', or 'plank'")
    landmarks: Dict[str, Landmark] = Field(..., description="Key joint landmarks (e.g. left_hip, left_knee, left_ankle)")
    session_id: Optional[str] = "default"
    timestamp: Optional[float] = None

class FormWarning(BaseModel):
    code: str
    message: str
    severity: str  # "warning" | "error" | "info"

class FrameAnalysisResponse(BaseModel):
    exercise: str
    status: str  # "GOOD_FORM", "WARNING", "BEND_LOWER", "FORM_BREAKDOWN", etc.
    form_message: str
    current_angle: float
    target_angle_range: List[float]
    phase: str  # "eccentric", "concentric", "inflection", "holding", "standing"
    rep_count: int
    form_score: float  # 0 to 100
    calories_burned: float
    warnings: List[FormWarning]
    coach_feedback: Optional[str] = None

class SessionStats(BaseModel):
    session_id: str
    exercise: str
    total_reps: int
    calories_burned: float
    duration_seconds: int
    average_form_score: float
    rep_history: List[Dict[str, Any]]
    feedback_log: List[Dict[str, Any]]

# ----------------- In-Memory Session Storage -----------------

class WorkoutSession:
    def __init__(self, session_id: str = "default"):
        self.session_id = session_id
        self.exercise = "squat"
        self.reps = 0
        self.stage = "up"  # "up" | "down"
        self.start_time = time.time()
        self.calories = 0.0
        self.form_scores: List[float] = []
        self.plank_hold_seconds = 0.0
        self.last_frame_time = time.time()
        self.feedback_log: List[Dict[str, Any]] = []
        self.history: List[Dict[str, Any]] = []

    def reset(self, new_exercise: str = "squat"):
        self.exercise = new_exercise
        self.reps = 0
        self.stage = "up"
        self.start_time = time.time()
        self.calories = 0.0
        self.form_scores = []
        self.plank_hold_seconds = 0.0
        self.last_frame_time = time.time()
        self.feedback_log = []
        self.history = []

sessions: Dict[str, WorkoutSession] = {
    "default": WorkoutSession("default")
}

# ----------------- Biomechanical Math Helpers -----------------

def calculate_angle(p1: Landmark, p2: Landmark, p3: Landmark) -> float:
    """Calculates the internal 2D angle (in degrees) formed at vertex p2."""
    radians = math.atan2(p3.y - p2.y, p3.x - p2.x) - math.atan2(p1.y - p2.y, p1.x - p2.x)
    angle = abs(radians * 180.0 / math.pi)
    if angle > 180.0:
        angle = 360.0 - angle
    return round(angle, 1)

# ----------------- Posture Analysis Rules -----------------

def analyze_squat(session: WorkoutSession, landmarks: Dict[str, Landmark]) -> FrameAnalysisResponse:
    # Require hip, knee, ankle
    hip = landmarks.get("left_hip") or landmarks.get("hip")
    knee = landmarks.get("left_knee") or landmarks.get("knee")
    ankle = landmarks.get("left_ankle") or landmarks.get("ankle")
    shoulder = landmarks.get("left_shoulder") or landmarks.get("shoulder")

    if not hip or not knee or not ankle:
        return FrameAnalysisResponse(
            exercise="squat",
            status="WAITING_FOR_POSE",
            form_message="Position yourself so hips, knees, and ankles are visible",
            current_angle=180.0,
            target_angle_range=[75.0, 95.0],
            phase="standing",
            rep_count=session.reps,
            form_score=95.0,
            calories_burned=round(session.calories, 1),
            warnings=[]
        )

    knee_angle = calculate_angle(hip, knee, ankle)
    warnings: List[FormWarning] = []
    form_message = "Good form! Keep chest upright."
    status_code = "GOOD_FORM"
    form_score = 98.0
    coach_feedback = None

    # Check back/torso angle if shoulder is available
    if shoulder:
        back_angle = calculate_angle(shoulder, hip, knee)
        if back_angle < 65.0:
            warnings.append(FormWarning(
                code="TORSO_LEAN",
                message="Excessive forward torso lean. Keep chest proud.",
                severity="warning"
            ))
            form_score -= 15.0
            form_message = "Keep your chest upright"

    # Knee valgus (inward caving) check if right knee/hip present
    right_knee = landmarks.get("right_knee")
    right_ankle = landmarks.get("right_ankle")
    if right_knee and right_ankle:
        knee_dist = abs(knee.x - right_knee.x)
        ankle_dist = abs(ankle.x - right_ankle.x)
        if knee_dist < (ankle_dist * 0.75):
            warnings.append(FormWarning(
                code="KNEE_VALGUS",
                message="⚠️ Knees caving inward! Push knees out inline with toes.",
                severity="error"
            ))
            form_score -= 20.0
            form_message = "Push knees outward!"
            status_code = "WARNING"

    # Repetition Counter State Machine
    # Standing position: angle > 160 deg
    # Bottom position: angle <= 95 deg
    if knee_angle > 155.0:
        if session.stage == "down":
            # Rep completed on ascending back to top
            session.reps += 1
            session.stage = "up"
            session.calories += 0.35  # Approx 0.35 kcal per squat rep
            score = max(50.0, min(100.0, form_score))
            session.form_scores.append(score)
            coach_feedback = f"Great rep #{session.reps}! Strong drive through heels."
            session.feedback_log.append({
                "timestamp": round(time.time() - session.start_time, 1),
                "rep": session.reps,
                "message": coach_feedback,
                "type": "success"
            })
        phase = "standing"
        if status_code == "GOOD_FORM":
            form_message = "Ready. Initiate squat with hips back."
    elif knee_angle <= 95.0:
        session.stage = "down"
        phase = "inflection"
        if knee_angle < 60.0:
            warnings.append(FormWarning(
                code="DEEP_FLEXION",
                message="Deep squat detected. Maintain hamstring tension.",
                severity="info"
            ))
        form_message = "Excellent depth! Drive up."
    elif 95.0 < knee_angle < 135.0:
        if session.stage == "up":
            phase = "eccentric"
            form_message = "Descending. Keep knees tracked over toes."
        else:
            phase = "concentric"
            form_message = "Drive up through mid-foot and squeeze glutes."
    else:
        phase = "standing"

    avg_score = (sum(session.form_scores) / len(session.form_scores)) if session.form_scores else form_score

    return FrameAnalysisResponse(
        exercise="squat",
        status=status_code,
        form_message=form_message,
        current_angle=knee_angle,
        target_angle_range=[75.0, 95.0],
        phase=phase,
        rep_count=session.reps,
        form_score=round(avg_score, 1),
        calories_burned=round(session.calories, 1),
        warnings=warnings,
        coach_feedback=coach_feedback
    )

def analyze_pushup(session: WorkoutSession, landmarks: Dict[str, Landmark]) -> FrameAnalysisResponse:
    shoulder = landmarks.get("left_shoulder") or landmarks.get("shoulder")
    elbow = landmarks.get("left_elbow") or landmarks.get("elbow")
    wrist = landmarks.get("left_wrist") or landmarks.get("wrist")
    hip = landmarks.get("left_hip") or landmarks.get("hip")
    ankle = landmarks.get("left_ankle") or landmarks.get("ankle")

    if not shoulder or not elbow or not wrist:
        return FrameAnalysisResponse(
            exercise="pushup",
            status="WAITING_FOR_POSE",
            form_message="Position camera side-on showing shoulders, elbows, and wrists",
            current_angle=180.0,
            target_angle_range=[80.0, 95.0],
            phase="plank",
            rep_count=session.reps,
            form_score=95.0,
            calories_burned=round(session.calories, 1),
            warnings=[]
        )

    elbow_angle = calculate_angle(shoulder, elbow, wrist)
    warnings: List[FormWarning] = []
    form_message = "Solid plank position. Maintain steady pace."
    status_code = "GOOD_FORM"
    form_score = 98.0
    coach_feedback = None

    # Check spine / hip alignment: shoulder-hip-ankle line
    if hip and ankle:
        body_line_angle = calculate_angle(shoulder, hip, ankle)
        if body_line_angle < 155.0:
            warnings.append(FormWarning(
                code="HIP_SAG",
                message="⚠️ Hips sagging! Engage core and glutes to keep spine straight.",
                severity="error"
            ))
            form_score -= 20.0
            form_message = "Lift hips up, engage core!"
            status_code = "WARNING"
        elif body_line_angle > 195.0:
            warnings.append(FormWarning(
                code="HIP_PIKE",
                message="⚠️ Hips piked too high! Lower hips to flat plank line.",
                severity="warning"
            ))
            form_score -= 15.0
            form_message = "Lower hips into straight line"

    # Push-up Repetition Counter
    # Top lockout: elbow_angle > 155 deg
    # Bottom chest touch: elbow_angle <= 90 deg
    if elbow_angle > 155.0:
        if session.stage == "down":
            session.reps += 1
            session.stage = "up"
            session.calories += 0.28
            score = max(50.0, min(100.0, form_score))
            session.form_scores.append(score)
            coach_feedback = f"Rep #{session.reps} completed! Full elbow lockout."
            session.feedback_log.append({
                "timestamp": round(time.time() - session.start_time, 1),
                "rep": session.reps,
                "message": coach_feedback,
                "type": "success"
            })
        phase = "top_plank"
        if status_code == "GOOD_FORM":
            form_message = "Top lockout. Begin controlled descent."
    elif elbow_angle <= 90.0:
        session.stage = "down"
        phase = "chest_lowered"
        form_message = "Chest at depth! Press the floor away."
    else:
        phase = "eccentric" if session.stage == "up" else "concentric"
        form_message = "Lowering chest with controlled tempo" if session.stage == "up" else "Pressing back up"

    avg_score = (sum(session.form_scores) / len(session.form_scores)) if session.form_scores else form_score

    return FrameAnalysisResponse(
        exercise="pushup",
        status=status_code,
        form_message=form_message,
        current_angle=elbow_angle,
        target_angle_range=[80.0, 95.0],
        phase=phase,
        rep_count=session.reps,
        form_score=round(avg_score, 1),
        calories_burned=round(session.calories, 1),
        warnings=warnings,
        coach_feedback=coach_feedback
    )

def analyze_plank(session: WorkoutSession, landmarks: Dict[str, Landmark]) -> FrameAnalysisResponse:
    shoulder = landmarks.get("left_shoulder") or landmarks.get("shoulder")
    hip = landmarks.get("left_hip") or landmarks.get("hip")
    ankle = landmarks.get("left_ankle") or landmarks.get("ankle")

    current_time = time.time()
    dt = min(1.0, current_time - session.last_frame_time)
    session.last_frame_time = current_time

    if not shoulder or not hip or not ankle:
        return FrameAnalysisResponse(
            exercise="plank",
            status="WAITING_FOR_POSE",
            form_message="Position camera side-on to view full plank line",
            current_angle=180.0,
            target_angle_range=[168.0, 182.0],
            phase="holding",
            rep_count=int(session.plank_hold_seconds),
            form_score=95.0,
            calories_burned=round(session.calories, 1),
            warnings=[]
        )

    spine_angle = calculate_angle(shoulder, hip, ankle)
    warnings: List[FormWarning] = []
    form_score = 98.0
    status_code = "GOOD_FORM"
    form_message = "Optimal spinal alignment! Hold steady."
    coach_feedback = None

    if spine_angle < 165.0:
        warnings.append(FormWarning(
            code="HIP_SAG",
            message="⚠️ Hips drooping down! Squeeze abdominals and glutes.",
            severity="error"
        ))
        form_score -= 25.0
        status_code = "WARNING"
        form_message = "Tuck pelvis and lift hips!"
    elif spine_angle > 192.0:
        warnings.append(FormWarning(
            code="HIP_PIKE",
            message="⚠️ Butt is in the air. Flatten into straight horizontal line.",
            severity="warning"
        ))
        form_score -= 15.0
        status_code = "WARNING"
        form_message = "Level out your hips with shoulders."
    else:
        # Good form hold accumulation
        session.plank_hold_seconds += dt
        session.calories += 0.07 * dt
        # Periodic verbal coaching
        hold_int = int(session.plank_hold_seconds)
        if hold_int > 0 and hold_int % 10 == 0 and hold_int != session.reps:
            session.reps = hold_int
            coach_feedback = f"{hold_int} seconds reached! Strong core lock."
            session.feedback_log.append({
                "timestamp": round(time.time() - session.start_time, 1),
                "rep": hold_int,
                "message": coach_feedback,
                "type": "info"
            })

    session.reps = int(session.plank_hold_seconds)
    session.form_scores.append(max(50.0, form_score))
    avg_score = sum(session.form_scores) / len(session.form_scores)

    return FrameAnalysisResponse(
        exercise="plank",
        status=status_code,
        form_message=form_message,
        current_angle=spine_angle,
        target_angle_range=[170.0, 180.0],
        phase="holding",
        rep_count=session.reps,
        form_score=round(avg_score, 1),
        calories_burned=round(session.calories, 1),
        warnings=warnings,
        coach_feedback=coach_feedback
    )

# ----------------- API Endpoints -----------------

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Kinetix AI Fitness Form Coach API",
        "supported_exercises": ["squat", "pushup", "plank"],
        "endpoints": {
            "analyze_frame": "POST /api/analyze-frame",
            "session_stats": "GET /api/session-stats",
            "reset_session": "POST /api/reset-session"
        }
    }

@app.post("/api/analyze-frame", response_model=FrameAnalysisResponse)
def analyze_frame(payload: FrameAnalysisRequest):
    """
    Receives landmark coordinates or frame data, processes posture rules,
    and returns form status, angle measurements, warnings, and updated rep counts.
    """
    session = sessions.setdefault(payload.session_id or "default", WorkoutSession(payload.session_id or "default"))
    exercise = payload.exercise.lower()

    if exercise != session.exercise:
        session.reset(new_exercise=exercise)

    if exercise == "squat":
        return analyze_squat(session, payload.landmarks)
    elif exercise == "pushup":
        return analyze_pushup(session, payload.landmarks)
    elif exercise == "plank":
        return analyze_plank(session, payload.landmarks)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported exercise '{exercise}'. Choose 'squat', 'pushup', or 'plank'."
        )

@app.get("/api/session-stats", response_model=SessionStats)
def get_session_stats(session_id: str = "default"):
    """
    Fetches summary metrics and history for the current workout session.
    """
    session = sessions.get(session_id)
    if not session:
        session = WorkoutSession(session_id)
        sessions[session_id] = session

    duration = int(time.time() - session.start_time)
    avg_score = (sum(session.form_scores) / len(session.form_scores)) if session.form_scores else 95.0

    return SessionStats(
        session_id=session.session_id,
        exercise=session.exercise,
        total_reps=session.reps,
        calories_burned=round(session.calories, 1),
        duration_seconds=duration,
        average_form_score=round(avg_score, 1),
        rep_history=session.history,
        feedback_log=session.feedback_log[-20:]
    )

@app.post("/api/reset-session")
def reset_session(session_id: str = "default", exercise: str = "squat"):
    """
    Resets workout counters and initializes a fresh session.
    """
    session = sessions.setdefault(session_id, WorkoutSession(session_id))
    session.reset(new_exercise=exercise.lower())
    return {
        "status": "success",
        "message": f"Session '{session_id}' reset for exercise '{exercise}'",
        "session_id": session_id,
        "exercise": exercise
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
