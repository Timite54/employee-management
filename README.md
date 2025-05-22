# Ce que vous visez
**Point de contrôle : Hébergement d'une application MERN sur Microsoft Azure**

**Objectif** : déployer une application de pile MERN sur la plateforme cloud Microsoft Azure.

## Instructions

**Préparez votre demande MERN :**

  - Assurez-vous que votre application MERN est entièrement développée et testée localement.
  - Assurez-vous que le backend de votre application (Node.js/Express) est connecté à MongoDB pour le stockage des données.

**Créer un compte Microsoft Azure :**
  - Si vous ne l’avez pas déjà fait, créez un compte Microsoft Azure.
  - Accédez au portail Azure et accédez au tableau de bord.

**Configurer MongoDB Atlas :**
  - Étant donné qu’Azure ne propose pas directement MongoDB en tant que service, utilisez MongoDB Atlas (le service cloud de MongoDB) pour votre base de données.
  - Créez un compte MongoDB Atlas si vous n'en avez pas déjà un.
  - Créez un nouveau cluster MongoDB et configurez-le en fonction des exigences de votre application.

**Préparez votre application MERN pour le déploiement :**
  - Mettez à jour la configuration de votre application MERN pour utiliser des variables d’environnement pour les données sensibles telles que les informations d’identification de la base de données.
  - Créez votre frontend React pour la production en utilisant **npm run build.**

**Créer un service d’application Web Azure :**
  - Dans le portail Azure, accédez à « Créer une ressource » > « Web » > « Application Web ».
  - Remplissez les détails requis tels que le nom de l'application, le groupe de ressources et la région.
  - Choisissez le niveau de tarification approprié en fonction de vos besoins.

**Configurer la source de déploiement :**
  - Dans les paramètres de votre application Web Azure, accédez à « Centre de déploiement ».
  - Choisissez la source de déploiement comme « Git local » ou connectez-vous à votre système de contrôle de version préféré (par exemple, GitHub).
 
 **Déployez votre application MERN :**
  - Si vous utilisez Git local, clonez le référentiel Git de votre application Web Azure sur votre machine locale.
  - Copiez vos fichiers frontend React créés dans un dossier de votre projet backend (par exemple, **server/public** ).
  - Validez et transmettez vos modifications vers le référentiel Git d’Azure.
  - Azure détectera automatiquement les modifications et déploiera votre application.

**Configurer les variables d’environnement :**
  - Dans les paramètres de votre application Web Azure, accédez à « Configuration ».
  - Définissez les variables d’environnement pour votre application MERN, y compris la chaîne de connexion MongoDB et d’autres configurations requises.

**Testez votre application MERN déployée :**
  - Accédez à votre application MERN déployée via l’URL fournie par Azure.
  - Testez toutes les fonctionnalités pour garantir un déploiement et une connectivité de base de données appropriés.

# [LIEN DE L'APPLICATION DEPLOYEE](https://emplomanagement.netlify.app/)
