# STRUCTURE.md — Passage mono-page → multi-pages (SEO)

Plan de découpe du site Electropack en architecture multi-pages, une intention
SEO par page. Stack statique HTML/CSS/JS conservée. On ne vise pas « electropack »
(marque saturée au Maroc). Aucune donnée inventée : les manques sont des **TODO**.

## 1. Arborescence
| URL | Fichier | Rôle |
|-----|---------|------|
| `/` | `index.html` | Accueil (synthèse + conversion) |
| `/services/electricite-courant-fort/` | `services/electricite-courant-fort/index.html` | Courant fort |
| `/services/courants-faibles/` | `services/courants-faibles/index.html` | Courants faibles |
| `/services/controle-acces-videosurveillance/` | `services/controle-acces-videosurveillance/index.html` | Contrôle d'accès / vidéosurveillance |
| `/realisations/` | `realisations/index.html` | Portfolio filtrable |
| `/realisations/{slug}/` | `realisations/{slug}/index.html` | Fiche chantier |
| `/recrutement.html` | existant | Recrutement |
| `/electropack-nouveau.html` | stub de redirection → `/` | Compat ancienne URL |

## 2. Pages : title / meta / plan de titres

### Accueil `/`
- title (53) : `Électricité, courants faibles & sécurité à Casablanca`
- meta (151) : `Entreprise d'électricité à Casablanca : courant fort, courants faibles, contrôle d'accès et vidéosurveillance pour bâtiments tertiaires. Devis gratuit.`
- h1 : slogan animé du hero (conservé) ; h2 : Qui sommes-nous · Nos métiers · Méthode · Réalisations · Pourquoi nous · Témoignages · Contact
- Contenu : hero + tout le contenu actuel, les 3 cartes services deviennent des teasers liés vers leurs pages, le bloc réalisations renvoie vers `/realisations/`.

### `/services/electricite-courant-fort/`
- Intention : « entreprise électricité courant fort Casablanca »
- title (48) : `Entreprise électricité courant fort à Casablanca`
- meta (143) : `Tableaux électriques, distribution, éclairage et mise en conformité pour bâtiments tertiaires, hôtels et industries à Casablanca. Devis gratuit.`
- h1 : `Électricité générale — courant fort à Casablanca`
- h2 : Tableaux généraux et divisionnaires · Distribution et éclairage · Mise en conformité · Notre méthode · Références · Devis

### `/services/courants-faibles/`
- Intention : « câblage informatique Casablanca » + « détection incendie entreprise Maroc »
- title (54) : `Câblage informatique & détection incendie à Casablanca`
- meta (140) : `Câblage informatique, téléphonie, détection incendie, sonorisation et GTB pour vos bâtiments à Casablanca. Réseaux certifiés, devis gratuit.`
- h1 : `Courants faibles à Casablanca : câblage, téléphonie, détection incendie`
- h2 : Câblage informatique et téléphonie · Détection incendie · Sonorisation et GTB · Notre méthode · Références · Devis

### `/services/controle-acces-videosurveillance/`
- Intention : « vidéosurveillance entreprise Casablanca » + « contrôle d'accès Maroc »
- title (49) : `Vidéosurveillance & contrôle d'accès à Casablanca`
- meta (145) : `Vidéosurveillance, contrôle d'accès, badges, interphonie et caméras IP pour sécuriser vos locaux à Casablanca. Systèmes évolutifs, devis gratuit.`
- h1 : `Contrôle d'accès et vidéosurveillance à Casablanca`
- h2 : Badges, interphonie, portiques · Caméras IP et enregistrement · Maintenance et supervision · Notre méthode · Références · Devis
- TODO : aucune attestation dédiée parmi les 14 (voir §4).

### `/realisations/`
- title (49) : `Réalisations — chantiers électriques à Casablanca`
- meta (149) : `Nos chantiers d'électricité, courants faibles et sécurité à Casablanca : hôtels, banques, tertiaire et industrie. Références et attestations clients.`
- h1 : `Nos réalisations à Casablanca` ; filtres par métier et par secteur.

### `/realisations/{slug}/` (gabarit)
- Slugs : `hotel-sofitel`, `societe-generale-maroc`, `teleperformance`.
- title (≤60) : `{Chantier} — installation électrique à Casablanca`
- h1 : `{Chantier}` ; h2 : Contexte · Prestations · Attestation
- TODO par fiche : descriptif, année, lieu, montant/lot (à fournir).

