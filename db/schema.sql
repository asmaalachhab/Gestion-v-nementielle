-- ============================
-- DATABASE
-- ============================
CREATE DATABASE IF NOT EXISTS event_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE event_management;

-- ============================
-- TABLE: roles
-- ============================
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom ENUM('ADMIN', 'ORGANISATEUR', 'CLIENT') NOT NULL
);

-- ============================
-- TABLE: users
-- ============================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    enabled BOOLEAN DEFAULT TRUE,
    date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================
-- TABLE: user_roles (N-N)
-- ============================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_role_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_user_role_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- ============================
-- TABLE: categories
-- ============================
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- ============================
-- TABLE: regions
-- ============================
CREATE TABLE IF NOT EXISTS regions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL
);

-- ============================
-- TABLE: events
-- ============================
CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_event DATE NOT NULL,
    heure_debut TIME NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    nb_vues INT DEFAULT 0,
    statut ENUM('BROUILLON', 'PUBLIE', 'ANNULE') DEFAULT 'BROUILLON',

    categorie_id BIGINT NOT NULL,
    region_id BIGINT NOT NULL,
    organisateur_id BIGINT NOT NULL,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_event_categorie
        FOREIGN KEY (categorie_id) REFERENCES categories(id),

    CONSTRAINT fk_event_region
        FOREIGN KEY (region_id) REFERENCES regions(id),

    CONSTRAINT fk_event_organisateur
        FOREIGN KEY (organisateur_id) REFERENCES users(id)
);

-- ============================
-- TABLE: offers
-- ============================
CREATE TABLE IF NOT EXISTS offers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    type_billet VARCHAR(100) NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    places_initiales INT NOT NULL,
    places_disponibles INT NOT NULL,
    date_expiration DATE NOT NULL,

    event_id BIGINT NOT NULL,

    CONSTRAINT fk_offer_event
        FOREIGN KEY (event_id) REFERENCES events(id)
);

-- ============================
-- TABLE: reservations
-- ============================
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code_reservation VARCHAR(50) NOT NULL UNIQUE,
    date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
    nb_places INT NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL,
    statut ENUM('EN_ATTENTE', 'CONFIRMEE', 'ANNULEE') DEFAULT 'EN_ATTENTE',

    user_id BIGINT NOT NULL,
    offer_id BIGINT NOT NULL,

    CONSTRAINT fk_reservation_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    CONSTRAINT fk_reservation_offer
        FOREIGN KEY (offer_id) REFERENCES offers(id)
);

-- ============================
-- TABLE: statistiques
-- ============================
CREATE TABLE IF NOT EXISTS statistiques (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    date_consultation DATE NOT NULL,
    nb_vues INT DEFAULT 0,
    nb_reservations INT DEFAULT 0,
    chiffre_affaires DECIMAL(12,2) DEFAULT 0,

    event_id BIGINT NOT NULL,

    CONSTRAINT fk_stat_event
        FOREIGN KEY (event_id) REFERENCES events(id)
);
