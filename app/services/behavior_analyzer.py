import numpy as np

def analyze_behavior(data: dict):
    """
    Detects behavioral rebound patterns based on usage differences.
    """

    baseline = np.array(data["baseline"])
    actual = np.array(data["actual"])

    usage_change = actual.mean() - baseline.mean()

    if usage_change > 0:
        reason = "Increased usage after efficiency adoption"
    elif usage_change < 0:
        reason = "Reduced consumption behavior"
    else:
        reason = "Stable usage pattern"

    return {
        "usage_change": float(usage_change),
        "behavior_reason": reason
    }