## 3. Maillage interne
- Nav globale (identique sur toutes les pages) : Courant fort · Courants faibles · Vidéosurveillance · Réalisations · Recrutement · [Demander un devis]. Le logo renvoie à l'accueil.
- Accueil : teasers services → pages services ; bloc réalisations → `/realisations/`.
- Chaque page service → réalisations du métier + les 2 autres services + devis.
- `/realisations/` → pages services (filtres) + fiches.
- Fiches → parent `/realisations/` + page service concernée + devis.
- Footer (toutes pages) : 3 services + Réalisations + Recrutement + Contact.
- Mettre à jour `recrutement.html` et `merci.html` (liens nav vers les nouvelles URL).

## 4. Répartition des 14 attestations + logos, par métier
Base = texte réel des attestations. Générique = laissé sur Accueil / Courant fort (métier cœur), sans inventer de spécialité.

| # | Client | Fichier | Indice | Page(s) |
|---|--------|---------|--------|---------|
| 1 | GTR — Sâad Zguendi | gtr.jpg | générique | Accueil / Courant fort |
| 2 | A2S Industries | a2s-industries.jpg | courant fort et faible | Courant fort + Courants faibles |
| 3 | Asting Invest | asting-invest.jpg | générique | Accueil / Courant fort |
| 4 | Teleperformance | teleperformance.jpg | câblage de plateaux (carte projet) | Courants faibles |
| 5 | Lia Tech Maroc | liatech.jpg | courant fort et faible | Courant fort + Courants faibles |
| 6 | Xerox | xerox.jpg | courant fort et faible | Courant fort + Courants faibles |
| 7 | Ithaca — GTR Tit Mellil | ithaca.jpg | détection incendie | Courants faibles |
| 8 | GTC (Bouskoura) | gtc.jpg | générique | Accueil / Courant fort |
| 9 | Loudghiri Rachad (architecte) | ad.jpg | prescripteur | Accueil / Courant fort |
| 10 | Fiat Group Automobiles | fiat.jpg | générique | Accueil / Courant fort |
| 11 | Autodistribution Maroc | auto-distribution.jpg | générique | Accueil / Courant fort |
| 12 | Cabinet ABD — Arnold Delahaye | adb.jpg | prescripteur | Accueil / Courant fort |
| 13 | Younes El Hadiri (architecte) | archi.jpg | prescripteur | Accueil / Courant fort |
| 14 | FG Capital | fgc.jpg | générique | Accueil / Courant fort |

- Courant fort : 1,2,3,5,6,8,9,10,11,12,13,14
- Courants faibles : 2,4,5,6,7
- Contrôle d'accès / vidéosurveillance : AUCUNE → TODO (fournir une référence CCTV/accès).

Logos (bandeau, 11) : SOFITEL, SOCIÉTÉ GÉNÉRALE, TELEPERFORMANCE, GTR, A2S INDUSTRIES, ASTING INVEST, XEROX, FIAT, AUTO DISTRIBUTION, LIA TECH MAROC, GTC.
- Accueil : bandeau complet.
- Courant fort : SOCIÉTÉ GÉNÉRALE, SOFITEL, A2S, LIA TECH, XEROX (+ génériques).
- Courants faibles : TELEPERFORMANCE, GTR, SOFITEL, A2S, LIA TECH, XEROX.
- Contrôle d'accès : aucun rattachable → rester sur l'accueil, ne pas sous-entendre.

## 5. Redirections (GitHub Pages = pas de 301 serveur → stub client)
`electropack-nouveau.html` : `<link rel="canonical" href="/">` + `<meta name="robots" content="noindex">` + `<meta http-equiv="refresh" content="0;url=/">` + JS mappant l'ancre entrante.

| Ancienne ancre | Cible |
|----------------|-------|
| `electropack-nouveau.html` | `/` |
| `#services` | `/` (aperçu services) |
| `#methode` | `/#methode` |
| `#projets` | `/realisations/` |
| `#temoignages` | `/#temoignages` |
| `#pourquoi` | `/#pourquoi` |
| `#apropos` | `/#apropos` |
| `#contact` | `/#contact` |

## 6. En attente (TODO — non inventé)
1. Référence contrôle d'accès / vidéosurveillance (attestation ou chantier).
2. Contenu des fiches réalisations : descriptif, année, lieu, montant/lot.
3. Y a-t-il plus de 3 réalisations à lister ?
4. Adresse postale (laissée à « Casablanca, Maroc » selon ton choix).
