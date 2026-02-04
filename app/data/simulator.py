import numpy as np

def generate_simulated_data(days: int = 30):
    """
    Generates realistic baseline, expected, and actual emission data.
    """

    # Baseline emissions (before green tech)
    baseline = np.random.normal(100, 5, days)

    # Expected reduction after efficiency (30%)
    expected = baseline * 0.7

    # Actual reduction smaller due to rebound (15%)
    actual = baseline * 0.85

    return {
        "baseline": baseline.tolist(),
        "expected": expected.tolist(),
        "actual": actual.tolist()
    }
