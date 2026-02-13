CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dateOfBirth DATE,
    preferred_language VARCHAR(10) default 'en',
    role VARCHAR(20) default 'patient' CHECK (role IN ('patient', 'caregiver', 'admin')),
    is_active BOOLEAN DEFAULT true,
    profile_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastLogin TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);

CREATE INDEX IF NOT EXISTS idx_users_active_created ON users(is_active, created_at DESC);

COMMENT ON TABLE users IS 'Stores user accounts for patients, caregivers, and admins';

COMMENT ON COLUMN users.password_hash IS 'ByCryptic hash password.';
COMMENT ON COLUMN users.preferred_language IS 'Using  language code';
COMMENT ON COLUMN users.role IS 'User role ; patient(self-managed), caregiver(manage others), admin(admin)';
COMMENT ON COLUMN users.is_active IS 'false = soft deletetion. Better than using DELETE';
