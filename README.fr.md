# Ikonym


**Ikonym — des avatars géométriques générés à partir d’un identifiant.**

Ikonym est une bibliothèque open source pour générer des avatars SVG déterministes et les intégrer à un produit numérique. Développeurs : utilisez le package JavaScript ou les définitions DiceBear JSON. Designers et chefs de projet : explorez les densités, les couleurs et le rendu avant l’intégration. Pour la veille numérique, Ikonym offre un cas concret d’avatar génératif.

Chaque identifiant compose une mosaïque de formes inspirées des coquillages : éventails, arcs concentriques, stries courbes et facettes se mélangent carreau par carreau. Les orientations et la palette vive varient avec l’identifiant; les motifs remplissent leurs carreaux sans points décoratifs isolés et se raccordent bord à bord.

Deux carreaux voisins par un côté n’utilisent jamais la même famille de motifs, même si leur couleur ou leur orientation diffère.

Le paquet `ikonym` est publié sur npm. Le site propose aussi le tarball de la version courante et les définitions JSON pour les moteurs DiceBear compatibles.

Ikonym est développé par [Numera11y](https://www.numera11y.fr/) et sera présenté dans son catalogue d’outils numériques. [Consultez le code source, signalez un problème ou contribuez sur GitHub](https://github.com/numera11y/ikonym).

## Licence et attribution

Ikonym est distribué sous licence MIT. Vous pouvez l’utiliser, le modifier et le commercialiser. Toute redistribution du logiciel, y compris d’une version modifiée, doit conserver la notice de copyright et le texte de la licence MIT fournis avec le package. La licence complète se trouve dans [`LICENSE`](LICENSE).

## Intégrations multi-langages

Une même définition de style JSON est lue par les moteurs DiceBear officiels pour JavaScript, PHP, Python, Rust, Go, Dart et C#. Cela évite sept ports séparés et conserve le même résultat pour un identifiant donné. Voir le [guide d’installation et les exemples complets](docs/INTEGRATIONS.fr.md). Le package JavaScript est publié sur npm; `numera11y/ikonym` est aussi disponible sur Packagist pour PHP et inclut un helper pour charger les définitions JSON portables.

La distribution Python `ikonym` est en préparation pour PyPI. Elle inclura les cinq mêmes définitions JSON et une API Python pour charger les styles et générer des avatars avec DiceBear Core.

## Utilisation

```ts
import { createAvatar, createAvatarDataUri, getPaletteForSeed } from 'ikonym';

const svg = createAvatar('ikon-satin', { size: 128, density: 7 });

const imageUrl = createAvatarDataUri('ikon-satin');
const palette = getPaletteForSeed('ikon-satin');
// { colors: { navy, blue, cyan, pink, orange, yellow, mint, cream }, pattern }
```

Pour PHP, installez Ikonym et le moteur DiceBear avec `composer require numera11y/ikonym dicebear/core`, puis chargez un style avec `Numera11y\Ikonym\StyleDefinition::json(7)`. Voir l’[exemple d’intégration PHP](docs/INTEGRATIONS.fr.md#php).

Installe Ikonym depuis npm avec `npm install ikonym`, ou télécharge le tarball `.tgz` de la version courante depuis le site.

`createAvatar(seed, options?)` retourne un document SVG. `createAvatarDataUri(seed, options?)` le retourne sous forme d’URI de données, utilisable dans un élément image HTML. `getPaletteForSeed(seed, density?)` expose les huit couleurs et le motif sélectionnés par l’identifiant. Dans l’API, `seed` désigne cet identifiant (pseudo, nom ou ID utilisateur). Les options sont `size` (24–1024, défaut 160), `density` (grille 3 × 3, 5 × 5, 7 × 7, 9 × 9 ou 12 × 12; défaut 7) et `paletteColors` (palette personnalisée facultative). `radius` (0–50) reste disponible. Les anciens `waveCount`, `pieceCount` et `gridSize` sont conservés comme alias dépréciés de la densité.

## Démo locale

```sh
npm install
npm run dev
```

Le site est généré statiquement avec Astro sous `/en/` et `/fr/`. La racine `/` redirige vers l’anglais par défaut et propose des liens visibles vers les deux versions. Pour publier, définissez `PUBLIC_SITE_URL` sur l’URL canonique du site afin de produire les balises `canonical` et `hreflang` absolues.

La démo permet de saisir un identifiant, de choisir la densité de mosaïque, d’arrondir sa silhouette, puis de copier ou télécharger le SVG et sa définition DiceBear.

## Distribution Python

La publication sur PyPI est en préparation. La distribution inclut les cinq mêmes styles JSON; son extra optionnel `dicebear` ajoute le rendu SVG. Pour construire une roue et une archive source localement :

```sh
npm run styles:build
python -m pip install build twine
python -m build --outdir python-dist
python -m twine check python-dist/*
```

Après publication, installez le moteur de rendu avec `pip install "ikonym[dicebear]"`. Le chargement des définitions JSON seul n’a aucune dépendance d’exécution.

## Construire la bibliothèque

```sh
npm run build:lib
npm run styles:build
npm run styles:validate
npm run contrast:validate
npm run package:download
npm run build
```

`npm run build` construit la bibliothèque et les pages statiques Astro en anglais et en français.

`styles:validate` compares the JavaScript package output against DiceBear Core, verifies complete tile coverage and deterministic pattern/color variation at each density.

Le dépôt source public est disponible sur [github.com/numera11y/ikonym](https://github.com/numera11y/ikonym); les versions sont publiées sur npm.

## DiceBear

Les fichiers `styles/ikonym-{3,5,7,9,12}.json` sont des définitions compatibles avec DiceBear Core. Leur présence dans ce dépôt ne signifie pas encore que le style est inclus dans le catalogue officiel de DiceBear. Pour le référencement, il faudra proposer une contribution à ce catalogue; l’acceptation dépend de l’équipe DiceBear.
