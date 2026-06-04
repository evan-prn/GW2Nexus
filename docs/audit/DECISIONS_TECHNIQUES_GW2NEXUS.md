# Decisions techniques GW2Nexus

## 2026-06-02 - Correction progressive avec validation explicite

- Contexte : le projet presente plusieurs problemes transverses, notamment ports, Docker, `.env`, lint frontend et documentation.
- Decision : appliquer les corrections par petites etapes validees explicitement par l'utilisateur.
- Alternatives envisagees : corriger tous les problemes en une passe ; ne produire qu'un rapport sans modifier.
- Justification : limiter le risque, garder chaque changement reversible et permettre de controler les impacts.
- Impact attendu : meilleure tracabilite, moins de regressions, corrections plus faciles a relire.

## 2026-06-02 - Documentation d'audit a la racine

- Contexte : aucun dossier `/docs/audit/` n'existait au debut de la correction.
- Decision : creer quatre fichiers Markdown de suivi dans `docs/audit/`.
- Alternatives envisagees : utiliser le README existant ; utiliser uniquement les messages de conversation.
- Justification : le README est incoherent et les messages de conversation ne remplacent pas une documentation versionnable.
- Impact attendu : suivi durable de l'audit, du plan, des changements et des decisions.

## 2026-06-02 - Priorite a la stabilisation locale

- Contexte : le conflit `5173/5174` et les incoherences Docker/DB peuvent empecher le projet de demarrer localement.
- Decision : traiter d'abord l'environnement local avant les refactors ou optimisations.
- Alternatives envisagees : commencer par le lint ou la qualite de code.
- Justification : un projet qui ne demarre pas correctement rend les autres corrections plus difficiles a verifier.
- Impact attendu : base locale plus stable pour les corrections suivantes.

## 2026-06-02 - Port frontend local de reference 5174

- Contexte : le projet melangeait `5173` et `5174`, tandis que l'environnement ouvert par l'utilisateur etait sur `http://localhost:5174/`.
- Decision : utiliser `5174` comme port frontend de reference pour Vite, Docker Compose et les exemples `.env`.
- Alternatives envisagees : revenir a `5173`, qui etait le port documente historiquement.
- Justification : l'utilisateur a explicitement demande d'utiliser `5174` partout.
- Impact attendu : URL locale unique `http://localhost:5174`, proxy Vite et HMR alignes, moins d'ambiguite dans Docker.

## 2026-06-02 - MySQL Docker publie sur localhost:3307

- Contexte : Docker Compose mappe MySQL en `3307:3306`, mais un commentaire indiquait encore `localhost:3306`.
- Decision : conserver le mapping `3307:3306` existant et documenter clairement que `3306` est le port interne Docker tandis que `3307` est le port hote.
- Alternatives envisagees : revenir a `3306:3306` cote hote.
- Justification : changer le mapping Docker aurait plus d'impact local ; l'etape validee visait la clarification et la restauration de l'exemple racine.
- Impact attendu : moins de confusion pour les connexions depuis l'hote et pour les commandes hors conteneur.

## 2026-06-02 - Alignement local de Sanctum sur 5174

- Contexte : `backend/.env` contenait `FRONTEND_URL=http://localhost:5174`, mais `SANCTUM_STATEFUL_DOMAINS` pointait encore vers `5173`.
- Decision : aligner `SANCTUM_STATEFUL_DOMAINS` sur `localhost:5174,127.0.0.1:5174`.
- Alternatives envisagees : ne modifier que les fichiers `.env.example` et laisser le `.env` local diverger.
- Justification : l'application locale est ouverte sur `http://localhost:5174/`, et la coherence CORS/Sanctum evite des erreurs difficiles a diagnostiquer.
- Impact attendu : configuration backend locale coherente avec le frontend.

## 2026-06-02 - Healthcheck API hors versionnement

- Contexte : Laravel expose `GET /api/health`, et les fichiers Docker Compose utilisent deja cette route pour les healthchecks.
- Decision : garder la route health hors `/api/v1` et aligner le frontend sur `/api/health`.
- Alternatives envisagees : ajouter une route backend supplementaire `/api/v1/health`.
- Justification : evite de modifier Docker et respecte la route backend reelle deja fonctionnelle.
- Impact attendu : endpoint health frontend coherent avec l'API et les healthchecks Docker.

## 2026-06-02 - Correction lint par petites sous-etapes

