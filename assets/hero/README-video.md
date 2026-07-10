# Vidéo de fond du hero

Le hero de `electropack-nouveau.html` peut afficher une **vidéo réaliste en boucle**
(tableau électrique, disjoncteurs qui basculent…) à la place des scènes SVG animées.

## Pour l'activer : dépose deux fichiers ici

| Fichier | Rôle |
|---|---|
| `hero-loop.mp4` | La vidéo. **MP4 H.264, sans audio, ~10–20 s, ≤ 6 Mo, 1080p max.** |
| `poster.jpg` | Une image d'attente (1re frame de la vidéo), affichée avant chargement. |

**C'est tout.** Aucune modification de code n'est nécessaire : au chargement de la page,
le JavaScript vérifie si `hero-loop.mp4` existe. Si oui, la vidéo prend le dessus
(fondu, voile marine par-dessus, texte lisible). Si non, les **scènes SVG animées**
restent affichées (repli automatique).

## Comportement intégré
- `autoplay muted loop playsinline` + `object-fit: cover` (plein cadre).
- Chargement différé : la vidéo ne retarde jamais l'affichage du texte.
- **Pause** automatique quand l'onglet est masqué ou que le hero sort de l'écran.
- `prefers-reduced-motion` : pas de vidéo (scènes/poster statiques).

## Compresser la vidéo pour le web (exemple ffmpeg)
```bash
ffmpeg -i source.mov -t 16 -an -vf "scale=-2:1080" \
  -c:v libx264 -profile:v high -crf 26 -preset slow -movflags +faststart \
  hero-loop.mp4
# Poster (frame à 2 s) :
ffmpeg -ss 2 -i hero-loop.mp4 -frames:v 1 -q:v 3 poster.jpg
```

## Sources de vidéo libres de droits (usage commercial gratuit)
Rechercher « electrical panel », « circuit breaker switch », « electrician switchboard » sur :
- Pexels — https://www.pexels.com/search/videos/electrical/ (licence Pexels, gratuit, usage commercial, sans attribution)
- Pixabay — https://pixabay.com/videos/search/electrical/ (licence Pixabay, idem)
Choisir un plan **sombre et sobre** pour se marier avec le voile marine.
