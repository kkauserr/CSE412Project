-- Initialize pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Try to create PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pet_status') THEN
        CREATE TYPE pet_status AS ENUM ('available', 'adopted');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('adopter', 'shelter_admin');
    END IF;
END $$;

-- Create tables
CREATE TABLE IF NOT EXISTS shelter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_login VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location POINT, -- Changed from GEOGRAPHY to POINT for PostgreSQL compatibility
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pet (
    id SERIAL PRIMARY KEY,
    shelter_id INTEGER REFERENCES shelter(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    sex VARCHAR(10) NOT NULL,
    weight_kg DECIMAL(5,2) CHECK (weight_kg > 0),
    age_months INTEGER CHECK (age_months >= 0),
    description TEXT,
    status pet_status DEFAULT 'available',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pet_photo (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER REFERENCES pet(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (pet_id, sort_order)
);

CREATE TABLE IF NOT EXISTS user_account (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preference (
    user_id INTEGER PRIMARY KEY REFERENCES user_account(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiry (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER REFERENCES pet(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES user_account(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL,
    diff JSONB NOT NULL,
    actor_id INTEGER REFERENCES user_account(id) ON DELETE SET NULL,
    occurred_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS pet_shelter_id_idx ON pet(shelter_id);
CREATE INDEX IF NOT EXISTS pet_status_idx ON pet(status);
CREATE INDEX IF NOT EXISTS pet_species_idx ON pet(species);
CREATE INDEX IF NOT EXISTS pet_description_trgm_idx ON pet USING gin(description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS shelter_location_idx ON shelter USING gist(location);
CREATE INDEX IF NOT EXISTS inquiry_pet_id_idx ON inquiry(pet_id);
CREATE INDEX IF NOT EXISTS inquiry_user_id_idx ON inquiry(user_id);
CREATE INDEX IF NOT EXISTS audit_log_table_record_idx ON audit_log(table_name, record_id);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, record_id, action, diff, actor_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), current_setting('app.current_user_id', true)::integer);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, record_id, action, diff, actor_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', 
            jsonb_build_object(
                'old', row_to_json(OLD),
                'new', row_to_json(NEW)
            ),
            current_setting('app.current_user_id', true)::integer
        );
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, record_id, action, diff, actor_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), current_setting('app.current_user_id', true)::integer);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers
DROP TRIGGER IF EXISTS pet_audit_trigger ON pet;
CREATE TRIGGER pet_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON pet
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

DROP TRIGGER IF EXISTS shelter_audit_trigger ON shelter;
CREATE TRIGGER shelter_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON shelter
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers
DROP TRIGGER IF EXISTS update_shelter_updated_at ON shelter;
CREATE TRIGGER update_shelter_updated_at
    BEFORE UPDATE ON shelter
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pet_updated_at ON pet;
CREATE TRIGGER update_pet_updated_at
    BEFORE UPDATE ON pet
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_account_updated_at ON user_account;
CREATE TRIGGER update_user_account_updated_at
    BEFORE UPDATE ON user_account
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preference_updated_at ON user_preference;
CREATE TRIGGER update_user_preference_updated_at
    BEFORE UPDATE ON user_preference
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 