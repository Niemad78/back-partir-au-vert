# Utiliser une image Node.js comme base
FROM node:22-alpine

ARG DATABASE_URL

RUN corepack enable && corepack prepare pnpm@latest --activate

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json du repo
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY prisma ./prisma/

# Installer les dépendances du repo
RUN pnpm install

# Copier le reste des fichiers de l'application backend
COPY . .

# Construire l'application Nest.js
RUN pnpm run build

# Exposer le port sur lequel l'application va tourner
EXPOSE 8000

# Démarrer l'application
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm start"]