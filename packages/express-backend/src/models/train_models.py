import pandas as pd
from scipy import stats
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, TensorDataset
from model_utils import Net, train_and_evaluate_model

bnum_cols = ['player_age', 'ab', 'pa', 'hit', 'single', 'double', 'triple',
             'home_run', 'strikeout', 'walk', 'batting_avg', 'slg_percent',
             'on_base_percent', 'on_base_plus_slg', 'b_rbi', 'r_total_stolen_base',
             'b_hit_by_pitch', 'player_id_x', 'k_percent', 'bb_percent',
             'xba', 'xslg', 'woba', 'xwoba', 'xobp', 'xiso', 'exit_velocity_avg',
             'launch_angle_avg', 'sweet_spot_percent', 'barrel_batted_rate',
             'hard_hit_percent', 'avg_best_speed', 'avg_hyper_speed', 'whiff_percent', 'swing_percent']

pnum_cols = ['player_age', 'p_game', 'p_formatted_ip', 'pa',
             'ab', 'hit', 'single', 'double', 'triple', 'home_run', 'strikeout',
             'walk', 'k_percent', 'bb_percent', 'batting_avg', 'slg_percent',
             'on_base_percent', 'on_base_plus_slg', 'p_earned_run', 'p_win',
             'p_loss', 'p_era', 'p_quality_start', 'xba',
             'xslg', 'woba', 'xwoba', 'bacon', 'xbacon', 'exit_velocity_avg',
             'launch_angle_avg', 'barrel_batted_rate', 'avg_hyper_speed',
             'z_swing_percent', 'z_swing_miss_percent', 'oz_swing_percent',
             'oz_swing_miss_percent', 'out_zone_percent', 'composite_pitcher_metric']

def main():
    batter = pd.read_csv('./src/data/batter.csv')
    batter_norm = batter.copy()

    pitcher = pd.read_csv('./src/data/pitcher.csv')
    pitcher_norm = pitcher.copy()
    pitcher_norm.drop(columns=['p_opp_batting_avg'], inplace=True)

    for col in pnum_cols:
        percentiles = pitcher_norm[col].apply(lambda x: stats.percentileofscore(pitcher_norm[col], x, kind='rank'))
        pitcher_norm.loc[:, col] = percentiles / 100

    for col in bnum_cols:
        percentiles = batter_norm[col].apply(lambda x: stats.percentileofscore(batter_norm[col], x, kind='rank'))
        batter_norm.loc[:, col] = percentiles / 100

    X_train_filtered = batter_norm[batter_norm['year'] < 2023][bnum_cols]
    y_train_filtered = batter_norm[batter_norm['year'] < 2023]['composite_hit_metric']

    X_test_filtered = batter_norm[batter_norm['year'] == 2023][bnum_cols]
    y_test_filtered = batter_norm[batter_norm['year'] == 2023]['composite_hit_metric']

    X_train_tensor = torch.tensor(X_train_filtered.values, dtype=torch.float32)
    y_train_tensor = torch.tensor(y_train_filtered.values, dtype=torch.float32)
    X_test_tensor = torch.tensor(X_test_filtered.values, dtype=torch.float32)
    y_test_tensor = torch.tensor(y_test_filtered.values, dtype=torch.float32)

    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

    batter_model = Net(input_size=X_train_filtered.shape[1])

    criterion = nn.MSELoss()
    optimizer = optim.Adam(batter_model.parameters(), lr=0.001)

    mse = train_and_evaluate_model(batter_model, criterion, optimizer, train_loader, X_test_tensor, y_test_tensor)
    torch.save(batter_model.state_dict(), 'batter_model.pth')
    print('Batter Model MSE:', mse)

    X_train_filtered = pitcher_norm[pitcher_norm['year'] < 2023][pnum_cols]
    y_train_filtered = pitcher_norm[pitcher_norm['year'] < 2023]['composite_pitcher_metric']

    X_test_filtered = pitcher_norm[pitcher_norm['year'] == 2023][pnum_cols]
    y_test_filtered = pitcher_norm[pitcher_norm['year'] == 2023]['composite_pitcher_metric']

    X_train_tensor = torch.tensor(X_train_filtered.values, dtype=torch.float32)
    y_train_tensor = torch.tensor(y_train_filtered.values, dtype=torch.float32)
    X_test_tensor = torch.tensor(X_test_filtered.values, dtype=torch.float32)
    y_test_tensor = torch.tensor(y_test_filtered.values, dtype=torch.float32)

    train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)

    pitcher_model = Net(input_size=X_train_filtered.shape[1])

    criterion = nn.MSELoss()
    optimizer = optim.Adam(pitcher_model.parameters(), lr=0.001)

    mse = train_and_evaluate_model(pitcher_model, criterion, optimizer, train_loader, X_test_tensor, y_test_tensor)
    torch.save(pitcher_model.state_dict(), 'pitcher_model.pth')
    print('Pitcher Model MSE:', mse)

if __name__ == '__main__':
    main()
