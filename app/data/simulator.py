import numpy as np
from app.services.impact_model import calculate_expected_impact

def generate_simulated_data(days: int = 30):

    # Baseline emissions
    baseline = np.random.normal(100, 5, days)

    # Expected emissions from impact model
    expected = calculate_expected_impact(baseline, efficiency_gain=0.3)

    # Actual emissions (simulate rebound)
    actual = baseline * 0.85

    return {
        "baseline": baseline.tolist(),
        "expected": expected,
        "actual": actual.tolist()
    }
