# Base de données — Schéma

**SGBD :** MySQL 8.0  
**Charset :** utf8mb4 / utf8mb4_unicode_ci  
**Migrations :** 10 fichiers dans `backend/database/migrations/`

---

## Table `users`

Table principale des comptes utilisateurs.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `nom` | varchar(100) | NO | | Nom d'affichage |
| `email` | varchar(255) | NO | | Email unique (login) |
| `password` | varchar(255) | NO | | Hash bcrypt (rounds:12) |
| `pseudo_gw2` | varchar(100) | YES | NULL | Pseudo GW2 (Nom.1234) |
| `avatar` | varchar(500) | YES | NULL | Chemin vers l'avatar stocké |
| `role` | enum | NO | `user` | `user`, `moderateur`, `admin` |
| `api_key` | varchar(500) | YES | NULL | Clé GW2 chiffrée AES-256 |
| `email_verified_at` | timestamp | YES | NULL | Date vérification email |
| `remember_token` | varchar(100) | YES | NULL | Token "Se souvenir de moi" |
| `created_at` | timestamp | YES | NULL | Date création |
| `updated_at` | timestamp | YES | NULL | Date modification |
| `deleted_at` | timestamp | YES | NULL | Soft delete |

**Index :**
- `PRIMARY KEY (id)`
- `UNIQUE INDEX users_email_unique (email)`

---

## Table `profils_gw2`

Données GW2 synchronisées depuis l'API ArenaNet. Relation 1-1 avec `users`.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `user_id` | bigint UNSIGNED | NO | | FK → users.id UNIQUE |
| `nom_compte` | varchar(100) | YES | NULL | Nom compte GW2 (Nom.1234) |
| `monde` | varchar(100) | YES | NULL | Serveur (ex: Piken Square) |
| `personnages` | json | YES | NULL | Tableau de personnages |
| `derniere_synchro` | timestamp | YES | NULL | Dernière synchro réussie |
| `valide` | tinyint(1) | NO | 0 | Clé API valide et active |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Structure JSON `personnages` :**
```json
[
    {
        "nom": "Nomdu Personnage",
        "race": "Asura",
        "profession": "Elementaliste",
        "niveau": 80
    }
]
```

**Index :**
- `PRIMARY KEY (id)`
- `UNIQUE INDEX profils_gw2_user_id_unique (user_id)`
- `FK profils_gw2_user_id_foreign → users(id) ON DELETE CASCADE`

---

## Table `user_bans`

Historique complet des sanctions.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `user_id` | bigint UNSIGNED | NO | | FK → users.id (banni) |
| `banned_by` | bigint UNSIGNED | NO | | FK → users.id (admin) |
| `type` | enum | NO | `temporary` | `temporary`, `permanent` |
| `reason` | varchar(500) | NO | | Motif du ban |
| `expires_at` | timestamp | YES | NULL | Fin du ban (null si permanent) |
| `lifted_at` | timestamp | YES | NULL | Levée anticipée (null si actif) |
| `lifted_by` | bigint UNSIGNED | YES | NULL | FK → users.id (admin ayant levé) |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Scope `active()` :**
```sql
WHERE lifted_at IS NULL
AND (type = 'permanent' OR expires_at > NOW())
```

**Index :**
- `PRIMARY KEY (id)`
- `INDEX user_bans_user_active (user_id, lifted_at, expires_at)`

---

## Table `personal_access_tokens` (Sanctum)

Tokens d'authentification Bearer.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `tokenable_type` | varchar(255) | NO | | Classe du modèle (App\Models\User) |
| `tokenable_id` | bigint UNSIGNED | NO | | ID utilisateur |
| `name` | varchar(255) | NO | | Nom de l'appareil ('web') |
| `token` | varchar(64) | NO | | Hash SHA-256 du token |
| `abilities` | text | YES | NULL | JSON des abilities |
| `last_used_at` | timestamp | YES | NULL | Dernière utilisation |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Index :**
- `UNIQUE INDEX personal_access_tokens_token_unique (token)`
- `INDEX personal_access_tokens_tokenable (tokenable_type, tokenable_id)`

---

## Table `forum_categories`

