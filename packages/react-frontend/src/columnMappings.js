// react-frontend/src/columnMappings.js

const columnMappings = {
    batterBasic: {
        Player: 'Player',
        Team: 'Team',
        Position: 'Position',
        year: 'Year',
        player_age: 'Age',
        ab: 'AB',
        pa: 'PA',
        hit: 'Hits',
        single: 'Singles',
        double: 'Doubles',
        triple: 'Triples',
        home_run: 'HR',
        strikeout: 'SO',
        walk: 'Walks',
        batting_avg: 'BA',
        slg_percent: 'SLG',
        on_base_percent: 'OBP',
        on_base_plus_slg: 'OPS',
        b_rbi: 'RBI',
        r_total_stolen_base: 'SB',
        b_hit_by_pitch: 'HBP'
    },
    batterStatcast: {
      Player: 'Player',
      Team: 'Team',
      Position: 'Position',
      year: 'Year',
      player_age: 'Age',
      k_percent: 'K%',
      bb_percent: 'BB%',
      xba: 'xBA',
      xslg: 'xSLG',
      woba: 'wOBA',
      xwoba: 'xWOBA',
      xobp: 'xOBP',
      xiso: 'xISO',
      exit_velocity_avg: 'Avg EV',
      launch_angle_avg: 'Avg LA',
      sweet_spot_percent: 'Sweet Spot%',
      barrel_batted_rate: 'Barrel Rate',
      hard_hit_percent: 'Hard Hit%',
      avg_best_speed: 'Avg Best Speed',
      avg_hyper_speed: 'Avg Hyper Speed',
      whiff_percent: 'Whiff%',
      swing_percent: 'Swing%'

  }
  };
  
  const tableMappings = {
    batterBasic: 'Basic Batting Stats',
    batterStatcast: 'Statcast Batting Stats'
  };
  
  export { columnMappings, tableMappings };
  