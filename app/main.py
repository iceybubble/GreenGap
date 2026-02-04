from fastapi import FastAPI
from app.data.simulator import generate_simulated_data
from app.services.rebound_detector import detect_rebound
from app.services.behavior_analyzer import analyze_behavior

app = FastAPI(title="GreenGap Backend")

@app.get("/")
def home():
    return {"message": "GreenGap backend running"}

@app.get("/analyze")
def analyze():
    data = generate_simulated_data()

    rebound_result = detect_rebound(data)
    behavior_result = analyze_behavior(data)

    return {
        "rebound_analysis": rebound_result,
        "behavior_analysis": behavior_result
    }
