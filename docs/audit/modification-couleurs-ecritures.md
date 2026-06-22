# Modification des couleurs d'ecriture - GW2Nexus

Date : 2026-06-02

## Contexte

Le frontend utilisait plusieurs textes gris tres sombres sur fond noir. Cette combinaison rendait certaines zones difficiles a lire, notamment le footer et les libelles du hero.

## Modification precedente : footer

Fichier concerne :

- `frontend/src/components/layout/FooterComponent/Footer.module.css`

Couleurs remplacees :

- `#3D4452`
- `#2D333F`

Nouvelles couleurs utilisees :

- `rgba(240, 232, 216, 0.82)` pour les textes principaux du footer.
- `rgba(240, 232, 216, 0.76)` pour le texte de disclaimer.
- `rgba(240, 232, 216, 0.72)` pour les textes secondaires et icones sociales.

Objectif :

- Ameliorer fortement le contraste texte/fond.
- Conserver une direction artistique sombre, chaude et coherente avec la palette GW2Nexus.
- Eviter une couleur blanche trop agressive sur le fond noir.

## Modification courante : hero

Fichier concerne :

- `frontend/src/components/layout/HeaderComponent/Header.module.css`

Couleurs remplacees :

- `#4B5563`

Nouvelles couleurs utilisees :

- `rgba(240, 232, 216, 0.72)` pour les labels de statistiques.
- `rgba(240, 232, 216, 0.76)` pour le label `Decouvrir`.

Objectif :

- Rendre les labels visibles sur le fond noir etoile.
- Garder une hierarchie visuelle claire entre les valeurs dorees et les textes descriptifs.

## Ajustement ergonomique associe

Le label `Decouvrir` etait trop proche des statistiques et pouvait se superposer visuellement avec le texte `Builds partages`.

Correction appliquee :

- Ajout d'espace vertical sous le contenu du hero.
- Ajout d'un espacement vertical entre les statistiques.
- Leger repositionnement du bloc `Decouvrir`.

## Verification prevue

- Compilation TypeScript.
- Lint frontend.
- Verification HTTP de la page d'accueil.
- Verification visuelle dans le navigateur sur `http://localhost:5174/`.
