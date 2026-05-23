import pandas as pd
import numpy as np
import os
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def build_features(data_dir="data/studentlife"):
    logger.info("Building BHAVYA Features...")
    
    # Load Raw Data
    sleep_path = os.path.join(data_dir, "sleep.csv")
    activity_path = os.path.join(data_dir, "activity.csv")
    gps_path = os.path.join(data_dir, "gps.csv")
    survey_path = os.path.join(data_dir, "survey.csv")

    sleep = pd.read_csv(sleep_path)
    activity = pd.read_csv(activity_path)
    gps = pd.read_csv(gps_path)
    survey = pd.read_csv(survey_path)
    
    # 1. Process Sleep
    # Already has duration. We need midpoint.
    # start_time is "estimated". 
    # Midpoint = start + duration/2. 
    # We need to normalize midpoint to "hours from midnight" or similar to capture rhythm.
    def calculate_midpoint(row):
        start = pd.to_datetime(row['start_time'])
        duration_hours = row['duration']
        mid = start + pd.Timedelta(hours=duration_hours/2)
        # return hour of day (0-24)
        return mid.hour + mid.minute/60.0

    sleep['sleep_midpoint'] = sleep.apply(calculate_midpoint, axis=1)
    
    # Aggregation per day (though sleep.csv is usually one per "night", sometimes day naps occur)
    # We'll take max duration as "main sleep" and its properties
    sleep_daily = sleep.groupby(['uid', 'date']).agg({
        'duration': 'sum',            # Total sleep
        'sleep_midpoint': 'first'     # Rhythm of main sleep (simplification)
    }).reset_index().rename(columns={'duration': 'sleep_duration'})

    # 2. Process Activity
    # Convert timestamp to date
    activity['ts'] = pd.to_datetime(activity['timestamp'])
    activity['date'] = activity['ts'].dt.date.astype(str)
    
    activity_daily = activity.groupby(['uid', 'date']).agg({
        'activity_inference': ['sum', 'std'] # sum = total "active" samples, std = variance
    }).reset_index()
    
    # Flatten columns
    activity_daily.columns = ['uid', 'date', 'activity_level', 'activity_variance']
    activity_daily['activity_variance'] = activity_daily['activity_variance'].fillna(0)

    # 3. Process Routine (GPS)
    gps['ts'] = pd.to_datetime(gps['timestamp'])
    gps['date'] = gps['ts'].dt.date.astype(str)
    
    # Variance in location_id as proxy for "routine change"
    # Actually, high variance = lots of travel/movement. Low variance = stayed home.
    # Routine change is usually "deviation from norm", but for simple feature we use daily variance.
    routine_daily = gps.groupby(['uid', 'date']).agg({
        'location_id': 'nunique' # Number of unique places visited
    }).reset_index().rename(columns={'location_id': 'routine_change'})

    # 4. Merge All
    # Base is survey (labels) or Date range. 
    # Let's use survey as base since we need labels for training.
    features = survey.rename(columns={'answer': 'stress_label'})[['uid', 'date', 'stress_label']]
    
    # Merge Sleep
    features = features.merge(sleep_daily, on=['uid', 'date'], how='left')
    
    # Merge Activity
    features = features.merge(activity_daily, on=['uid', 'date'], how='left')
    
    # Merge Routine
    features = features.merge(routine_daily, on=['uid', 'date'], how='left')
    
    # Handle Missing
    features = features.fillna({
        'sleep_duration': 0,
        'sleep_midpoint': 0,
        'activity_level': 0,
        'activity_variance': 0,
        'routine_change': 0
    })
    
    # Save
    features.to_csv("bhavya_features.csv", index=False)
    logger.info(f" - bhavya_features.csv created with columns: {list(features.columns)}")
    logger.info(f"\n{features.head()}")

if __name__ == "__main__":
    build_features()
