import numpy as np
import pandas as pd
from datetime import datetime, timedelta

class FeatureEngineer:
    def __init__(self):
        self.window_size = 7 # 7 days window

    def compute_sleep_irregularity(self, sleep_durations):
        """Standard Deviation of sleep duration over the window."""
        if not sleep_durations or len(sleep_durations) < 2:
            return 0.0
        return np.std(sleep_durations)

    def compute_activity_variance(self, steps_data):
        """Variance in daily steps."""
        if not steps_data or len(steps_data) < 2:
            return 0.0
        return np.var(steps_data)

    def process_user_window(self, raw_data):
        """
        Converts raw StudentLife-like log data into a feature vector.
        Expected raw_data dict keys: 'sleep_duration', 'active_minutes', 'conversation_minutes', 'screen_time'
        """
        features = []
        
        # 1. Sleep Duration (Raw)
        features.append(raw_data.get('sleep_duration', 0.0))
        
        # 2. Activity Level (Raw)
        features.append(raw_data.get('active_minutes', 0.0))
        
        # 3. Social Interaction (Conversation)
        features.append(raw_data.get('conversation_minutes', 0.0))

        # 4. Screen Time
        features.append(raw_data.get('screen_time', 0.0))

        return np.array(features, dtype=np.float32)
