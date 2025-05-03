CREATE TABLE adopter_preferences (
  user_id INTEGER PRIMARY KEY REFERENCES user_account(id),
  species VARCHAR(50),
  min_age_months INTEGER,
  max_age_months INTEGER,
  min_weight_kg NUMERIC(5,2),
  max_weight_kg NUMERIC(5,2),
  activity_level VARCHAR(50),
  living_space VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 