def format_dashboard_response(
    rebound_result: dict,
    behavior_result: dict,
    recommendation_result: dict,
    metrics_result: dict,
):
    """
    Converts raw analysis into a frontend-ready dashboard structure.
    """

    dashboard = {
        "summary_cards": {
            "sustainability_index": metrics_result["sustainability_index"],
            "co2_saved": metrics_result["co2_saved"],
            "efficiency_score": metrics_result["efficiency_score"],
            "behavior_score": metrics_result["behavior_score"],
        },
        "emissions_chart": rebound_result["graph_data"],
        "behavior_insights": behavior_result,
        "recommendations": recommendation_result["recommendations"],
        "corrected_projection": recommendation_result[
            "corrected_emission_projection"
        ],
        "rebound_level": rebound_result["rebound_level"],
    }

    return dashboard
