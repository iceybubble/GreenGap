from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime

app = FastAPI(title="GreenGap API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "GreenGap backend running"}

@app.get("/analyze")
def analyze():
    """
    Generate dynamic sustainability analytics with randomized data
    to simulate real-time changes
    """
    
    # Generate random values for dynamic display
    sustainability_index = round(random.uniform(45.0, 85.0), 1)
    co2_saved = round(random.uniform(10.0, 25.0), 2)
    efficiency_score = round(random.uniform(40.0, 90.0), 1)
    behavior_score = round(random.uniform(60.0, 95.0), 1)
    
    # Determine rebound level based on efficiency
    if efficiency_score < 50:
        rebound_level = "HIGH"
        rebound_percentage = random.randint(70, 95)
    elif efficiency_score < 75:
        rebound_level = "MEDIUM"
        rebound_percentage = random.randint(40, 70)
    else:
        rebound_level = "LOW"
        rebound_percentage = random.randint(10, 35)
    
    # Generate corrected projection
    corrected_projection = round(co2_saved * random.uniform(0.7, 1.3), 2)
    
    # Random behavior insights
    insights = [
        "High usage detected during peak hours - consider scheduling optimization",
        "Reduced consumption behavior observed - efficiency gains maintained",
        "Weekend usage spike detected - potential rebound effect identified",
        "Consistent usage patterns - sustainable behavior maintained",
        "Evening consumption increased - review automated controls",
        "Energy-efficient practices adopted successfully"
    ]
    
    behavior_reason = random.choice(insights)
    
    # Generate chart data with variance
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    baseline = [round(random.uniform(95, 110), 1) for _ in days]
    expected = [round(b * random.uniform(0.75, 0.85), 1) for b in baseline]
    actual = [round(e * random.uniform(0.9, 1.15), 1) for e in expected]
    
    # Generate AI recommendations
    all_recommendations = [
        "High rebound detected: reduce usage duration after efficiency adoption",
        "Set smart usage schedules to prevent overconsumption",
        "Monitor consumption patterns weekly and adjust habits accordingly",
        "Consider renewable energy sources to offset your carbon footprint",
        "Implement automated controls during off-peak hours",
        "Review appliance settings for optimal efficiency",
        "Enable power-saving modes during non-essential hours",
        "Track and reduce standby power consumption"
    ]
    
    # Randomly select 2-4 recommendations
    num_recommendations = random.randint(2, 4)
    recommendations = random.sample(all_recommendations, num_recommendations)
    
    return {
        "dashboard": {
            "summary_cards": {
                "sustainability_index": sustainability_index,
                "co2_saved": co2_saved,
                "efficiency_score": efficiency_score,
                "behavior_score": behavior_score
            },
            "rebound_level": rebound_level,
            "rebound_percentage": rebound_percentage,
            "corrected_projection": corrected_projection,
            "behavior_insights": {
                "behavior_reason": behavior_reason
            },
            "emissions_chart": {
                "labels": days,
                "baseline": baseline,
                "expected": expected,
                "actual": actual
            },
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
            "analysis_id": random.randint(1000, 9999)
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }