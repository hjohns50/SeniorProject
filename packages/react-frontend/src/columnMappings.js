// react-frontend/src/columnMappings.js

const columnMappings = {
    batterBasic: {
        name: 'Name (Last, First)',
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
    }
  };
  
  const tableMappings = {
    batterBasic: 'Basic Batting Stats',
  };
  
  export { columnMappings, tableMappings };
  