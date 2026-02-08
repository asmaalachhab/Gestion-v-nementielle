
# 🎟️ EventMa – Event Management Platform

Plateforme complète de **gestion d'évènements et réservations au Maroc**
Architecture découplée :

* 🔹 Backend : Spring Boot (API REST)
* 🔹 Frontend : React + Vite
* 🔹 Base de données : MySQL
* 🔹 Orchestration : Docker & Docker Compose

---

# 🚀 Lancer le projet (Docker)

## ✅ Pré-requis

* Docker
* Docker Compose

## ▶️ Démarrage

```bash
cd eventma
docker-compose up --build
```

## 🌐 Accès aux services

* Frontend : [http://localhost:3000](http://localhost:3000)
* Swagger UI : [http://localhost:8080/swagger](http://localhost:8080/swagger)
* API Docs : [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

# 👤 Comptes de test

Mot de passe pour tous :

```
password
```

| Rôle         | Email                                         |
| ------------ | --------------------------------------------- |
| Admin        | [admin@example.ma](mailto:admin@example.ma)   |
| Organisateur | [org@example.ma](mailto:org@example.ma)       |
| Client       | [client@example.ma](mailto:client@example.ma) |

---

# 🧠 Règles Métier

### 🔐 ORGANISATEUR

* Créé uniquement par l’Admin

### 🎫 Réservation

* Si places disponibles → **CONFIRMEE automatiquement**
* Sinon → **Erreur**

### ❌ Annulation

* Possible même si CONFIRMEE
* Seulement si l’évènement est à plus de 24h

### 🖼️ Image d’évènement

* Utilise une simple URL (`image_url`)

---

# 🏗️ Structure du Projet

```
eventma/
│
├── backend/          # API Spring Boot
├── frontend/         # Interface React + Vite
├── db/               # Script SQL (schema.sql)
└── docker-compose.yml
```

---

# 📸 Captures d’écran

## 🏠 Page d’accueil

<img width="1876" height="1003" alt="image" src="https://github.com/user-attachments/assets/663b3c16-06ea-42a6-9575-78439bc8bda0" />



## 🔍 Liste des évènements

<img width="1907" height="1009" alt="image" src="https://github.com/user-attachments/assets/4bcbbfcd-2ff8-41be-81d8-082293a4bb4a" />


---

## 📄 Détail d’un évènement

<img width="1916" height="1002" alt="image" src="https://github.com/user-attachments/assets/a4c28295-35fd-4914-ac6b-947d35017854" />


## 🛒 Page de réservation / Checkout

<img width="1903" height="1006" alt="image" src="https://github.com/user-attachments/assets/498a79b1-ab83-4e4c-b4c5-a7b75c4737fb" />


## 👨‍💼 Dashboard Organisateur

<img width="1906" height="1012" alt="image" src="https://github.com/user-attachments/assets/e6e15775-44de-45a6-84f3-ce0d9c086d20" />


## 🛠️ Panel Admin

<img width="1908" height="1001" alt="image" src="https://github.com/user-attachments/assets/30780f37-d997-4eb9-8f79-d4f8abc429ba" />


# 📊 Diagrammes UML

## Use Case

<img width="664" height="923" alt="image" src="https://github.com/user-attachments/assets/34abe16a-ab4a-4ff6-94b0-be5f0097aa72" />


## Class Diagram

<img width="1274" height="906" alt="image" src="https://github.com/user-attachments/assets/92d2ec51-bef8-4d38-b2c7-ab8a8355bf1f" />


# 🔧 Technologies utilisées

* Java 17
* Spring Boot
* Spring Security + JWT
* React
* Vite
* TailwindCSS
* MySQL
* Docker

---

# 📌 Améliorations Futures

* Paiement en ligne
* Upload d’images (Cloud Storage)
* Pagination & filtres avancés
* Notifications email

---

# 👩‍💻 Auteur

Asmaa Lachhab
Projet académique – Génie Informatique

