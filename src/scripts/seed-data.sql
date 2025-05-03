-- Insert sample shelters
INSERT INTO shelter (name, email_login, hashed_password, address, phone)
VALUES
  ('Happy Tails Rescue', 'contact@happytails.org', '$2b$10$dZvw0yXkNyYr1GxRwF9tqeYf.QK/KzpXqY8x8q9xZ9xZ9xZ9xZ9xZ', '123 Pet Lane, San Francisco, CA 94110', '555-0123'),
  ('Paws & Love', 'info@pawsandlove.org', '$2b$10$dZvw0yXkNyYr1GxRwF9tqeYf.QK/KzpXqY8x8q9xZ9xZ9xZ9xZ9xZ', '456 Animal Ave, Oakland, CA 94601', '555-0124'),
  ('Forever Friends', 'adopt@foreverfriends.org', '$2b$10$dZvw0yXkNyYr1GxRwF9tqeYf.QK/KzpXqY8x8q9xZ9xZ9xZ9xZ9xZ', '789 Rescue Road, Berkeley, CA 94704', '555-0125');

-- Insert sample pets
INSERT INTO pet (shelter_id, name, species, breed, sex, weight_kg, age_months, description, status)
VALUES
  (1, 'Luna', 'Dog', 'Golden Retriever', 'F', 25.5, 24, 'Friendly and energetic Golden Retriever who loves to play fetch', 'available'),
  (1, 'Oliver', 'Cat', 'Maine Coon', 'M', 6.8, 36, 'Gentle giant with a luxurious coat and friendly personality', 'available'),
  (2, 'Rocky', 'Dog', 'German Shepherd', 'M', 32.0, 48, 'Well-trained and protective, great with families', 'available'),
  (2, 'Milo', 'Cat', 'Siamese', 'M', 4.2, 12, 'Playful and vocal Siamese with striking blue eyes', 'available'),
  (3, 'Bella', 'Dog', 'Labrador Mix', 'F', 22.7, 18, 'Sweet and gentle Lab mix who loves cuddles', 'available'),
  (3, 'Charlie', 'Dog', 'Poodle', 'M', 8.5, 60, 'Senior poodle looking for a quiet home', 'available'),
  (1, 'Lucy', 'Cat', 'Domestic Shorthair', 'F', 3.5, 8, 'Energetic kitten who loves to explore', 'available'),
  (2, 'Max', 'Dog', 'Beagle', 'M', 12.8, 30, 'Friendly beagle with a great nose for adventure', 'available');

-- Insert sample pet photos
INSERT INTO pet_photo (pet_id, url, sort_order)
VALUES
  (1, 'https://images.unsplash.com/photo-1552053831-71594a27632d', 1),
  (2, 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec', 1),
  (3, 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95', 1),
  (4, 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8', 1),
  (5, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb', 1),
  (6, 'https://images.unsplash.com/photo-1591946614720-90a587da4a36', 1),
  (7, 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e', 1),
  (8, 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8', 1); 