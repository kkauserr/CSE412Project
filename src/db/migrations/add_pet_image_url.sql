-- Add type column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'pet' AND column_name = 'type'
  ) THEN 
    ALTER TABLE pet ADD COLUMN type TEXT DEFAULT 'other';
    -- Set default types based on name or description if available
    UPDATE pet 
    SET type = CASE 
      WHEN LOWER(name) LIKE '%dog%' OR LOWER(name) LIKE '%puppy%' THEN 'dog'
      WHEN LOWER(name) LIKE '%cat%' OR LOWER(name) LIKE '%kitten%' THEN 'cat'
      ELSE 'other'
    END;
  END IF;
END $$;

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'pet' AND column_name = 'image_url'
  ) THEN 
    ALTER TABLE pet ADD COLUMN image_url TEXT;
  END IF;
END $$; 