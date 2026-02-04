def calculate_climate_metrics(rebound_result: dict, behavior_result: dict):
    """
    Calculates sustainability metrics for GreenGap dashboard.
    """

    baseline = rebound_result.get("baseline_avg", 0)
    actual = rebound_result.get("actual_avg", 0)
    rebound_index = rebound_result.get("rebound_index", 0)

    # CO2 Saved
    co2_saved = baseline - actual

    # Efficiency Score (0–100)
    efficiency_score = max(0, 100 * (1 - rebound_index))

    # Behavior Score (simple logic)
    behavior_reason = behavior_result.get("behavior_reason", "")
    if "Reduced consumption" in behavior_reason:
        behavior_score = 80
    elif "Increased usage" in behavior_reason:
        behavior_score = 40
    else:
        behavior_score = 60

    # ⭐ GreenGap Sustainability Index
    sustainability_index = (efficiency_score * 0.6) + (behavior_score * 0.4)

    return {
        "co2_saved": co2_saved,
        "efficiency_score": efficiency_score,
        "behavior_score": behavior_score,
        "sustainability_index": sustainability_index
    }
