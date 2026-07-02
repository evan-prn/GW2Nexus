# GW2Nexus Mobile

Application Flutter/Dart connectée à l'API Laravel existante.

## Fonctionnalités

- Connexion via `POST /api/v1/auth/login`
- Option "Se souvenir de moi"
- Stockage sécurisé du token avec `flutter_secure_storage`
- Session mémoire si l'option "Se souvenir de moi" est décochée
- Récupération utilisateur via `GET /api/v1/auth/me`
- Déconnexion via `POST /api/v1/auth/logout`
- Navigation connectée avec barre d'onglets en bas
- Onglet Profil dédié aux informations du compte
- Demande d'autorisation de notifications depuis l'onglet Profil
- Notification de test depuis l'onglet Profil
- Liste des events et world bosses via `GET /api/v1/events/schedule`
- Notification locale unique pour le prochain event, 5 minutes avant son départ

Documentation complète :

```text
../docs/mobile/implementation-mobile.md
```

## Lancement

Depuis la racine du projet :

```bash
docker compose up -d --build
```

Depuis `mobile/` :

```bash
flutter pub get
flutter run
```

URL API par défaut : `http://10.0.2.2:8000`, adaptée à l'émulateur Android.

Pour un autre environnement :

```bash
flutter run --dart-define=API_BASE_URL=http://localhost:8000
flutter run --dart-define=API_BASE_URL=http://ADRESSE_IP_LOCALE:8000
```

## Notes

Sur Android 13+, l'application demande la permission `POST_NOTIFICATIONS`.
Sur iOS, la permission de notification est demandée au démarrage.