- Contexte : le lint frontend etait en echec avec plusieurs familles d'erreurs dans des fichiers differents.
- Decision : corriger les erreurs lint par lots petits et explicites, en commencant par `EventRow.tsx` et `ResetPasswordPage.tsx`.
- Alternatives envisagees : corriger toutes les erreurs lint frontend en une seule passe.
- Justification : reduire le risque de melanger des changements de comportement sans validation separee.
- Impact attendu : progression mesurable du lint tout en gardant chaque correction facile a relire.

## 2026-06-02 - Typage minimal des erreurs et donnees profil

- Contexte : les hooks profil utilisaient `catch (err: any)` et la page profil castait les personnages GW2 en `any[]`.
- Decision : utiliser `unknown` avec `axios.isAxiosError` pour les erreurs, et introduire un type `Gw2CharacterRaw` minimal pour les personnages bruts.
- Alternatives envisagees : creer une couche API fortement typee complete pour toutes les reponses profil.
- Justification : corriger le lint sans refactor massif ni changement de comportement metier.
- Impact attendu : typage plus robuste et suppression des erreurs `no-explicit-any` du perimetre profil.

## 2026-06-02 - Reutilisation du hook reveal partage pour ContactPage

- Contexte : `ContactPage` contenait une logique reveal locale basee sur `useRef` et `useEffect`, signalee par React Compiler avec la regle `react-hooks/refs`.
- Decision : utiliser le hook partage `useIntersectionObserver` et destructurer les valeurs retournees pour eviter les acces a proprietes de refs pendant le render.
- Alternatives envisagees : modifier globalement `useIntersectionObserver` pour retourner un callback ref ; conserver le hook local avec des contournements ESLint.
- Justification : correction minimale, limitee a `ContactPage`, sans impact sur les autres composants qui utilisent deja le hook partage.
- Impact attendu : suppression des erreurs lint de `ContactPage` et reduction d'une duplication de logique reveal.

## 2026-06-02 - Fermeture des menus Navbar par interaction utilisateur

- Contexte : `Navbar` fermait le menu mobile et le dropdown utilisateur dans un `useEffect` synchronise avec `location.pathname`, ce qui declenchait `react-hooks/set-state-in-effect`.
- Decision : supprimer l'effet de changement de route et fermer les menus depuis les handlers des liens/dropdown/logout.
- Alternatives envisagees : conserver l'effet avec un contournement asynchrone ; ignorer la regle ESLint localement.
- Justification : la fermeture des menus est une consequence directe de l'interaction utilisateur, pas une synchronisation externe necessitant un effet.
- Impact attendu : suppression de l'erreur lint `Navbar` et comportement plus explicite.

## 2026-06-02 - Etat source temporel pour useEventTimer

- Contexte : `useEventTimer` stockait un tableau `EventState[]` derive de `events` et de l'heure courante, puis le recalculait directement dans un effet.
- Decision : stocker uniquement l'heure courante `now` comme etat source et calculer les `EventState[]` avec `useMemo`.
- Alternatives envisagees : conserver `states` et differer le `setState` avec un timer ; desactiver la regle ESLint localement.
- Justification : les etats d'evenements sont des donnees derivees ; les calculer depuis `now` et `events` rend le hook plus conforme au modele React.
- Impact attendu : suppression de la derniere erreur lint et conservation de l'API publique `EventState[]`.

## 2026-06-02 - Remplacement du README obsolete

- Contexte : le README racine contenait des informations contradictoires, de l'encodage casse et des versions/ports/services qui ne correspondaient plus au projet.
- Decision : remplacer le README par une version concise et factuelle, limitee a l'etat observe pendant l'audit.
- Alternatives envisagees : corriger uniquement quelques lignes ; conserver la partie marketing historique.
- Justification : une documentation d'installation locale doit etre fiable avant d'etre exhaustive.
- Impact attendu : onboarding local plus simple et reduction des confusions autour de `5174`, Docker Compose et des fichiers `.env`.

## 2026-06-02 - Clarification DB dans backend `.env.example`

- Contexte : l'exemple backend indiquait Laravel 11 et ne differenciait pas clairement le port MySQL interne Docker du port publie sur l'hote.
- Decision : corriger le commentaire Laravel 12 et documenter `mysql:3306` dans Docker ainsi que `127.0.0.1:3307` pour une execution hors Docker.
- Alternatives envisagees : changer directement `DB_PORT` a `3307` dans `backend/.env.example`.
- Justification : Docker Compose surcharge `DB_HOST` vers `mysql`, donc garder `DB_PORT=3306` comme valeur par defaut est coherent pour l'execution conteneurisee ; la note couvre le cas hors Docker.
- Impact attendu : moins d'erreurs de connexion MySQL lors de l'onboarding local.

