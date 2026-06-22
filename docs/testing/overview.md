# Tests — Stratégie et Guide

## État actuel

| Type de test | Outil | Présence | Couverture |
|---|---|---|---|
| Tests Feature (backend) | PHPUnit 11 | ✅ 3 fichiers | Partielle |
| Tests Unit (backend) | PHPUnit 11 | ✅ 1 fichier | Minimale |
| Tests TypeScript | `tsc --noEmit` | ✅ Via build | Complet |
| Linting (frontend) | ESLint 9 | ✅ Configuré | Complet |
| Tests composants React | Vitest / Testing Library | ❌ Absent | Aucune |
| Tests E2E | Playwright / Cypress | ❌ Absent | Aucune |

---

## Tests Backend (PHPUnit)

### Configuration

**Fichier :** `backend/phpunit.xml`

```xml
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
    <env name="CACHE_DRIVER" value="array"/>
    <env name="SESSION_DRIVER" value="array"/>
    <env name="QUEUE_CONNECTION" value="sync"/>
    <env name="MAIL_MAILER" value="array"/>
</php>
```

SQLite in-memory garantit l'isolation et la rapidité des tests. Chaque test repart d'une base propre via `RefreshDatabase`.

### Exécution

```bash
# Depuis le conteneur Docker
docker compose exec laravel php artisan test

# Avec affichage détaillé
docker compose exec laravel php artisan test --verbose

# Filtre sur un test spécifique
docker compose exec laravel php artisan test --filter AuthTest

# Coverage (si Xdebug installé)
docker compose exec laravel php artisan test --coverage
```

### Tests existants

#### `tests/Feature/Auth/AuthTest.php`

Cas couverts :
- Inscription avec données valides → 201 + token
- Inscription avec email dupliqué → 422
- Connexion avec credentials valides → 200 + token
- Connexion avec credentials invalides → 401
- Rate limiting login → 429
- Déconnexion → 200 + token révoqué
- GET /me avec token valide → 200
- GET /me sans token → 401

#### `tests/Feature/Forum/ForumModerationTest.php`

Cas couverts :
- Création thread par utilisateur authentifié → 201
- Tentative de post sur thread verrouillé → 403
- Modérateur peut verrouiller un thread → 200
- Admin peut épingler un thread → 200
- Signalement de post → 201
- Admin peut traiter un signalement → 200

#### `tests/Unit/ExampleTest.php`

Test de démonstration PHPUnit (placeholder).

### Pattern de test recommandé

```php
use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_do_something(): void
    {
        // Arrange
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // Act
        $response = $this->withToken($token)
            ->postJson('/api/v1/...', ['field' => 'value']);

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure(['message', 'data']);
    }
}
```

---

## Vérification TypeScript (Frontend)

TypeScript vérifie les types à la compilation. Erreurs bloquantes lors du build.

```bash
# Check sans compilation
docker compose exec react npx tsc --noEmit

# Build complet (inclut tsc)
docker compose exec react npm run build
```

---

## Linting Frontend (ESLint)

**Fichier :** `frontend/eslint.config.js`

Règles activées :
- `@eslint/js` recommended
- `typescript-eslint` recommended
- `react-hooks` (règles hooks React)
- `react-refresh` (règles Vite HMR)

```bash
# Linter
docker compose exec react npm run lint

# Linter avec auto-fix
docker compose exec react npm run lint -- --fix
```

---

## Roadmap Tests (priorité recommandée)

### Priorité 1 — Tests backend manquants

```
tests/Feature/Profile/ApiKeyTest.php
    - Enregistrement clé valide
    - Clé invalide (ArenaNet rejette)
    - Suppression clé
    - Accès sans clé

tests/Feature/Admin/AdminBanTest.php
    - Ban temporaire
    - Ban permanent
    - Lever un ban
    - Impossibilité de bannir un admin
    - Impossibilité de se bannir soi-même

tests/Feature/Contact/ContactTest.php
    - Envoi formulaire contact
    - Rate limiting (3/10min)
```

### Priorité 2 — Tests composants React

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

Composants à tester en premier :
- `ProtectedRoute` — redirection si non connecté
- `AdminRoute` — redirection si non admin
- `ApiKeyManager` — formulaire validation clé GW2
- `BanModal` — formulaire ban avec validation

### Priorité 3 — Tests E2E

```bash
npm install --save-dev @playwright/test
```

Parcours critiques à couvrir :
1. Inscription → Login → Profil → Ajout clé GW2
2. Connexion → Forum → Créer thread → Répondre
3. Login admin → Bannir utilisateur → Vérifier ban

---

## CI/CD (À implémenter)

Le fichier `.github/workflows/ci.yml` est vide. Structure recommandée :

```yaml
name: CI

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: shivammathur/setup-php@v2
        with: { php-version: '8.4' }
      - run: composer install --no-interaction
      - run: cp .env.example .env && php artisan key:generate
      - run: php artisan test

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```
