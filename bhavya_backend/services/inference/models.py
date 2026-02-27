import torch
import torch.nn as nn

class BehavioralLSTM(nn.Module):
    def __init__(self, input_dim, hidden_dim, output_dim, num_layers=2):
        super(BehavioralLSTM, self).__init__()
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # LSTM for temporal sequence learning
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True, dropout=0.2)
        
        # Fully connected layer for risk prediction
        self.fc = nn.Linear(hidden_dim, output_dim)
        
        # Activation for probability
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # x shape: (batch_size, seq_len, input_dim)
        
        # Initialize hidden state with zeros
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_dim).to(x.device)
        
        # Forward propagate LSTM
        out, _ = self.lstm(x, (h0, c0))
        
        # Decode the hidden state of the last time step
        out = self.fc(out[:, -1, :])
        
        return self.sigmoid(out)

class BehavioralTransformer(nn.Module):
    def __init__(self, input_dim, d_model=64, nhead=4, num_layers=2, output_dim=1):
        super(BehavioralTransformer, self).__init__()
        
        self.embedding = nn.Linear(input_dim, d_model)
        
        encoder_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=nhead, batch_first=True)
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        
        self.fc = nn.Linear(d_model, output_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        # x shape: (batch_size, seq_len, input_dim)
        x = self.embedding(x)
        x = self.transformer_encoder(x)
        
        # Average pool over sequence
        x = x.mean(dim=1)
        
        out = self.fc(x)
        return self.sigmoid(out)
