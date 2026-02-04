from fastapi import FastAPI
from app.data.simulator import generate_simulated_data
from app.services.rebound_detector import detect_rebound
from app.services.behavior_analyzer import analyze_behavior
from app.services.recommendation_engine import generate_recommendations
from app.api.routes import router

#CREATE APP FIRST
app = FastAPI(title="GreenGap Backend")

app.include_router(router)

@app.get("/")
def home():
    return {"message": "GreenGap backend running"}


@app.get("/analyze")
def analyze():
    data = generate_simulated_data()

    rebound_result = detect_rebound(data)
    behavior_result = analyze_behavior(data)
    recommendation_result = generate_recommendations(
        rebound_result, behavior_result
    )

    return {
        "rebound_analysis": rebound_result,
        "behavior_analysis": behavior_result,
        "recommendations": recommendation_result
    }
