# iut-project


Ce projet est une application Node.js basée sur **Hapi.js**, conçue pour gérer des interactions avec une base de données relationnelle (MySQL/SQLite) et fournir des services REST sécurisés.

## Installation
1. Clonez le projet :
   ```bash
   git clone https://github.com/lhuissier4/iut-project.git
   cd iut-project
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

   La configuration du mail se fait dans un fichier `.env` à la racine du projet.  
   Créez une addresse email sur [Ethereal](https://ethereal.email/) pour tester l'envoie de mail.
   Créez le fichier `.env` et ajoutez les variables suivantes :

   ```.env
   SMTP_HOST=smtp.ethereal.email
   SMTP_PORT=587
   SMTP_USER=youremail@ethereal.email
   SMTP_PASS=yourpassword
   ```

### Démarrer le serveur
Démarrez le projet avec la commande suivante :
```bash
npm start
```
## Gestion de la base de données
Le projet utilise **Knex.js** pour gérer les migrations et la connexion à la base de données.

### Annuler les dernières migrations
```bash
npx knex migrate:rollback
```

### Exécuter les migrations
```bash
npx knex migrate:latest
```

## API Endpoints
### Favorite

-  **POST** `/favorite` - Ajouter et récupérer un film dans la liste des favoris
- **DELETE** `/favorite` - Supprimer un film des favoris par ID de film et ID utilisateur

### Movie

- **POST** `/movie` - Créer et récupérer un film
- **DELETE** `/movie/{id}` - Supprimer un film par ID
- **PATCH** `/movie/{id}` - Modifier et récupérer un film
- **GET** `/movie/export` - Exporter la liste des films en CSV

### User

- **POST** `/user` - Créer et récupérer un utilisateur
- **DELETE** `/user/{id}` - Supprimer un utilisateur par ID
- **PATCH** `/user/{id}` - Modifier et récupérer un utilisateur
- **POST** `/user/login` - Authentifier un utilisateur par email ou nom d'utilisateur et renvoyer un token JWT

### Users

- **GET** `/users` - Récupérer tous les utilisateurs
