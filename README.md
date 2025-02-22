# R5.06_Boender
## EXECUTER LES COMMANDES DANS L'ORDRE


## Installation
    
    ```bash
    npm i
    ```

## Lancer les migrations
### Avoir au prealabe la table user

    ```bash
    npx knex migrate:rollback --all   
    ```
    ```bash
    npx knex migrate:latest
    ```

## Lancer le worker

    ```bash
    node lib/workers/workerExport.js
    ```
## Lancer un container docker pour rabbitmq
### J'utilise windows

    ```bash
    docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
    ```

## Lancer le projet

    ```bash
    npm start
    ```


# Quelques precisions

Obejctif du projet : Le projet vise a develloper ubne api permettant de gerer des films et des utilisateurs. Les utilisateurs peuvent ajouter des films a leur liste de favoris et les supprimer. De plus on met en plqce un systeme de mail pour notifier l'utilisateur.

Depandance :
    - express
    - knex
    - mysql
    - nodemailer
    - amqplib
    - dotenv
    - jsonwebtoken
    - bcrypt
    - body-parser
    - cors
    - nodemon

Pour acceder a linterface de test de rabbitmq :
    - http://localhost:15672
    - login : guest
    - password : guest
Notre channel export_csv et visible dans la section "Queues and streams"

Pour acceder a linterface de test de lapi :
    - http://localhost:3000/documentation
    - Pour les routes proteger il faut ajouter "Bearer <le Token>" au niveau du bouton Authorize 
        - Le token est generer lors de la creation dun user et est retourner dans le body de la reponse