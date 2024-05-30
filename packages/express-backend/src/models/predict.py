import sys
import pandas as pd
from scipy import stats
import torch
from model_utils import Net, predict_batter, predict_pitcher

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
    player_type = sys.argv[1]
    player_name = sys.argv[2]

    if player_type not in ['batter', 'pitcher']:
        print("Invalid player type. Must be 'batter' or 'pitcher'.")
        return

    if player_type == 'batter':
        batter = pd.read_csv('./src/data/batter.csv')
        batter_norm = batter.copy()
        for col in bnum_cols:
            percentiles = batter_norm[col].apply(lambda x: stats.percentileofscore(batter_norm[col], x, kind='rank'))
            batter_norm.loc[:, col] = percentiles / 100

        batter_model = Net(input_size=len(bnum_cols))
        batter_model.load_state_dict(torch.load('batter_model.pth'))
        batter_model.eval()

        prediction = predict_batter(batter_model, batter_norm, player_name, bnum_cols)
        print(f"Predicted performance for batter {player_name}: {prediction}")

    else:
        pitcher = pd.read_csv('./src/data/pitcher.csv')
        pitcher_norm = pitcher.copy()
        pitcher_norm.drop(columns=['p_opp_batting_avg'], inplace=True)
        for col in pnum_cols:
            percentiles = pitcher_norm[col].apply(lambda x: stats.percentileofscore(pitcher_norm[col], x, kind='rank'))
            pitcher_norm.loc[:, col] = percentiles / 100

        pitcher_model = Net(input_size=len(pnum_cols))
        pitcher_model.load_state_dict(torch.load('pitcher_model.pth'))
        pitcher_model.eval()

        prediction = predict_pitcher(pitcher_model, pitcher_norm, player_name, pnum_cols)
        print(f"Predicted performance for pitcher {player_name}: {prediction}")

if __name__ == '__main__':
    main()
