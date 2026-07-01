# CI/CD

## État actuel

Seule la CI (intégration continue) est en place. La CD (déploiement automatique
vers le VPS OVH) est hors périmètre tant qu'aucun secret GitHub n'est configuré
pour l'accès SSH ; `scripts/deploy.sh` et `docker-compose.prod.yml` existent déjà
mais ne sont pas encore déclenchés automatiquement.

## Pipeline CI — `.github/workflows/ci.yml`

Déclenchée sur chaque `push` (`main`, `develop`, `feature/**`) et chaque
`pull_request` vers `main` ou `develop`.

### Job `backend`

| Étape | Commande |
| --- | --- |
| Dépendances | `composer install --no-interaction --prefer-dist --no-progress` |
| Style | `php vendor/bin/pint --test` |
| Tests | `php artisan test` (SQLite en mémoire, config déjà dans `backend/phpunit.xml`) |

PHP 8.4 (aligné sur `backend/Dockerfile` et le `composer.lock`).

### Job `frontend`

| Étape | Commande |
| --- | --- |
| Dépendances | `npm ci` |
| Typecheck | `npx tsc -b --noEmit --pretty false` |
| Lint | `npm run lint` |
| Build | `npm run build` |

Node 22.

## Pipeline CD — `.github/workflows/cd.yml`

Fichier présent mais vide. À implémenter dans une étape séparée, une fois :

- les secrets GitHub Actions créés (ex. `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`) ;
- `backend/docker-entrypoint.prod.sh`, `frontend/Dockerfile.prod` et
  `.env.prod.example` ajoutés (référencés par `docker-compose.prod.yml` mais
  absents du dépôt à ce jour).

L'objectif visé : sur merge vers `main`, se connecter en SSH au VPS et exécuter
`scripts/deploy.sh`, qui fait déjà `git reset --hard origin/main` puis
`docker compose -f docker-compose.prod.yml build && up -d --force-recreate`.
