# Photos de chantier — où les déposer, comment les préparer

Ce dossier reçoit les photos réelles d'Electropack. Tant qu'un fichier est
absent, la page affiche un **emplacement explicite** portant le nom du fichier
attendu : rien n'est cassé, rien n'est inventé.

## Fichiers attendus

| Fichier | Où il apparaît | Format | Poids max |
|---|---|---|---|
| `assets/hero/hero-1.jpg` | Photo pleine largeur de l'accueil (déjà en place) | paysage 1600 × 900 | 180 Ko |
| `assets/chantiers/sofitel.jpg` | Carte « Hôtel Sofitel » (accueil + réalisations) | paysage 800 × 500 | 90 Ko |
| `assets/chantiers/societe-generale.jpg` | Carte « Société Générale Maroc » | paysage 800 × 500 | 90 Ko |
| `assets/chantiers/teleperformance.jpg` | Carte « Teleperformance » | paysage 800 × 500 | 90 Ko |
| `assets/chantiers/fondateur.jpg` | Bloc « Une entreprise familiale » | portrait 800 × 1000 | 120 Ko |

Les fiches chantier (`realisations/<slug>/`) attendent en plus une photo large
`assets/chantiers/<slug>-01.jpg` (paysage 1600 × 700, 160 Ko max).

## Préparer une photo pour la 3G marocaine

Le site doit rester rapide sur un réseau lent : **une page d'accueil complète
vise moins de 500 Ko**, photo comprise. Concrètement, pour chaque image :

1. Recadrer au ratio demandé (les emplacements sont à ratio fixe : une image
   d'un autre ratio sera rognée au centre).
2. Redimensionner à la largeur indiquée — inutile de déposer du 4000 px, c'est
   le principal gaspillage de bande passante.
3. Exporter en **JPEG qualité 75** (ou WebP qualité 78 si tous les navigateurs
   ciblés le supportent), profil sRGB, sans métadonnées EXIF.
4. Vérifier le poids final. Au-dessus du plafond du tableau, baisser la qualité
   avant de baisser la définition.

## Quoi photographier

Ce qui rassure un maître d'ouvrage : un **tableau électrique propre et repéré**,
un **chemin de câbles droit**, une **armoire courants faibles étiquetée**, une
**salle livrée et éclairée**. Éviter les photos de stock génériques : le
chantier réel, même imparfaitement cadré, est plus crédible.

Chaque photo publiée doit correspondre au chantier annoncé. Une photo de
tableau générique ne doit pas illustrer une fiche client nommée : dans le doute,
laisser l'emplacement vide — il est conçu pour rester présentable.

## Remplacer un emplacement par la photo

Exemple pour le portrait du fondateur, dans `index.html` :

```html
<!-- avant : emplacement -->
<div class="founder-ph"> … </div>

<!-- après : photo -->
<img class="founder-photo" src="assets/chantiers/fondateur.jpg"
     width="800" height="1000" loading="lazy"
     alt="Jacqui Alloun, fondateur d'Electropack">
```

Pour les cartes réalisations, remplacer le contenu de `.rmedia` par la même
balise `<img>` (`loading="lazy"` obligatoire : ces images sont sous la ligne de
flottaison). Pour la photo d'accueil, il suffit d'écraser
`assets/hero/hero-1.jpg` — aucune modification de code.