Catégories du forum.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `name` | varchar(100) | NO | | Nom de la catégorie |
| `slug` | varchar(120) | NO | | URL-friendly unique |
| `description` | varchar(500) | YES | NULL | Description |
| `icon` | varchar(80) | YES | NULL | Icône (classe CSS MDI) |
| `position` | int | NO | 0 | Ordre d'affichage |
| `is_active` | tinyint(1) | NO | 1 | Visible ou non |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Index :**
- `UNIQUE INDEX forum_categories_slug_unique (slug)`
- `INDEX forum_categories_active_position (is_active, position)`

---

## Table `forum_threads`

Sujets du forum.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `forum_category_id` | bigint UNSIGNED | NO | | FK → forum_categories.id CASCADE |
| `user_id` | bigint UNSIGNED | NO | | FK → users.id RESTRICT |
| `title` | varchar(150) | NO | | Titre du sujet |
| `slug` | varchar(180) | NO | | URL-friendly unique |
| `excerpt` | varchar(300) | YES | NULL | Extrait (220 chars, strip_tags) |
| `is_locked` | tinyint(1) | NO | 0 | Verrouillé (no new posts) |
| `is_pinned` | tinyint(1) | NO | 0 | Épinglé en haut |
| `views_count` | int UNSIGNED | NO | 0 | Nombre de vues (cache 10min) |
| `last_post_at` | timestamp | YES | NULL | Dernier message (tri) |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Index :**
- `UNIQUE INDEX forum_threads_slug_unique (slug)`
- `INDEX forum_threads_category_pinned_last (forum_category_id, is_pinned, last_post_at)`
- `INDEX forum_threads_user_created (user_id, created_at)`

---

## Table `forum_posts`

Messages des threads.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `forum_thread_id` | bigint UNSIGNED | NO | | FK → forum_threads.id CASCADE |
| `user_id` | bigint UNSIGNED | NO | | FK → users.id RESTRICT |
| `content` | longtext | NO | | Contenu (Markdown/HTML) |
| `is_solution` | tinyint(1) | NO | 0 | Marqué comme solution |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Index :**
- `INDEX forum_posts_thread_created (forum_thread_id, created_at)`
- `INDEX forum_posts_user_created (user_id, created_at)`

**Note :** Pas de soft delete. Suppression physique.

---

## Table `forum_post_reports`

Signalements de messages.

| Colonne | Type | Null | Défaut | Description |
|---|---|---|---|---|
| `id` | bigint UNSIGNED | NO | auto_increment | PK |
| `forum_post_id` | bigint UNSIGNED | NO | | FK → forum_posts.id CASCADE |
| `reporter_id` | bigint UNSIGNED | NO | | FK → users.id RESTRICT |
| `reason` | varchar(40) | NO | | Raison courte |
| `details` | text | YES | NULL | Détails optionnels |
| `status` | varchar(20) | NO | `open` | `open`, `resolved`, `dismissed` |
| `reviewed_by` | bigint UNSIGNED | YES | NULL | FK → users.id (modérateur) |
| `reviewed_at` | timestamp | YES | NULL | Date du traitement |
| `created_at` | timestamp | YES | NULL | |
| `updated_at` | timestamp | YES | NULL | |

**Index :**
- `UNIQUE INDEX report_unique_per_user (forum_post_id, reporter_id)` — un seul signalement par user/post
- `INDEX forum_post_reports_status_created (status, created_at)`

---

## Migrations

```
0001_01_01_000000_create_users_table.php
0001_01_01_000001_create_cache_table.php
0001_01_01_000002_create_jobs_table.php
2026_03_11_073420_create_personal_access_tokens_table.php
2026_03_20_110726_create_profile_gw2_table.php
2026_03_23_101440_create_user_bans_table.php
2026_06_04_000001_create_forum_categories_table.php
2026_06_04_000002_create_forum_threads_table.php
2026_06_04_000003_create_forum_posts_table.php
2026_06_05_000004_create_forum_post_reports_table.php
```

## Commandes utiles

```bash
# Lancer les migrations
php artisan migrate

# Reset complet (⚠️ supprime toutes les données)
php artisan migrate:fresh

# Reset + seeders
php artisan migrate:fresh --seed

# Statut des migrations
php artisan migrate:status

# Rollback dernière batch
php artisan migrate:rollback
```
