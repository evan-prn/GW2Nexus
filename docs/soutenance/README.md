# Soutenance — Diaporama GW2 Nexus & GW2Nexus Mobile

Diaporama de présentation du projet (page de garde, contexte, architecture, choix
techniques, difficultés rencontrées, grilles d'évaluation, annexes) généré en
PowerPoint natif (`.pptx`) à partir de l'analyse du code et de [`docs/`](../README.md).

## Contenu

| Fichier | Rôle |
|---|---|
| `GW2Nexus-Soutenance.pptx` | Diaporama généré (73 diapositives), prêt à ouvrir/éditer dans PowerPoint |
| `generate-pptx.js` | Script Node (pptxgenjs) qui génère le `.pptx` — source de vérité du contenu |
| `package.json` | Dépendance `pptxgenjs` pour régénérer le fichier |

## Régénérer le fichier

```bash
cd docs/soutenance
npm install
npm run build
```

## À compléter avant la soutenance

- Remplacer les encadrés **📷 placeholder** par de vraies captures d'écran (aucune
  capture réelle n'existe dans le dépôt au moment de la génération).
- Compléter les 3 encadrés **« À compléter »** : intitulé exact de la formation,
  contexte entreprise, outil de gestion de projet utilisé (Trello/Notion/ClickUp…).
- Vérifier les chiffres (endpoints, tests, commits) s'ils ont évolué depuis la
  génération — voir `git log` et `docs/audit/changelog-corrections.md`.

## Statut

Généré le 2026-07-02, basé sur l'état du dépôt à cette date (branche
`feature/items-encyclopedia`).
