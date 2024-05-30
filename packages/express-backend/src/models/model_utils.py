import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.metrics import mean_squared_error

class Net(nn.Module):
    def __init__(self, input_size):
        super(Net, self).__init__()
        self.fc1 = nn.Linear(input_size, 100)
        self.fc2 = nn.Linear(100, 50)
        self.fc3 = nn.Linear(50, 1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def train_and_evaluate_model(model, criterion, optimizer, train_loader, X_test_tensor, y_test, num_epochs=10):
    for epoch in range(num_epochs):
        for inputs, targets in train_loader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, targets.view(-1, 1))
            loss.backward()
            optimizer.step()

    with torch.no_grad():
        y_pred_tensor = model(X_test_tensor)
        y_pred = y_pred_tensor.numpy().flatten()

    mse = mean_squared_error(y_test, y_pred)
    return mse

def predict_batter(batter_model, batter_norm, player, bnum_cols):
    player_history_data = batter_norm[batter_norm['Player'] == player]
    X_player = player_history_data[bnum_cols]
    X_player_mean = X_player.mean()
    X_player_mean_tensor = torch.tensor(X_player_mean.values, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        predicted_performance = batter_model(X_player_mean_tensor)

    return predicted_performance.numpy().flatten()[0]

def predict_pitcher(pitcher_model, pitcher_norm, player, pnum_cols):
    player_history_data = pitcher_norm[pitcher_norm['Player'] == player]
    X_player = player_history_data[pnum_cols]
    X_player_mean = X_player.mean()
    X_player_mean_tensor = torch.tensor(X_player_mean.values, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        y_pred_tensor = pitcher_model(X_player_mean_tensor)
        y_pred = y_pred_tensor.numpy().flatten()[0]

    return y_pred
