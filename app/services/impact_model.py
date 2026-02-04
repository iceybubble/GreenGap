import numpy as np

def calculate_expected_impact(baseline_data, efficiency_gain: float = 0.3):
    """
    Calculates expected emissions after adopting green technology.

    efficiency_gain:
        0.3 means 30% expected reduction
    """

    baseline = np.array(baseline_data)

    expected = baseline * (1 - efficiency_gain)

    return expected.tolist()
