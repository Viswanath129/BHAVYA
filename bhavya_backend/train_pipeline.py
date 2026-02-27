import torch
from torch.utils.data import DataLoader, random_split
from services.optimization.trainer import ModelTrainer
from services.data.studentlife import StudentLifeDataset
import numpy as np

def run_pipeline():
    print("--- BHAVYA ML Training Pipeline (Deep Learning on CSV) ---")
    
    # 1. Load Data (From Feature Table)
    dataset = StudentLifeDataset(csv_file="bhavya_features.csv", seq_len=7)
    
    # Split
    if len(dataset) == 0:
        print("No data found. Run build_features.py first.")
        return

    train_size = int(0.8 * len(dataset))
    test_size = len(dataset) - train_size
    train_dataset, test_dataset = random_split(dataset, [train_size, test_size])
    
    train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=32)
    
    # 2. Initialize Trainer (LSTM)
    # Features: sleep_duration, sleep_midpoint, activity_level, activity_variance, routine_change (5 total)
    trainer = ModelTrainer(model_type="lstm", input_dim=5, hidden_dim=32)
    
    # 3. Train
    trainer.train(train_loader, epochs=10)
    
    # 4. Evaluate
    trainer.evaluate(test_loader)
    
    # 5. Save
    trainer.save_model("services/inference/studentlife_model_v1.pt")

if __name__ == "__main__":
    run_pipeline()
