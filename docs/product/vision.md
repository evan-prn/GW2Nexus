# Vision Produit — GW2 Nexus

## Proposition de valeur

GW2 Nexus est la plateforme communautaire de référence pour les joueurs de Guild Wars 2. Elle centralise les informations de compte, les timers d'événements en direct et les échanges entre joueurs dans un seul outil.

## Utilisateurs cibles

| Persona | Besoins | Fonctionnalités clés |
|---|---|---|
| **Joueur casual** | Suivre les events GW2 sans chercher | Timers world boss, calendrier |
| **Joueur investit** | Gérer son compte, ses personnages | Profil GW2, synchro clé API |
| **Membre de guilde** | Communiquer avec les autres joueurs | Forum communautaire |
| **Modérateur** | Maintenir une communauté saine | Outils modération forum |
| **Administrateur** | Gérer les utilisateurs et la plateforme | Back-office complet |

## Fonctionnalités par domaine

### Compte utilisateur
- [x] Inscription / connexion / déconnexion
- [x] Profil personnalisable (avatar, pseudo GW2)
- [x] Intégration clé API GW2 (synchronisation compte + personnages)
- [ ] Vérification email
- [ ] Liaison compte social (Discord, Google)

### Events GW2
- [x] Timers world bosses en temps réel (UTC)
- [x] Statut personnalisé (bosses tués aujourd'hui)
- [ ] Méta-events (Living World)
- [ ] Notifications push (boss imminent)

### Forum
- [x] Catégories et threads
- [x] Pagination des messages
- [x] Modération (lock, pin, signalements)
- [ ] Formatage riche (Markdown)
- [ ] Recherche plein texte
- [ ] Notifications de réponse

### Administration
- [x] Gestion utilisateurs (ban, roles, stats)
- [x] Modération forum (reports)
- [ ] Tableau de bord analytique complet
- [ ] Gestion catégories forum via UI

## Contraintes et principes

- **Respect des CGU ArenaNet** : Utilisation de l'API officielle, pas de datamining
- **Privacy** : Clés API GW2 chiffrées, jamais exposées
- **Performance** : Cache API GW2 pour limiter les requêtes externes
- **Accessibilité** : Interface responsive, lisible

## Vision à 1 an

- Intégration gestion de guilde (roster, rang)
- Calculateur de crafting
- Suivi progression achievements
- Application mobile (React Native ou PWA)
