import torch
from torch.utils.data import Dataset
import numpy as np
import pandas as pd
import os

class StudentLifeDataset(Dataset):
    def __init__(self, csv_file="bhavya_features.csv", seq_len=7):
        """
        Loads user behavior sequences from the feature CSV.
        Args:
            csv_file: Path to the built feature table.
            seq_len: Number of days in the sliding window (time-series).
        """
        self.seq_len = seq_len
        self.samples = []
        self.labels = []
        
        if not os.path.exists(csv_file):
            print(f"Warning: {csv_file} not found. Using synthetic generator fallback? No, run build_features.py first.")
            return

        print(f"Loading StudentLife Features from {csv_file}...")
        df = pd.read_csv(csv_file)
        
        # Normalize Features
        feature_cols = ['sleep_duration', 'sleep_midpoint', 'activity_level', 'activity_variance', 'routine_change']
        
        # Simple MinMax scaling for stability
        for col in feature_cols:
            if col in df.columns:
                df[col] = (df[col] - df[col].mean()) / (df[col].std() + 1e-5)
        
        # Group by User to create sequences
        for uid, group in df.groupby('uid'):
            group = group.sort_values('date')
            data = group[feature_cols].values
            targets = group['stress_label'].values
            
            # Create Sliding Windows
            # Need at least seq_len days
            if len(data) < seq_len:
                continue
                
            for i in range(len(data) - seq_len):
                # Input: Sequence of features
                seq_x = data[i : i + seq_len]
                # Target: Stress level at the END of the sequence (predicting current state)
                # Binarize: >=3 is High Risk (1.0), else 0.0
                label = 1.0 if targets[i + seq_len - 1] >= 3 else 0.0
                
                self.samples.append(seq_x)
                self.labels.append(label)

        print(f"Generated {len(self.samples)} sequences (SeqLen={seq_len}) from {len(df['uid'].unique())} users.")

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        return torch.tensor(self.samples[idx], dtype=torch.float32), torch.tensor(self.labels[idx], dtype=torch.float32)

if __name__ == "__main__":
    # Test
    ds = StudentLifeDataset(csv_file="bhavya_features.csv")
    if len(ds) > 0:
        print(f"Sample Shape: {ds[0][0].shape}, Label: {ds[0][1]}")