## 2026-06-02 - Nettoyage minimal des commentaires Docker Compose

- Contexte : `docker-compose.yml` contenait encore des commentaires `Laravel 11` et des caracteres de controle Unicode issus de l'encodage abime.
- Decision : corriger les mentions Laravel 12 et retirer les caracteres de controle interdits par YAML, sans modifier les services, ports ni variables.
- Alternatives envisagees : reecrire completement `docker-compose.yml` en ASCII ; ne corriger que les deux chaines `Laravel 11`.
- Justification : l'objectif de l'etape est documentaire et minimal, mais `docker compose config` doit rester fonctionnel.
- Impact attendu : Compose reste parseable et les commentaires ne contredisent plus la version backend.

## 2026-06-02 - Retrait des relations User futures non implementees

- Contexte : `User.php` declarait des relations vers cinq modeles absents et aucune migration correspondante n'est presente.
- Decision : retirer temporairement ces relations du modele `User`.
- Alternatives envisagees : creer des modeles vides ; laisser les relations en place jusqu'a implementation des modules.
- Justification : des modeles vides masqueraient une fonctionnalite non implementee, tandis que les relations actuelles peuvent declencher `Class not found`.
- Impact attendu : modele `User` coherent avec le backend reel ; les relations pourront etre reintroduites avec les modules forum/builds/guildes.

## 2026-06-02 - SQLite en memoire pour les tests backend locaux

- Contexte : `php artisan test` lance hors Docker echouait car `phpunit.xml` pointait vers `mysql:3306`, nom resolvable uniquement dans Docker.
- Decision : utiliser SQLite en memoire pour la suite PHPUnit locale.
- Alternatives envisagees : forcer `127.0.0.1:3307` dans `phpunit.xml` ; lancer les tests uniquement via `docker compose exec laravel`.
- Justification : SQLite en memoire rend les tests rapides, autonomes et reproductibles sans base MySQL de test pre-creee.
- Impact attendu : tests backend executables depuis l'hote ; vigilance a garder pour les differences potentielles SQLite/MySQL.

## 2026-06-02 - Role utilisateur non mass-assignable

- Contexte : `role` etait present dans `$fillable` malgre un commentaire indiquant que les attributs sensibles ne devaient pas etre assignes en masse.
- Decision : retirer `role` de `$fillable`.
- Alternatives envisagees : conserver `role` assignable pour faciliter seeders/factories ; ajouter une validation globale plus large.
- Justification : le role est un attribut de privilege et doit etre modifie uniquement par un flux explicite et controle.
- Impact attendu : reduction du risque de privilege escalation par mass assignment.

## 2026-06-02 - Instructions projet dediees a GW2Nexus

- Contexte : l'utilisateur a fourni un modele d'instructions TimeSmart/C# a adapter a GW2Nexus.
- Decision : creer `.claude/instructions-claude.md` avec les regles propres a GW2Nexus, a Laravel/React/Docker et au workflow de correction par validation explicite.
- Alternatives envisagees : conserver le modele TimeSmart en l'etat ; ajouter ces regles uniquement dans le README.
- Justification : un fichier d'instructions dedie evite les confusions de stack et formalise les regles de collaboration applicables aux assistants IA.
- Impact attendu : corrections futures plus coherentes, securisees et mieux documentees.

## 2026-06-02 - phpMyAdmin local sur le port 8081

- Contexte : la documentation indiquait `8080`, mais l'utilisateur a confirme que phpMyAdmin est fonctionnel sur `8081` et pas sur `8080`.
- Decision : conserver `8081:80` dans `docker-compose.yml` et aligner README, audit et instructions IA sur `http://localhost:8081`.
- Alternatives envisagees : revenir a `8080:80`.
- Justification : privilegier le port fonctionnel dans l'environnement local reel.
- Impact attendu : onboarding local plus fiable pour l'acces phpMyAdmin.

## 2026-06-02 - Controle d'encodage dans la consolidation finale

- Contexte : le projet avait deja montre du mojibake et des caracteres de controle Unicode dans des commentaires.
- Decision : integrer un controle explicite des caracteres de controle et marqueurs mojibake dans la consolidation finale.
- Alternatives envisagees : se limiter aux tests runtime.
- Justification : les fichiers YAML et Markdown peuvent devenir invalides ou illisibles a cause de caracteres invisibles.
- Impact attendu : meilleure fiabilite documentaire et moins de risques de YAML invalide.
