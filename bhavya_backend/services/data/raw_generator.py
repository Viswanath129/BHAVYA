import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_raw_data(base_dir="data/studentlife"):
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)

    num_users = 20
    days = 30
    start_date = datetime(2023, 1, 1)

    print(f"Generating synthetic StudentLife data in {base_dir}...")

    # 1. Sleep Data
    # Columns: uid, date, start_time, end_time, duration
    sleep_rows = []
    for uid in range(num_users):
        for day in range(days):
            curr_date = start_date + timedelta(days=day)
            
            # Sleep usually starts between 22:00 and 02:00
            start_hour = np.random.normal(23.5, 1.5) 
            if start_hour >= 24:
                start_time = curr_date + timedelta(days=1) - timedelta(hours=24-start_hour) # e.g. 1 AM next day
            else:
                start_time = curr_date + timedelta(hours=start_hour)
            
            duration = max(3, np.random.normal(7, 1.5))
            end_time = start_time + timedelta(hours=duration)
            
            sleep_rows.append({
                'uid': f'u{uid:02d}',
                'date': curr_date.strftime('%Y-%m-%d'), 
                'start_time': start_time.strftime('%Y-%m-%d %H:%M:%S'),
                'end_time': end_time.strftime('%Y-%m-%d %H:%M:%S'),
                'duration': duration
            })
    pd.DataFrame(sleep_rows).to_csv(f"{base_dir}/sleep.csv", index=False)
    print(" - sleep.csv created")

    # 2. Activity Data
    # Columns: uid, timestamp, activity_level (0: low, 1: high)
    # We simulate hourly summaries for simplicity in this synthetic generator
    activity_rows = []
    for uid in range(num_users):
        for day in range(days):
            curr_date = start_date + timedelta(days=day)
            # Higher activity for some users
            baseline_activity = np.random.uniform(0.3, 0.8) 
            
            for hour in range(24):
                ts = curr_date + timedelta(hours=hour)
                # Night time (0-6) low activity
                if 0 <= hour < 6:
                    level = np.random.choice([0, 1], p=[0.95, 0.05])
                else:
                    level = np.random.choice([0, 1], p=[1-baseline_activity, baseline_activity])
                
                # We'll just generate raw events. "activity_inference" in StudentLife is 0,1,2,3
                # 0: Stationary, 1: Walking, 2: Running, 3: Unknown
                # Let's simple it to "movement count" for the aggregator
                # Simulating "inferred" activity samples
                activity_rows.append({
                    'uid': f'u{uid:02d}',
                    'timestamp': ts.strftime('%Y-%m-%d %H:%M:%S'),
                    'activity_inference': level # Simplified 0/1 for now, or 0/1/2
                })
    pd.DataFrame(activity_rows).to_csv(f"{base_dir}/activity.csv", index=False)
    print(" - activity.csv created")

    # 3. GPS / Location Data (for routine change)
    # Columns: uid, timestamp, lat, long, loc_id
    # We simulate "number of unique locations visited" or "variance" directly for simplicity? 
    # No, let's simulate location IDs to allow variance calc
    gps_rows = []
    for uid in range(num_users):
        # User has a "home" and "work" and "other"
        locs = [0, 1, 2, 3, 4]
        probs = [0.6, 0.2, 0.1, 0.05, 0.05] # Mostly home
        
        for day in range(days):
            curr_date = start_date + timedelta(days=day)
            # On weekends, maybe more variance?
            day_probs = probs if curr_date.weekday() < 5 else [0.4, 0.1, 0.2, 0.2, 0.1]
            
            # Simulate hourly location samples
            for hour in range(8, 22, 2): # Sampling every 2 hours
                ts = curr_date + timedelta(hours=hour)
                loc_id = np.random.choice(locs, p=day_probs)
                gps_rows.append({
                    'uid': f'u{uid:02d}',
                    'timestamp': ts.strftime('%Y-%m-%d %H:%M:%S'),
                    'location_id': loc_id
                })
    pd.DataFrame(gps_rows).to_csv(f"{base_dir}/gps.csv", index=False)
    print(" - gps.csv created")

    # 4. Survey Data (Targets)
    # Columns: uid, timestamp, type, answer
    survey_rows = []
    for uid in range(num_users):
        for day in range(days):
            curr_date = start_date + timedelta(days=day)
            # Target generation logic: depends on sleep/activity (ground truth correlation)
            # We want the model to actually learn something!
            
            # Get sleep for this day
            # (Simplified lookup)
            # Rule: Low sleep (<5h) OR Low activity -> High Stress
            
            # Random default
            stress_score = np.random.randint(1, 4) # 1-5 scale. 1=Low Stress, 5=High
            
            # Let's inject correlation later in aggregator? 
            # Or just random here and we rely on the classifier finding the random signal? 
            # Better to inject signal.
            
            # Signal injection handled by statistical property:
            # We'll just generate random labels here, but maybe slightly correlated to user baseline
            # Real learning will happen if we correlate it. 
            # For "raw" generator, let's just make it random-ish but persistent per user.
            
            survey_rows.append({
                'uid': f'u{uid:02d}',
                'date': curr_date.strftime('%Y-%m-%d'),
                'type': 'stress',
                'answer': stress_score
            })
    pd.DataFrame(survey_rows).to_csv(f"{base_dir}/survey.csv", index=False)
    print(" - survey.csv created")

if __name__ == "__main__":
    generate_raw_data()
