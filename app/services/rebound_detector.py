import numpy as np

def detect_rebound(data: dict):
    baseline = np.array(data["baseline"])
    expected = np.array(data["expected"])
    actual = np.array(data["actual"])

    baseline_avg = baseline.mean()
    expected_avg = expected.mean()
    actual_avg = actual.mean()

    expected_reduction = baseline_avg - expected_avg
    actual_reduction = baseline_avg - actual_avg

    rebound_loss = expected_reduction - actual_reduction

    rebound_index = 0
    if expected_reduction != 0:
        rebound_index = rebound_loss / expected_reduction

    if rebound_index < 0.2:
        level = "LOW"
    elif rebound_index < 0.5:
        level = "MEDIUM"
    else:
        level = "HIGH"

    # Graph-ready structure
    graph_data = {
        "labels": list(range(1, len(baseline) + 1)),
        "baseline": baseline.tolist(),
        "expected": expected.tolist(),
        "actual": actual.tolist()
    }

    return {
        "baseline_avg": float(baseline_avg),
        "expected_avg": float(expected_avg),
        "actual_avg": float(actual_avg),
        "rebound_index": float(rebound_index),
        "rebound_level": level,
        "lost_climate_benefit": float(rebound_loss),
        "graph_data": graph_data
    }
