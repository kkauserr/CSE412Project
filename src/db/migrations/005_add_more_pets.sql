-- Add more dogs
INSERT INTO pet (shelter_id, name, species, breed, sex, age_months, weight_kg, description, status)
VALUES
  (1, 'Luna', 'Dog', 'Labrador Retriever', 'Female', 24, 25.5, 'Luna is a friendly and energetic Labrador who loves to play fetch and swim. She''s great with kids and other dogs.', 'available'),
  (1, 'Max', 'Dog', 'German Shepherd', 'Male', 36, 32.0, 'Max is a well-trained German Shepherd with a calm demeanor. He''s protective and loyal, perfect for families.', 'available'),
  (2, 'Bella', 'Dog', 'Poodle', 'Female', 48, 12.5, 'Bella is a hypoallergenic Poodle with a gentle nature. She''s great for apartment living and loves to cuddle.', 'available'),
  (2, 'Rocky', 'Dog', 'Rottweiler', 'Male', 18, 35.0, 'Rocky is a young Rottweiler with lots of energy. He needs an experienced owner who can provide training and exercise.', 'available'),
  (3, 'Daisy', 'Dog', 'Beagle', 'Female', 12, 10.0, 'Daisy is a curious Beagle puppy who loves to explore. She''s great with other pets and enjoys long walks.', 'available'),
  (1, 'Charlie', 'Dog', 'Golden Retriever', 'Male', 72, 30.0, 'Charlie is a senior Golden Retriever with a heart of gold. He''s calm, well-behaved, and great with everyone.', 'available'),
  (2, 'Molly', 'Dog', 'Shih Tzu', 'Female', 36, 5.5, 'Molly is a small but spirited Shih Tzu. She''s perfect for apartment living and loves to be pampered.', 'available'),
  (3, 'Duke', 'Dog', 'Husky', 'Male', 24, 27.0, 'Duke is an active Husky who needs lots of exercise. He''s great for outdoor enthusiasts and active families.', 'available');

-- Add more cats
INSERT INTO pet (shelter_id, name, species, breed, sex, age_months, weight_kg, description, status)
VALUES
  (1, 'Oliver', 'Cat', 'Persian', 'Male', 36, 5.0, 'Oliver is a laid-back Persian cat who loves to lounge. He''s perfect for a quiet home.', 'available'),
  (2, 'Lucy', 'Cat', 'Siamese', 'Female', 24, 4.0, 'Lucy is a vocal Siamese who loves attention. She''s intelligent and forms strong bonds with her humans.', 'available'),
  (3, 'Milo', 'Cat', 'Maine Coon', 'Male', 48, 8.0, 'Milo is a gentle giant Maine Coon. He''s great with kids and other pets.', 'available'),
  (1, 'Sophie', 'Cat', 'Ragdoll', 'Female', 12, 3.5, 'Sophie is a young Ragdoll who loves to follow her humans around. She''s gentle and affectionate.', 'available'),
  (2, 'Leo', 'Cat', 'Bengal', 'Male', 24, 5.5, 'Leo is an active Bengal cat who needs lots of playtime. He''s great for experienced cat owners.', 'available'),
  (3, 'Lily', 'Cat', 'British Shorthair', 'Female', 60, 4.5, 'Lily is a calm British Shorthair who enjoys a peaceful home. She''s independent but affectionate.', 'available');

-- Add other pets
INSERT INTO pet (shelter_id, name, species, breed, sex, age_months, weight_kg, description, status)
VALUES
  (1, 'Thumper', 'Rabbit', 'Holland Lop', 'Male', 12, 1.5, 'Thumper is a friendly Holland Lop who loves to hop around. He''s litter-trained and good with handling.', 'available'),
  (2, 'Cotton', 'Rabbit', 'Netherland Dwarf', 'Female', 24, 1.0, 'Cotton is a tiny but spunky rabbit. She''s perfect for first-time rabbit owners.', 'available'),
  (3, 'Buddy', 'Bird', 'Cockatiel', 'Male', 36, 0.1, 'Buddy is a friendly Cockatiel who loves to whistle. He''s hand-tamed and enjoys human company.', 'available'),
  (1, 'Rio', 'Bird', 'Budgie', 'Male', 12, 0.035, 'Rio is a young, energetic Budgie who loves to play with toys. He''s learning to talk.', 'available'),
  (2, 'Snowball', 'Rabbit', 'Mini Rex', 'Female', 18, 1.8, 'Snowball is a soft Mini Rex with a gentle personality. She loves to be petted.', 'available');

-- Add photos for new pets
INSERT INTO pet_photo (pet_id, url, sort_order)
SELECT 
  p.id,
  CASE p.species
    WHEN 'Dog' THEN 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'
    WHEN 'Cat' THEN 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'
    WHEN 'Rabbit' THEN 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308'
    ELSE 'https://images.unsplash.com/photo-1552728089-57bdde30beb3'
  END,
  1
FROM pet p
WHERE NOT EXISTS (
  SELECT 1 FROM pet_photo pp WHERE pp.pet_id = p.id
); 