# Migraine Assistant

Application web de suivi des migraines, pour un usage personnel : repérer les déclencheurs, anticiper les crises, noter l'effet des traitements et préparer un rapport pour le médecin.

**Site en ligne :** https://benjamincanis15-prog.github.io/Migraine_Assistant/

> Aide à la réflexion, pas un diagnostic. Seul un médecin peut poser un diagnostic.

## Ce que fait l'app

- **Crise** : saisie pas à pas (intensité, localisation, symptômes, déclencheurs, traitements horodatés, fin de crise, effet du traitement : totalement, partiellement, rebond, sans effet).
- **Pré-crise** : signes annonciateurs, une seule pré-crise ouverte à la fois, évolution horodatée, rattachement automatique à la crise qui suit.
- **Journal du jour** en 3 moments (matin, midi, soir) : sommeil, eau, café, alcool, écrans, activité, stress, humeur, nuque, météo, repas, éléments importants.
- **Onglet Médicaments** : prise hors horaire (par exemple un triptan pendant une crise, rattaché automatiquement à la crise en cours), prises prévues du jour, rappels de médicament et historique des prises.
- **Rappels discrets** du journal (3 horaires maximum) et des médicaments : notifications silencieuses, export vers le calendrier (.ics).
- **Stats** : courbes hebdomadaires, efficacité des traitements, déclencheurs et symptômes fréquents.
- **Analyse intégrée** gratuite (règles et statistiques, sans clé API ni Internet) : écarts dans les 24 h avant une crise, mots-clés dans les repas, repères ICHD-3, plan d'action, niveaux de confiance. Rapports archivés (40 derniers).
- **Impression / PDF** pour le médecin, **export et import JSON** de toutes les données (Réglages).
- **Hors connexion et installable** (service worker + manifeste).

## Données et confidentialité

Pas de compte ni de cloud : tout est stocké sur l'appareil, dans le `localStorage` (clé `migraine-v2`). Seule la météo GPS, si on la demande, interroge Open-Meteo.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'app (HTML, CSS et JavaScript, sans framework) |
| `sw.js` | Service worker : cache hors connexion et clic sur les notifications |
| `manifest.webmanifest` | Installation sur l'écran d'accueil |
| `icon-180.png`, `icon-192.png`, `icon-512.png` | Icônes |

## Publier une nouvelle version

1. Modifier `index.html` (et `sw.js` si besoin), puis changer le nom du cache dans `sw.js` (`migraine-assistant-vX.Y`).
2. Mettre à jour `APP_VER` et `APP_DATE` en haut du script.
3. Tester : syntaxe, parcours dans un navigateur, hors connexion via un petit serveur local.
4. Pousser sur la branche `main` (GitHub Pages), puis ouvrir le site deux fois : la nouvelle version apparaît au deuxième chargement.
5. Garder la compatibilité avec les données déjà saisies.

## Limites connues

- Une page web ne peut pas envoyer de notification quand l'app est fermée. Sur iPhone, il faut installer l'app sur l'écran d'accueil (iOS 16.4 ou plus). Pour une alarme fiable, utiliser l'export calendrier.
- La nouvelle version n'apparaît qu'au deuxième chargement.

## Historique

- **3.2** (01/11/2026) : nouvel onglet Médicaments (prise hors horaire, lien avec la crise en cours, prises prévues, rappels silencieux, historique), accueil allégé (statistiques déplacées dans Stats), notification touchée app fermée → ouvre directement le bon écran, icône iPhone gardée hors connexion, README complet.
- **3.1** (01/11/2026) : rappels discrets, mode hors connexion, courbes hebdomadaires, efficacité des traitements, impression PDF, page « Comment fonctionne l'analyse ? ».
