CREATE TABLE IF NOT EXISTS prescription (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    ocr_text TEXT,
    translated_text TEXT,
    simplified_text TEXT,
    source_language VARCHAR(10) DEFAULT 'en',
    target_language VARCHAR(10),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_prescription_user_id ON prescription(user_id);
CREATE INDEX idx_prescription_status ON prescription(status);
CREATE INDEX idx_prescription_created_at ON prescription(created_at DESC);
CREATE INDEX idx_prescription_user_created ON prescription(user_id, created_at DESC);


COMMENT ON TABLE prescription IS 'Stores uploaded prescription images and AI processing results';
COMMENT ON COLUMN prescription.image_url IS 'File path or URL to uploaded prescription image';
COMMENT ON COLUMN prescription.status IS 'Processing status: pending (uploaded), processing (AI running), completed (ready), failed (error)';
COMMENT ON COLUMN prescription.ocr_text IS 'Raw text extracted by Google Vision OCR';
COMMENT ON COLUMN prescription.translated_text IS 'OCR text translated to user preferred language';
COMMENT ON COLUMN prescription.simplified_text IS 'Medical jargon simplified by Gemini AI';