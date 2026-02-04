from fastapi import FastAPI
from app.data.simulator import generate_simulated_data
from app.services.rebound_detector import detect_rebound

app = FastAPI(title="GreenGap Backend")

@app.get("/")
def home():
    return {"message": "GreenGap backend running"}

# Generate demo climate dataset
@app.get("/simulate")
def simulate():
    data = generate_simulated_data()
    return data

# Core endpoint — Rebound Detection
@app.get("/detect-rebound")
def detect():
    data = generate_simulated_data()
    result = detect_rebound(data)
    return result
