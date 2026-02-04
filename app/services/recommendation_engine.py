def generate_recommendations(rebound_result: dict, behavior_result: dict):
    """
    Generates climate behavior recommendations based on rebound detection.
    """

    rebound_index = rebound_result.get("rebound_index", 0)
    behavior_reason = behavior_result.get("behavior_reason", "")

    recommendations = []

    # Based on rebound level
    if rebound_index > 0.5:
        recommendations.append(
            "High rebound detected: reduce usage duration after efficiency adoption."
        )
        recommendations.append(
            "Set smart usage schedules to prevent overconsumption."
        )
    elif rebound_index > 0.2:
        recommendations.append(
            "Moderate rebound: monitor usage patterns and avoid extended runtime."
        )
    else:
        recommendations.append(
            "Good efficiency retention: maintain current usage behavior."
        )

    # Based on behavior analysis
    if "Increased usage" in behavior_reason:
        recommendations.append(
            "Behavioral rebound detected: efficiency gains may be encouraging overuse."
        )

    # Example corrected projection (simple improvement model)
    corrected_projection = rebound_result["expected_avg"] + (
        rebound_result["actual_avg"] - rebound_result["expected_avg"]
    ) * 0.5

    return {
        "recommendations": recommendations,
        "corrected_emission_projection": corrected_projection
    }
