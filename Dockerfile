# Utiliser une image Node.js comme base
FROM node:22-alpine

ARG DATABASE_URL

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json du monorepo
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances du monorepo
RUN npm install

# Copier le reste des fichiers de l'application backend
COPY . .

# Construire l'application Nest.js
RUN npm run build

# Exposer le port sur lequel l'application va tourner
EXPOSE 8000

# Démarrer l'application
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]