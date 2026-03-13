# Feature — Authentification (EP-01)

> **Sprint 1** · Backend Laravel · Statut : ✅ Done

Système d'authentification complet de GW2Nexus. Gère l'intégralité du cycle de vie d'une session utilisateur : inscription, connexion, déconnexion et réinitialisation de mot de passe. Exposé via une API REST sécurisée par Laravel Sanctum.

---

## Sommaire

- [Architecture](#architecture)
- [Endpoints](#endpoints)
- [Sécurité](#sécurité)
- [Structure des fichiers](#structure-des-fichiers)
- [Lancer les tests](#lancer-les-tests)
- [Exemples de requêtes](#exemples-de-requêtes)

---

## Architecture

```
Client (React)
    │
    │  HTTP + Bearer Token
    ▼
routes/api.php          ← Définition des routes v1/auth/*
    │
    ▼
FormRequest             ← Validation et rate limiting (LoginRequest)
    │
    ▼
Controller              ← Logique métier légère (Register / Login / Logout / Password)
    │
    ▼
UserResource            ← Sérialisation sécurisée (masque api_key, password)
    │
    ▼
Sanctum Token           ← Bearer token persisté dans personal_access_tokens
```

Tous les tokens sont de type **Bearer** (Sanctum Token API). Le frontend doit stocker le token retourné à la connexion et l'envoyer dans chaque requête protégée :

```
Authorization: Bearer <token>
```

---

## Endpoints

### Publics — aucun token requis

| Méthode | Route | Contrôleur | Description |
|---------|-------|------------|-------------|
| `POST` | `/api/v1/auth/register` | `RegisterController@store` | Créer un compte |
| `POST` | `/api/v1/auth/login` | `LoginController@store` | Se connecter |
| `POST` | `/api/v1/auth/forgot-password` | `ForgotPasswordController@store` | Demander un lien de réinitialisation |
| `POST` | `/api/v1/auth/reset-password` | `ResetPasswordController@store` | Réinitialiser le mot de passe |

### Protégés — `Authorization: Bearer <token>` obligatoire

| Méthode | Route | Contrôleur | Description |
|---------|-------|------------|-------------|
| `GET` | `/api/v1/auth/me` | `MeController` | Récupérer l'utilisateur connecté |
| `POST` | `/api/v1/auth/logout` | `LogoutController@destroy` | Déconnexion (session courante) |
| `POST` | `/api/v1/auth/logout-all` | `LogoutController@destroyAll` | Déconnexion globale (tous les appareils) |

---

## Sécurité

### Rate limiting — LoginController

Les tentatives de connexion sont limitées à **5 par minute** par couple `(email + IP)`. Au-delà, Laravel retourne un `422` avec le temps d'attente restant. Le compteur se remet à zéro automatiquement après une connexion réussie.

Implémenté dans `LoginRequest` via les méthodes :
- `ensureIsNotRateLimited()` — vérifie avant chaque tentative
- `incrementRateLimiter()` — incrémente en cas d'échec
- `clearRateLimiter()` — remet à zéro en cas de succès

### Protection anti-énumération — ForgotPasswordController

La réponse HTTP est identique (`200`) que l'adresse email existe ou non en base. Aucun message ne confirme ou n'infirme l'existence d'un compte.

### Chiffrement de la clé API GW2

La colonne `api_key` est chiffrée via le cast `'encrypted'` d'Eloquent (AES-256-CBC, clé `APP_KEY`). Elle est également exclue de toutes les réponses JSON via `$hidden` sur le modèle et `UserResource`.

### Mots de passe

Hashés via `bcrypt` (cast `'hashed'` du modèle `User`). Jamais stockés ou transmis en clair.

### Token de réinitialisation

Usage unique — supprimé de `password_reset_tokens` immédiatement après utilisation. Expire après 60 minutes (configurable dans `config/auth.php`).

---

## Structure des fichiers

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Auth/
│   │   │   ├── RegisterController.php     # Inscription
│   │   │   ├── LoginController.php        # Connexion + rate limiting
│   │   │   ├── LogoutController.php       # Déconnexion simple et globale
│   │   │   ├── MeController.php           # Utilisateur courant
│   │   │   ├── ForgotPasswordController.php
│   │   │   └── ResetPasswordController.php
│   │   ├── Requests/Auth/
│   │   │   ├── RegisterRequest.php        # Validation inscription
│   │   │   ├── LoginRequest.php           # Validation + rate limiter
│   │   │   ├── ForgotPasswordRequest.php
│   │   │   └── ResetPasswordRequest.php
│   │   └── Resources/
│   │       └── UserResource.php           # Sérialisation sécurisée du User
│   └── Models/
│       └── User.php                       # HasApiTokens + SoftDeletes + casts
├── database/
│   ├── factories/
│   │   └── UserFactory.php                # États : admin(), moderateur(), avecApiKey()
│   └── migrations/
│       └── xxxx_create_users_table.php    # users + password_reset_tokens + sessions
├── routes/
│   └── api.php                            # Routes v1/auth/* (publiques + protégées)
└── tests/
    └── Feature/Auth/
        └── AuthTest.php                   # 16 tests, 50+ assertions
```

---

## Lancer les tests

```bash
# Tous les tests de la feature auth
docker compose exec laravel php artisan test --filter AuthTest

# Avec détail des assertions
docker compose exec laravel php artisan test --filter AuthTest --verbose
```

**Résultat attendu :**

```
PASS  Tests\Feature\Auth\AuthTest
✓ un utilisateur peut s inscrire avec des donnees valides
✓ l inscription echoue si l email est deja utilise
✓ l inscription echoue si la confirmation de mot de passe ne correspond pas
✓ l inscription echoue si le mot de passe est trop court
✓ le mot de passe est stocke hache en base
✓ un utilisateur peut se connecter avec ses identifiants
✓ la connexion echoue avec un mauvais mot de passe
✓ la connexion est bloquee apres 5 tentatives echouees
✓ un utilisateur authentifie peut se deconnecter
✓ un utilisateur peut se deconnecter de tous ses appareils
✓ un utilisateur non authentifie ne peut pas acceder aux routes protegees
✓ une demande de reinitialisation retourne toujours 200
✓ un utilisateur peut reinitialiser son mot de passe avec un token valide
✓ la reinitialisation echoue avec un token invalide
✓ un utilisateur authentifie peut recuperer ses informations
✓ un visiteur ne peut pas acceder a la route me

Tests: 16 passed
```

> **Prérequis** : la base `app_test` doit exister. Création unique :
> ```bash
> docker compose exec mysql mysql -u app -ppassword -e \
>   "CREATE DATABASE IF NOT EXISTS app_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
> ```

---

## Exemples de requêtes

### Inscription

```bash
curl -X POST http://localhost/api/v1/auth/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Gardien des Brumes",
    "email": "joueur@example.com",
    "password": "MotDePasse123!",
    "password_confirmation": "MotDePasse123!"
  }'
```

```json
{
  "message": "Compte créé avec succès. Bienvenue sur GW2Nexus !",
  "user": {
    "id": 1,
    "nom": "Gardien des Brumes",
    "email": "joueur@example.com",
    "role": "user",
    "pseudo_gw2": null,
    "avatar": null,
    "has_api_key": false,
    "email_verified": false,
    "created_at": "2026-03-13T10:00:00+00:00"
  },
  "token": "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### Connexion

```bash
curl -X POST http://localhost/api/v1/auth/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joueur@example.com",
    "password": "MotDePasse123!"
  }'
```

### Récupérer l'utilisateur connecté

```bash
curl -X GET http://localhost/api/v1/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Déconnexion

```bash
curl -X POST http://localhost/api/v1/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

## Codes de réponse

| Code | Contexte |
|------|----------|
| `200` | Succès (connexion, déconnexion, me, reset-password, forgot-password) |
| `201` | Ressource créée (inscription) |
| `401` | Credentials incorrects ou token absent/invalide |
| `422` | Erreur de validation ou rate limiting atteint |
| `500` | Erreur serveur (vérifier `APP_KEY` dans `phpunit.xml` pour les tests) |

---

*GW2Nexus · Feature Auth · Sprint 1 · Laravel 11 + Sanctum*