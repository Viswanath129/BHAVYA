import torch
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from app.db import models
from services.inference.models import BehavioralLSTM

class RiskPredictor:
    def __init__(self, model_path="services/inference/studentlife_model_v1.pt"):
        self.device = torch.device("cpu") # For inference, CPU is fine
        self.model = BehavioralLSTM(input_dim=5, hidden_dim=32, output_dim=1).to(self.device)
        
        try:
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.model.eval()
            print(f"RiskPredictor loaded model from {model_path}")
        except FileNotFoundError:
            print(f"Warning: Model not found at {model_path}. Using random weights.")

    def predict_risk(self, user_id: int, db) -> dict:
        """
        Predicts stress/risk level for a user based on recent behavior.
        If behavior is missing, generates synthetic data for demonstration.
        """
        # 1. Fetch recent behavior (Last 7 days)
        # For now, we simulate fetching behavior data. 
        # In production, query `db_raw` or similar tables.
        
        # Simulate fetching data (or use real if implemented)
        # We'll generate a sequence for the user to ensure the ALGO runs
        seq_len = 7
        features = self._fetch_or_generate_features(user_id, seq_len)
        
        # 2. Prepare Tensor
        x = torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(self.device) # (1, 7, 5)
        
        # 3. Inference
        with torch.no_grad():
            risk_prob = self.model(x).item()
            
        return {
            "risk_score": float(risk_prob),
            "risk_label": "High" if risk_prob > 0.6 else "Medium" if risk_prob > 0.3 else "Low",
            "contributing_factors": self._explain_risk(features)
        }

    def _fetch_or_generate_features(self, user_id, seq_len):
        # Placeholder: Generate 7 days of random behavioral data
        # ['sleep_duration', 'sleep_midpoint', 'activity_level', 'activity_variance', 'routine_change']
        
        # Simulate a stressed user pattern for demonstration if user_id is odd, else healthy
        is_stressed_mock = (user_id % 2 != 0) 
        
        data = []
        for _ in range(seq_len):
            if is_stressed_mock:
                # Stressed: Low sleep, Low activity, Low variance
                row = [
                    np.random.normal(5.0, 1.0), # Sleep duration
                    np.random.normal(3.0, 1.0), # Midpoint (late)
                    np.random.uniform(0.1, 0.4), # Activity Level
                    np.random.uniform(0.0, 0.2), # Activity Variance
                    np.random.randint(0, 2)      # Routine Change (low)
                ]
            else:
                # Healthy: Good sleep, High activity
                row = [
                    np.random.normal(7.5, 0.5),
                    np.random.normal(1.5, 0.5), # Midpoint (early)
                    np.random.uniform(0.5, 0.9),
                    np.random.uniform(0.3, 0.8),
                    np.random.randint(1, 5)
                ]
            data.append(row)
            
        return np.array(data)

    def _explain_risk(self, features):
        # Simple heuristic explanation based on the input features
        # Average the sequence
        avg = np.mean(features, axis=0)
        # ['sleep', 'midpoint', 'activity', 'var', 'routine']
        explanations = []
        if avg[0] < 6.0:
            explanations.append("Low sleep duration detected.")
        if avg[2] < 0.3:
            explanations.append("Reduced physical activity levels.")
        if avg[4] < 1.0:
            explanations.append("Social isolation / monotony detected.")
            
        if not explanations:
            explanations.append("Behavioral patterns appear stable.")
            
        return explanations

# Singleton instance
predictor = RiskPredictor()
