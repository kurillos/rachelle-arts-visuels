CREATE TABLE `carousels` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, -- Clé primaire unique pour chaque entrée
  `image_url` VARCHAR(255) NOT NULL,          -- Chemin de l'image (obligatoire)
  `title` VARCHAR(255) DEFAULT NULL,          -- Titre de l'image (optionnel)
  `description` TEXT DEFAULT NULL,            -- Description de l'image (optionnel)
  `created_at` TIMESTAMP NULL DEFAULT NULL,   -- Horodatage de la création
  `updated_at` TIMESTAMP NULL DEFAULT NULL,   -- Horodatage de la dernière mise à jour
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note : Le moteur de stockage InnoDB est utilisé pour les transactions et l'intégrité référentielle.
-- Le jeu de caractères utf8mb4 prend en charge une large gamme de caractères, y compris les emojis.

INSERT INTO `carousels` (`image_url`, `title`, `description`) VALUES
('/images/carousels/1.jpg', 'Title 1', 'Description 1'),
('/images/carousels/2.jpg', 'Title 2', 'Description 2'),
('/images/carousels/3.jpg', 'Title 3', 'Description 3'),
('/images/carousels/4.jpg', 'Title 4', 'Description 4'),
('/images/carousels/5.jpg', 'Title 5', 'Description 5'),
('/images/carousels/6.jpg', 'Title 6', 'Description 6');