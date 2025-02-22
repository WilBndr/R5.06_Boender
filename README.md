# R5.06_Boender

## Objectif du projet
Le projet vise à développer une API permettant de gérer des films et des utilisateurs. Les utilisateurs peuvent ajouter des films à leur liste de favoris et les supprimer. De plus, un système de notification par email est mis en place pour informer les utilisateurs.

## Installation

1. **Installer les dépendances**  
   Exécutez la commande suivante pour installer les dépendances nécessaires à votre projet :

    ```bash
    npm install
    ```
2. **Créer un fichier `.env`**
Ajouter les variables d'environnement suivantes dans le fichier `.env` a creer a la racine du projet:

    ```env
    MAIL_HOST=smtp.ethereal.email
    MAIL_PORT=587
    MAIL_USER=linwood79@ethereal.email
    MAIL_PASS=371cC8QMt6pf36tUUa
    ```

## Lancer les migrations

### Prérequis : Avoir la table `user` au préalable

3. **Annuler les migrations précédentes**  
   Si vous avez besoin de revenir à un état initial, exécutez cette commande pour annuler toutes les migrations :

    ```bash
    npx knex migrate:rollback --all
    ```

4. **Exécuter les migrations**  
   Pour appliquer les dernières migrations à votre base de données, exécutez :

    ```bash
    npx knex migrate:latest
    ```

## Lancer le worker

5. **Démarrer le worker d'exportation**  
   Une fois les migrations effectuées, vous pouvez démarrer le worker pour gérer les tâches d'exportation. Exécutez cette commande :

    ```bash
    node lib/workers/workerExport.js
    ```

## Lancer un conteneur Docker pour RabbitMQ

### Prérequis : Utilisation de Docker sur Windows
6. **Démarrer un conteneur RabbitMQ**  
   Si vous utilisez Windows, exécutez cette commande pour démarrer un conteneur RabbitMQ avec l'interface de gestion :

    ```bash
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
    ```

## Lancer le projet

7. **Démarrer le serveur**  
   Après avoir configuré votre base de données et démarré RabbitMQ, lancez votre projet avec la commande suivante :

    ```bash
    npm start
    ```

---

# Quelques précisions

## Dépendances

Le projet utilise les technologies suivantes :

- `express`
- `knex`
- `mysql`
- `nodemailer`
- `amqplib`
- `dotenv`
- `jsonwebtoken`
- `bcrypt`
- `body-parser`
- `cors`
- `nodemon`

## Accéder à l'interface de gestion RabbitMQ

L'interface de gestion RabbitMQ est accessible à l'adresse suivante :

- [http://localhost:15672](http://localhost:15672)
- **Login** : `guest`
- **Mot de passe** : `guest`

Vous pouvez voir la queue `export_csv` dans la section **"Queues and streams"**.

## Accéder à l'interface de l'API

L'interface de l'API (documentation Swagger) est disponible à l'adresse suivante :

- [http://localhost:3000/documentation](http://localhost:3000/documentation)

### Accès aux routes protégées

Pour accéder aux routes protégées, vous devez ajouter le **Bearer Token** dans l'onglet **Authorize** en utilisant le format suivant :

- `Bearer <token>`

Le token est généré lors de la création d'un utilisateur et est retourné dans le corps de la réponse.

## Pour voir les mails envoyés

Lors du developpement nous avons utilisé [ethereal](https://ethereal.email/) pour visualiser les mails envoyés.

- Il suffit de se rendre sur le lien suivant : [https://ethereal.email/login](https://ethereal.email/login)
- Utiliser les identifiants suivants :
  - **Login** : `linwood79@ethereal.email`
  - **Mot de passe** : `371cC8QMt6pf36tUUa`
  - Ensuite vous pouvez voir les mails envoyés dans la section **Messages**
