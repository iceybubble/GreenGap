def simulate_scenario(rebound_result: dict, reduction_factor: float = 0.1):
    """
    Simulates a future scenario where emissions reduce by a given factor.

    reduction_factor:
        0.1 = 10% improvement
    """

    actual_avg = rebound_result.get("actual_avg", 0)
    baseline_avg = rebound_result.get("baseline_avg", 0)

    # Simulated improved emissions
    projected_emission = actual_avg * (1 - reduction_factor)

    # Improvement gained
    improvement = actual_avg - projected_emission

    # New sustainability estimate
    if baseline_avg != 0:
        improvement_ratio = improvement / baseline_avg
    else:
        improvement_ratio = 0

    simulated_sustainability = min(100, improvement_ratio * 100)

    return {
        "projected_emission": projected_emission,
        "improvement": improvement,
        "simulated_sustainability": simulated_sustainability
    }
