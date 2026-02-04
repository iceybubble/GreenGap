import numpy as np

def detect_rebound(data: dict):
    """
    Calculates rebound index and lost climate benefit.
    """

    baseline = np.array(data["baseline"])
    expected = np.array(data["expected"])
    actual = np.array(data["actual"])

    # Average emissions
    baseline_avg = baseline.mean()
    expected_avg = expected.mean()
    actual_avg = actual.mean()

    # Expected vs Actual reductions
    expected_reduction = baseline_avg - expected_avg
    actual_reduction = baseline_avg - actual_avg

    # Rebound loss
    rebound_loss = expected_reduction - actual_reduction

    # Rebound index
    rebound_index = 0
    if expected_reduction != 0:
        rebound_index = rebound_loss / expected_reduction

    # Classification
    if rebound_index < 0.2:
        level = "LOW"
    elif rebound_index < 0.5:
        level = "MEDIUM"
    else:
        level = "HIGH"

    return {
        "baseline_avg": float(baseline_avg),
        "expected_avg": float(expected_avg),
        "actual_avg": float(actual_avg),
        "rebound_index": float(rebound_index),
        "rebound_level": level,
        "lost_climate_benefit": float(rebound_loss)
    }
