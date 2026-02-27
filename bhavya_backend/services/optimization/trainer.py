import torch
import torch.optim as optim
import torch.nn as nn
from services.inference.models import BehavioralLSTM, BehavioralTransformer
import os
import numpy as np

class ModelTrainer:
    def __init__(self, model_type="lstm", input_dim=4, hidden_dim=16, output_dim=1):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model_type = model_type
        
        if model_type == "lstm":
            self.model = BehavioralLSTM(input_dim, hidden_dim, output_dim).to(self.device)
        else:
            self.model = BehavioralTransformer(input_dim).to(self.device)
            
        self.criterion = nn.BCELoss() # Binary Classification (Risk vs No Risk)
        self.optimizer = optim.Adam(self.model.parameters(), lr=0.001)

    def train(self, train_loader, epochs=10):
        self.model.train()
        print(f"Starting training on {self.device} for {epochs} epochs...")
        
        for epoch in range(epochs):
            total_loss = 0
            for X, y in train_loader:
                X, y = X.to(self.device), y.to(self.device)
                
                self.optimizer.zero_grad()
                predictions = self.model(X)
                
                loss = self.criterion(predictions.squeeze(), y)
                loss.backward()
                self.optimizer.step()
                
                total_loss += loss.item()
            
            print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(train_loader):.4f}")

    def save_model(self, path="model_v1.pt"):
        torch.save(self.model.state_dict(), path)
        print(f"Model saved to {path}")

    def evaluate(self, test_loader):
        self.model.eval()
        correct = 0
        total = 0
        with torch.no_grad():
            for X, y in test_loader:
                X, y = X.to(self.device), y.to(self.device)
                outputs = self.model(X)
                predicted = (outputs.squeeze() > 0.5).float()
                total += y.size(0)
                correct += (predicted == y).sum().item()
        
        accuracy = correct / total
        print(f"Validation Accuracy: {accuracy:.4f}")
        return accuracy
