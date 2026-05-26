import torch
import torch.nn as nn
import numpy as np

class EEVTemporalModel(nn.Module):
    def __init__(self, input_dim=15, hidden_dim=64, num_layers=2, num_classes=4):
        super(EEVTemporalModel, self).__init__()
        """
        Temporal Emotion Dynamics Model
        Trained on EEV (Youtube-8M derived) dataset structure.
        Input: Sequence of 15-dimensional emotion vectors (from NPU/CNN).
        Output: Pattern classification (Stable, Volatile, Depressive, Anxious).
        """
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=0.2
        )
        self.fc = nn.Linear(hidden_dim, num_classes)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        # x shape: (batch_size, seq_len, 15)
        # Output: (batch_size, num_classes)
        
        # LSTM output: (batch, seq, hidden)
        lstm_out, _ = self.lstm(x)
        
        # We take the *last* time step for classification
        # Alternatively, we could do attention output, but last-step is standard for simple classification
        last_step = lstm_out[:, -1, :]
        
        logits = self.fc(last_step)
        probs = self.softmax(logits)
        return probs

    def predict_from_vector(self, base_vector, seq_len=30):
        """
        Simulates temporal persistence from a single vector and runs inference.
        """
        # 1. Simulate Temporal Persistence
        sequence = []
        for _ in range(seq_len):
            noise = np.random.normal(0, 0.02, 15)
            frame_vec = np.clip(base_vector + noise, 0, 1)
            # Avoid division by zero if all elements are 0
            vec_sum = frame_vec.sum()
            if vec_sum > 0:
                frame_vec /= vec_sum
            sequence.append(frame_vec)

        sequence_np = np.array(sequence)

        # 2. Model Inference
        tensor_input = torch.tensor(sequence_np, dtype=torch.float32).unsqueeze(0)
        with torch.no_grad():
            probs = self.forward(tensor_input)

        pattern_idx = torch.argmax(probs).item()
        patterns = ["Stable", "Volatile", "Depressive", "Anxious"]
        detected_pattern = patterns[pattern_idx]

        # 3. Risk Scoring
        risk_score = AffectiveRiskScorer.calculate_risk(sequence_np)

        return {
            "pattern": detected_pattern,
            "risk_score": float(risk_score),
            "sequence": sequence_np
        }

class AffectiveRiskScorer:
    @staticmethod
    def calculate_risk(emotion_sequence):
        """
        Heuristic risk calculation based on emotion volatility and negative dominance.
        Input: numpy array (seq_len, 15)
        """
        # EEV 15 emotions (Hypothetical mapping based on EEV generic taxonomy)
        # Indices 0-5: Positive (e.g., Amused, Excited, Happy...)
        # Indices 6-10: Neutral/Mixed
        # Indices 11-14: Negative (e.g., Anxious, Sad, Angry, Disgusted)
        
        # 1. Variance (Volatility)
        volatility = emotion_sequence.std(axis=0).mean()
        
        # 2. Negative Dominance
        neg_mean = emotion_sequence[:, 11:].mean()
        pos_mean = emotion_sequence[:, :6].mean()
        
        risk_score = (neg_mean * 0.7) + (volatility * 0.3)
        # Normalize roughly 0-1
        return min(max(risk_score * 2.0, 0.0), 1.0)
