import { createLoadedAvatar, getLoadedPalette, getLoadedStyleDefinition, loadDensity, browserPaletteRoles } from './lib/browser';
import type { IkonymOptions } from './lib/index';
import packageInfo from '../package.json';
import './style.css';
import './colors.css';
import './harmony.css';
import './integrations.css';
import './docs.css';
import './brand.css';

const seeds = ['nacre-lunaire', 'ormeau-bleu', 'murex-secret', 'conque-velours', 'nautilus-graphique', 'spirale-rose', 'abalone', 'perle-abyssale', 'onde-de-nacre', 'corail-satin', 'bivalve-iris', 'coquille-cosmique'];
const integrations = {
  JavaScript: {
    install: 'npm install ikonym',
    code: `import { createAvatar } from 'ikonym';

const svg = createAvatar('perle-rare', {
  density: 7,
  size: 128,
  radius: 0,
});`,
  },
  PHP: {
    install: 'composer require dicebear/core numera11y/ikonym',
    code: `<?php
use DiceBear\\Avatar;
use DiceBear\\Style;
use Numera11y\\Ikonym\\StyleDefinition;

     $style = Style::fromJson(StyleDefinition::json(7));
 $svg = (string) new Avatar($style, ['seed' => 'nacre-lunaire', 'size' => 128]);`,
  },
  Python: {
    install: 'pip install dicebear-core',
    code: `from pathlib import Path
from dicebear import Avatar, Style

style = Style.from_json(Path('styles/ikonym-7.json').read_text())
svg = Avatar(style, {'seed': 'nacre-lunaire', 'size': 128}).to_string()`,
  },
  Rust: {
    install: 'cargo add dicebear-core serde_json',
    code: `use dicebear_core::{Avatar, Style};
use serde_json::json;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let definition = std::fs::read_to_string("styles/ikonym-7.json")?;
    let style = Style::from_str(&definition)?;
    let svg = Avatar::new(&style, json!({ "seed": "nacre-lunaire", "size": 128 }))?.to_svg();
    println!("{svg}");
    Ok(())
}`,
  },
  Go: {
    install: 'go get github.com/dicebear/dicebear-go/v10',
    code: `package main

import (
    "fmt"
    "os"
    dicebear "github.com/dicebear/dicebear-go/v10"
)

func main() {
    definition, _ := os.ReadFile("styles/ikonym-7.json")
    style, _ := dicebear.NewStyle(definition)
    avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "nacre-lunaire", "size": 128})
    fmt.Println(avatar.SVG())
}`,
  },
  Dart: {
    install: 'dart pub add dicebear_core',
    code: `import 'dart:io';
import 'package:dicebear_core/dicebear_core.dart';

void main() {
final definition = File('styles/ikonym-7.json').readAsStringSync();
final style = Style.parse(definition);
final svg = Avatar(style, {'seed': 'nacre-lunaire', 'size': 128}).svg;
  print(svg);
}`,
  },
  'C#': {
    install: 'dotnet add package DiceBear.Core',
    code: `using System.IO;
using System.Text.Json.Nodes;
using DiceBear;

var definition = File.ReadAllText("styles/ikonym-7.json");
var style = Style.Parse(definition);
var avatar = new Avatar(style, new JsonObject { ["seed"] = "nacre-lunaire", ["size"] = 128 });
var svg = avatar.ToSvg();
Console.WriteLine(svg);`,
  },
};

let currentSeed = 'camembert-astronaute';
let size = 160;
let density: 3 | 5 | 7 | 9 | 12 = 7;
let radius = 0;
let currentLanguage: keyof typeof integrations = 'JavaScript';
const locale: 'en' | 'fr' = document.documentElement.lang === 'fr' ? 'fr' : 'en';
const app = document.querySelector<HTMLDivElement>('#app')!;
const brandMark = '<img class="brand-mark" src="/ikonym-mark.svg" alt="" aria-hidden="true">';

const icon = (name: string) => {
  const paths: Record<string, string> = {
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M5 20h14"/>',
    dice: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

function avatar(seed: string, options: IkonymOptions = {}) {
  const resolved = { size, density, radius, ...options };
  return createLoadedAvatar(seed, {
    size: resolved.size ?? size,
    density: resolved.density ?? density,
    radius: resolved.radius ?? radius,
    idRandomization: resolved.idRandomization,
    title: resolved.title,
  });
}

function framedAvatar(seed: string, options: IkonymOptions = {}) {
  const frameRadius = options.radius ?? radius;
  return `<div class="avatar-frame" style="--frame-ink:var(--ink);--frame-radius:${frameRadius}%">${avatar(seed, options)}</div>`;
}

function previewSize() {
  return Math.round(160 + ((size - 64) / 256) * 80);
}

function render() {
  app.innerHTML = `
    <header class="topbar"><a class="wordmark" href="#home" aria-label="Ikonym">${brandMark}<span>ikonym<span class="dot">.</span></span></a><nav><a href="#studio">Atelier</a><a href="#gallery">Échantillons</a><a href="#how">Intégrations</a><a href="#documentation">Documentation</a></nav><a class="language-switch" id="language-switch" href="/en/" hreflang="en">English</a><a class="github-link" href="#studio">Créer un avatar <span>↓</span></a></header>
    <main id="home">
      <section class="intro"><div class="intro-copy"><h1>Chaque coquillage<br>a son <em>motif.</em></h1><p class="lede">Un coquillage est un bijou naturel, façonné et poli par la mer. L’avatar ne dessine pas sa silhouette : il en réinterprète les reflets en une mosaïque de carreaux vifs, assemblés bord à bord.</p><p class="hero-proof"><span>SVG généré localement</span><span>Motif stable par graine</span><span>Vive</span></p><a class="text-link" href="#studio">Créer un motif ${icon('arrow')}</a></div>
          <div class="hero-art-slot" id="hero-art-slot"></div>
      </section>

      <section class="studio" id="studio" aria-labelledby="studio-title"><div class="studio-heading"><div><h2 id="studio-title">L’atelier de nacre</h2><p class="section-intro">Règle le rythme des stries, puis récupère ton SVG.</p></div><button class="shuffle" id="shuffle">${icon('dice')} Nouvelle graine</button></div>
        <div class="workbench"><div class="preview-pane"><div class="preview-top"><span>APERÇU EN DIRECT</span><span class="live"><i></i> LIVE</span></div><div class="main-avatar" id="main-avatar" style="--preview-size:${previewSize()}px">${framedAvatar(currentSeed)}</div><div class="avatar-caption"><span id="seed-caption">${escapeHtml(currentSeed)}</span><span>graine unique</span></div><div class="preview-actions"><button class="secondary-button" id="copy">${icon('copy')} Copier le SVG</button><button class="download-button" id="download">${icon('download')} Télécharger</button></div></div>
          <div class="controls-pane"><div class="seed-control"><label class="control-label" for="seed">Graine de l’avatar</label><div class="input-wrap"><input id="seed" value="${escapeAttr(currentSeed)}" maxlength="64" autocomplete="off" spellcheck="false" aria-label="Nom ou graine de l’avatar"><span>${currentSeed.length}/64</span></div><p class="hint">La même graine recrée le même motif et la même palette.</p></div>
              <fieldset class="seed-colors" aria-live="polite"><legend><span class="control-label">Palette de couleurs</span></legend><div class="color-pair" id="color-pair">${colorPairMarkup(currentSeed)}</div><p class="hint palette-note">${paletteNote()}</p></fieldset>
               <div class="grid-control"><label class="control-label" for="pattern-density">Densité de la mosaïque</label><select id="pattern-density"><option value="3" ${density === 3 ? 'selected' : ''}>3 × 3 carreaux · expressive</option><option value="5" ${density === 5 ? 'selected' : ''}>5 × 5 carreaux · ample</option><option value="7" ${density === 7 ? 'selected' : ''}>7 × 7 carreaux · équilibrée</option><option value="9" ${density === 9 ? 'selected' : ''}>9 × 9 carreaux · détaillée</option><option value="12" ${density === 12 ? 'selected' : ''}>12 × 12 carreaux · fine</option></select></div>
            <div class="size-control"><div class="range-label"><label class="control-label" for="radius">Arrondi des coins</label><output id="radius-value">${radius}%</output></div><input id="radius" type="range" min="0" max="50" step="2" value="${radius}"><div class="range-ends"><span>Carré</span><span>Cercle</span></div></div>
            <div class="size-control"><div class="range-label"><label class="control-label" for="size">Résolution du SVG</label><output id="size-value">${size} px</output></div><input id="size" type="range" min="64" max="320" step="32" value="${size}"><div class="range-ends"><span>64 px</span><span>320 px</span></div></div>
          </div></div>
      </section>

      <section class="gallery" id="gallery"><div class="gallery-heading"><h2>Chaque empreinte est rare.<br><em>Choisis ton motif.</em></h2><div class="gallery-note"><p>Chaque graine façonne une nouvelle combinaison de stries, d’ondes et de reflets. Le coquillage reste une inspiration : l’avatar en révèle les motifs, jamais sa silhouette.</p><a href="https://amaabj.com/kene/" target="_blank" rel="noreferrer">En savoir plus sur l’art du kené ↗</a></div></div><div class="avatar-grid">${seeds.map((seed, i) => `<button class="avatar-tile tile-${i % 4}" data-seed="${escapeAttr(seed)}" aria-label="Essayer la graine ${escapeAttr(seed)}"><span class="tile-avatar">${framedAvatar(seed, { radius: 0 })}</span><span class="tile-name">${escapeHtml(seed)}</span><span class="tile-arrow">↗</span></button>`).join('')}</div></section>

       <section class="how" id="how"><div class="integration-intro"><h2>Les mêmes motifs.<br><em>Sept langages.</em></h2><p>Une définition DiceBear en JSON compose la même mosaïque dans JavaScript, PHP, Python, Rust, Go, Dart ou C#.</p><p class="release-note"><strong>À télécharger</strong> · le tarball npm installe Ikonym localement; pour les autres langages, récupère le JSON de la densité voulue. Chaque carreau s’aligne bord à bord pour remplir l’avatar.</p><a href="#documentation" class="text-link">Documentation d’installation ${icon('arrow')}</a></div><div class="integration-panel"><div class="language-tabs" role="group" aria-label="Exemples d’intégration par langage">${Object.keys(integrations).map((language, index) => `<button type="button" data-language="${language}" aria-pressed="${index === 0}">${language}</button>`).join('')}</div><div class="install-row"><span>INSTALLER</span><code id="install-command"></code><button id="copy-install" aria-label="Copier la commande d’installation">${icon('copy')}</button></div><div class="code-sample"><pre><code id="integration-code"></code></pre><button id="copy-example" aria-label="Copier l’exemple de code">${icon('copy')}</button></div><p class="language-parity">Même identifiant + même définition = même SVG.</p><div class="release-downloads"><a href="/downloads/ikonym-${packageInfo.version}.tgz" download>Télécharger le package npm (.tgz) <span>↓</span></a><button id="download-style" type="button">JSON · ${density} × ${density}</button></div></div></section>

      <section class="documentation" id="documentation" aria-labelledby="documentation-title"><header class="docs-heading"><h2 id="documentation-title">Guide DuoDoodles</h2><p>Installer le package, choisir la définition de style et l’intégrer proprement dans un projet.</p></header><div class="docs-layout"><nav class="docs-index" aria-label="Sommaire de la documentation"><a href="#docs-install">Installation</a><a href="#docs-definitions">Définitions de style</a><a href="#docs-api">Options de génération</a><a href="#docs-accessibility">Accessibilité & couleurs</a></nav><div class="docs-content"><article id="docs-install"><h3>Installation</h3><p>Le package est disponible en téléchargement direct depuis ce site. Enregistre le tarball dans ton projet puis installe-le avec npm :</p><pre class="docs-command"><code>npm install ./duodoodles-${packageInfo.version}.tgz</code></pre><p>Les autres langages utilisent les moteurs DiceBear officiels et le même fichier JSON de style, disponible ci-dessous. Les exemples exécutables se trouvent dans la section <a href="#how">Intégrations</a>.</p></article><article id="docs-definitions"><h3>Choisir une composition</h3><p>Chaque définition fixe le nombre de rubans; la graine détermine leur courbure, leur rythme et le duo de couleurs.</p><div class="style-downloads"><a href="/downloads/styles/duodoodles-5.json" download><strong>5 rubans</strong><span>Composition ample</span></a><a href="/downloads/styles/duodoodles-7.json" download><strong>7 rubans</strong><span>Composition équilibrée</span></a><a href="/downloads/styles/duodoodles-9.json" download><strong>9 rubans</strong><span>Composition dense</span></a></div></article><article id="docs-api"><h3>Options de génération</h3><dl class="docs-options"><div><dt><code>seed</code></dt><dd>Identifiant stable. Même graine, même composition.</dd></div><div><dt><code>waveCount</code></dt><dd>5, 7 ou 9 rubans; 7 par défaut.</dd></div><div><dt><code>size</code></dt><dd>Dimension intrinsèque du SVG, de 24 à 1024 px; 160 par défaut.</dd></div><div><dt><code>radius</code></dt><dd>Arrondi de 0 (carré) à 50 (cercle).</dd></div><div><dt><code>colors</code></dt><dd>Duo personnalisé <code>[fond, encre]</code>; les couleurs trop peu contrastées sont corrigées.</dd></div><div><dt><code>title</code></dt><dd>Titre accessible ajouté au SVG pour les avatars porteurs d’information.</dd></div></dl><pre class="docs-command"><code>const svg = createAvatar('user-42', {
  density: 7,
  size: 128,
  radius: 0,
  title: 'Avatar de User 42',
});</code></pre></article><article id="docs-accessibility"><h3>Palette et accessibilité</h3><p>Chaque graine produit un duo de couleurs stable. Les vagues contrastent avec leur fond à au moins 4,5:1, au-dessus du seuil WCAG AA de 3:1 pour les graphiques non textuels. Le fond du site reste fixe; l’encre de l’avatar et son cadre varient avec sa graine. Cette mesure couvre le contraste de la palette, pas la conformité complète du produit à WCAG.</p><p>Lorsque le SVG est décoratif près d’un nom visible, tu peux le masquer aux technologies d’assistance. Si l’avatar porte seul une information, renseigne <code>title</code> ou fournis un texte alternatif sur l’élément qui l’affiche.</p></article></div></div></section>
      <footer><a class="wordmark" href="#home" aria-label="Ikonym accueil">${brandMark}<span>ikonym<span class="dot">.</span></span></a><span>Fait avec un peu trop d’enthousiasme <b>♥</b></span><a href="#documentation">Documentation · SVG · DiceBear</a></footer>
    </main>`.replace(/DuoDoodles/g, 'Ikonym').replace(/duodoodles/g, 'ikonym')
      .replace('Chaque définition fixe le nombre de rubans; la graine détermine leur courbure, leur rythme et le duo de couleurs.', 'Le fichier choisi fixe la grille; la graine assemble une mosaïque dense, raccordée et colorée.')
      .replace('Chaque graine produit un duo de couleurs stable. Les vagues contrastent avec leur fond à au moins 4,5:1, au-dessus du seuil WCAG AA de 3:1 pour les graphiques non textuels. Le fond du site reste fixe; l’encre de l’avatar et son cadre varient avec sa graine. Cette mesure couvre le contraste de la palette, pas la conformité complète du produit à WCAG.', 'Chaque carreau est une pièce d’un motif plein. La graine décide du module, de son orientation et de la palette vive; les variations de couleur sont décoratives, et l’interface garde son propre contraste accessible.')
      .replace('Une définition de style DiceBear en JSON suffit pour utiliser les avatars depuis JavaScript, PHP, Python, Rust, Go, Dart ou C#.', 'Une définition DiceBear en JSON compose la même mosaïque dans JavaScript, PHP, Python, Rust, Go, Dart ou C#.')
      .replace('Chaque graine façonne une nouvelle combinaison de stries, d’ondes et de reflets.', 'Chaque graine compose une mosaïque originale de formes vives qui s’assemblent bord à bord.')
      .replace(/waveCount/g, 'density')
      .replace(/rubans/g, 'carreaux')
      .replace(/vagues/g, 'motifs')
      .replace('<strong>5 carreaux</strong>', '<strong>5 × 5 carreaux</strong>')
      .replace('<strong>7 carreaux</strong>', '<strong>7 × 7 carreaux</strong>')
      .replace('<strong>9 carreaux</strong>', '<strong>9 × 9 carreaux</strong>')
        .replace('5, 7 ou 9 carreaux; 7 par défaut', 'grilles 3×3, 5×5, 7×7, 9×9 ou 12×12; 7×7 par défaut')
        .replace(/graine/gi, 'identifiant');
  applyAudienceCopy();
  bindEvents();
  updateIntegration(currentLanguage);
}

function applyAudienceCopy() {
  const english = locale === 'en';
  document.querySelector('.language-fallback')?.remove();
  const staticTitle = document.querySelector<HTMLHeadingElement>('.indexable-content h1');
  if (staticTitle) {
    const secondaryTitle = document.createElement('h2');
    secondaryTitle.id = staticTitle.id;
    secondaryTitle.innerHTML = staticTitle.innerHTML;
    staticTitle.replaceWith(secondaryTitle);
  }
  document.querySelectorAll<HTMLElement>('.indexable-content h2:not(#indexable-title)').forEach((heading) => {
    const subsectionTitle = document.createElement('h3');
    subsectionTitle.innerHTML = heading.innerHTML;
    heading.replaceWith(subsectionTitle);
  });
  const heroSlot = app.querySelector('#hero-art-slot');
  const staticHero = document.querySelector('#static-hero-art');
  if (heroSlot && staticHero) heroSlot.replaceWith(staticHero);
  const heading = app.querySelector('.intro-copy h1');
  if (heading) heading.innerHTML = english ? 'Unique avatars<br><em>for your apps.</em>' : 'Des avatars uniques<br><em>pour vos applications.</em>';
  const lede = app.querySelector('.lede');
  if (lede) lede.textContent = english
    ? 'Ikonym generates geometric avatars from an identifier. Enter a handle, name, or user ID: the same value always produces the same SVG.'
    : 'Ikonym — des avatars géométriques générés à partir d’un identifiant. Saisissez un pseudo, un nom ou un ID utilisateur : la même valeur reproduit le même avatar SVG.';
  const proof = app.querySelector('.hero-proof');
  if (proof) proof.innerHTML = english
    ? '<span>Integration · developers</span><span>Exploration · designers</span><span>Evaluation · product teams</span>'
    : '<span>Intégration · développeurs</span><span>Exploration · designers</span><span>Évaluation · produit</span>';
  const heroAction = app.querySelector('.intro-copy .text-link');
  if (heroAction) heroAction.innerHTML = `${english ? 'Try the generator' : 'Tester le générateur'} ${icon('arrow')}`;
  app.querySelectorAll<HTMLAnchorElement>('.topbar nav a').forEach((link, index) => {
    const labels = english ? ['Studio', 'Samples', 'Integrations', 'Documentation'] : ['Atelier', 'Échantillons', 'Intégrations', 'Documentation'];
    link.textContent = labels[index] ?? link.textContent;
  });
  const languageSwitch = app.querySelector<HTMLAnchorElement>('#language-switch');
  if (languageSwitch) {
    languageSwitch.href = english ? '/fr/' : '/en/';
    languageSwitch.textContent = english ? 'Français' : 'English';
    languageSwitch.hreflang = english ? 'fr' : 'en';
    languageSwitch.setAttribute('aria-label', english ? 'Read this page in French' : 'Read this page in English');
  }
  const headerAction = app.querySelector('.github-link');
  if (headerAction) headerAction.innerHTML = `${english ? 'Try the generator' : 'Créer un avatar'} <span>↓</span>`;
  app.querySelectorAll<HTMLElement>('.specimen figcaption').forEach((caption, index) => {
    const captions = english ? ['3 × 3 · expressive', '5 × 5 · open', '9 × 9 · detailed', '12 × 12 · fine'] : ['3 × 3 · expressive', '5 × 5 · aérée', '9 × 9 · détaillée', '12 × 12 · fine'];
    caption.textContent = captions[index] ?? '';
  });

  const studioHeading = app.querySelector('.studio-heading h2');
  if (studioHeading) studioHeading.textContent = english ? 'Preview an avatar' : 'Évaluez le rendu';
  const studioIntro = app.querySelector('.section-intro');
  if (studioIntro) studioIntro.textContent = english
    ? 'Change the identifier and density, preview the result, then copy or download the SVG.'
    : 'Modifiez l’identifiant et la densité, visualisez le résultat, puis copiez ou téléchargez le SVG.';
  const seedLabel = app.querySelector<HTMLLabelElement>('label[for="seed"]');
  if (seedLabel) seedLabel.textContent = english ? 'Avatar identifier' : 'Identifiant de l’avatar';
  const seedInput = app.querySelector<HTMLInputElement>('#seed');
  if (seedInput) {
    seedInput.placeholder = english ? 'Username, name, or user ID' : 'Pseudo, nom ou ID utilisateur';
    seedInput.setAttribute('aria-label', english ? 'Avatar identifier, username, or name' : 'Identifiant, pseudo ou nom d’utilisateur');
  }
  const shuffleButton = app.querySelector<HTMLButtonElement>('#shuffle');
  if (shuffleButton) shuffleButton.innerHTML = `${icon('dice')} ${english ? 'Generate another ID' : 'Générer un autre identifiant'}`;
  const captionLabel = app.querySelector('#seed-caption + span');
  if (captionLabel) captionLabel.textContent = english ? 'identifier used' : 'identifiant utilisé';
  const seedHint = app.querySelector('.seed-control .hint');
  if (seedHint) seedHint.textContent = english
    ? 'The identifier is hashed internally; the same value always gives the same avatar.'
    : 'L’identifiant est converti en hash en interne; à valeur identique, même avatar.';
  const previewLabel = app.querySelector('.preview-top > span:first-child');
  if (previewLabel) previewLabel.textContent = english ? 'LIVE PREVIEW' : 'APERÇU EN DIRECT';
  app.querySelectorAll<HTMLButtonElement>('.preview-actions button').forEach((button, index) => {
    button.innerHTML = `${icon(index === 0 ? 'copy' : 'download')} ${index === 0 ? (english ? 'Copy SVG' : 'Copier le SVG') : (english ? 'Download' : 'Télécharger')}`;
  });
  const colorLegend = app.querySelector('.seed-colors legend .control-label');
  if (colorLegend) colorLegend.textContent = english ? 'Color palette' : 'Palette de couleurs';
  const paletteNoteElement = app.querySelector('.palette-note');
  if (paletteNoteElement) paletteNoteElement.textContent = english ? '8 solid colors · identifier-based' : '8 couleurs unies · liées à l’identifiant';
  const densityLabel = app.querySelector('label[for="pattern-density"]');
  if (densityLabel) densityLabel.textContent = english ? 'Mosaic density' : 'Densité de la mosaïque';
  const densityOptions = english
    ? ['3 × 3 tiles · bold', '5 × 5 tiles · open', '7 × 7 tiles · balanced', '9 × 9 tiles · detailed', '12 × 12 tiles · fine']
    : ['3 × 3 carreaux · expressive', '5 × 5 carreaux · ample', '7 × 7 carreaux · équilibrée', '9 × 9 carreaux · détaillée', '12 × 12 carreaux · fine'];
  app.querySelectorAll<HTMLSelectElement>('#pattern-density option').forEach((option, index) => { option.textContent = densityOptions[index] ?? option.textContent; });
  const radiusLabel = app.querySelector('label[for="radius"]');
  if (radiusLabel) radiusLabel.textContent = english ? 'Corner roundness' : 'Arrondi des coins';
  const radiusRangeEnds = app.querySelectorAll('#radius + .range-ends span');
  if (radiusRangeEnds[0]) radiusRangeEnds[0].textContent = english ? 'Square' : 'Carré';
  if (radiusRangeEnds[1]) radiusRangeEnds[1].textContent = english ? 'Circle' : 'Cercle';
  const resolutionLabel = app.querySelector('label[for="size"]');
  if (resolutionLabel) resolutionLabel.textContent = english ? 'SVG size' : 'Taille du SVG';

  const galleryHeading = app.querySelector('.gallery-heading h2');
  if (galleryHeading) galleryHeading.innerHTML = english ? 'Compare the motifs<br><em>before integrating.</em>' : 'Comparez les motifs<br><em>avant de les intégrer.</em>';
  const galleryDescription = app.querySelector('.gallery-note p');
  if (galleryDescription) galleryDescription.textContent = english
    ? 'Designers and product teams can compare shapes, densities, and palettes. Matching motif families never touch along an edge. Explore a generative-avatar example for your digital watchlist; select a sample to try it.'
    : 'Designers et équipes produit : comparez formes, densités et palettes. Deux motifs identiques ne se touchent jamais par un côté. Pour votre veille numérique, explorez un exemple concret d’avatars génératifs. Sélectionnez un échantillon pour le tester.';
  const companyLink = app.querySelector<HTMLAnchorElement>('.gallery-note a');
  if (companyLink) {
    companyLink.href = 'https://www.numera11y.fr/';
    companyLink.textContent = english ? 'About Numera11y ↗' : 'Découvrir Numera11y ↗';
    companyLink.removeAttribute('target');
    companyLink.removeAttribute('rel');
  }

  const integrationHeading = app.querySelector('.integration-intro h2');
  if (integrationHeading) integrationHeading.innerHTML = english ? 'From preview to code<br><em>same identifier, same SVG.</em>' : 'De l’essai au code<br><em>même identifiant, même SVG.</em>';
  const integrationDescription = app.querySelector('.integration-intro > p');
  if (integrationDescription) integrationDescription.textContent = english
    ? 'Developers: use the JavaScript library or load the portable DiceBear JSON with a compatible SDK. One identifier and definition reproduce the same SVG in your interface.'
    : 'Développeurs : intégrez la bibliothèque JavaScript ou chargez la définition DiceBear JSON avec les SDK compatibles. Même identifiant, même définition : le même SVG dans votre interface.';
  const licenseNote = app.querySelector('.release-note');
  if (licenseNote) licenseNote.innerHTML = english
    ? '<strong>Open source · MIT</strong> Use, modify, and sell Ikonym. Redistribution, including modified versions, must retain the copyright notice and MIT license. Install with <code>npm install ikonym</code>. <a href="https://opensource.org/license/mit/">Read the MIT license</a>.'
    : '<strong>Open source · MIT</strong> Utilisez, modifiez et commercialisez Ikonym. Toute redistribution, y compris d’une version modifiée, doit conserver la notice de copyright et la licence MIT. Installez avec <code>npm install ikonym</code>. <a href="https://opensource.org/license/mit/">Lire la licence MIT</a>.';
  const integrationLink = app.querySelector<HTMLAnchorElement>('.integration-intro .text-link');
  if (integrationLink) integrationLink.innerHTML = `${english ? 'Read the integration guide' : 'Voir le guide d’intégration'} ${icon('arrow')}`;
  const installLabel = app.querySelector('.install-row > span');
  if (installLabel) installLabel.textContent = english ? 'INSTALL' : 'INSTALLER';
  const copyInstall = app.querySelector('#copy-install');
  if (copyInstall) copyInstall.setAttribute('aria-label', english ? 'Copy the install command' : 'Copier la commande d’installation');
  const copyExample = app.querySelector('#copy-example');
  if (copyExample) copyExample.setAttribute('aria-label', english ? 'Copy the code example' : 'Copier l’exemple de code');
  const packageDownload = app.querySelector('.release-downloads a');
  if (packageDownload) packageDownload.innerHTML = `${english ? 'Download the npm package (.tgz)' : 'Télécharger le package npm (.tgz)'} <span>↓</span>`;

  const docsHeading = app.querySelector('#documentation-title');
  if (docsHeading) docsHeading.textContent = english ? 'Integrate Ikonym' : 'Intégrer Ikonym';
  const docsIntro = app.querySelector('.docs-heading > p');
  if (docsIntro) docsIntro.textContent = english
    ? 'Installation, density options, and examples for adding avatars to your product.'
    : 'Installation, choix de la densité et exemples pour intégrer les avatars à votre produit.';
  const docsNav = english ? ['Installation', 'Style definitions', 'Generation options', 'Accessibility & color'] : ['Installation', 'Définitions de style', 'Options de génération', 'Accessibilité & couleurs'];
  app.querySelectorAll<HTMLAnchorElement>('.docs-index a').forEach((link, index) => { link.textContent = docsNav[index] ?? link.textContent; });
  const installIntro = app.querySelector('#docs-install > p');
  if (installIntro) installIntro.textContent = english ? 'Download the npm package, then install the file in your project:' : 'Téléchargez le package npm, puis installez le fichier dans votre projet :';
  const installMore = app.querySelector('#docs-install > p:nth-of-type(2)');
  if (installMore) installMore.textContent = english
    ? 'For other languages, use the official DiceBear engines and the matching JSON style definition. Find runnable examples in the integrations section.'
    : 'Pour les autres langages, utilisez les moteurs DiceBear officiels et la définition JSON correspondante. Retrouvez des exemples exécutables dans la section Intégrations.';
  const installCommand = app.querySelector('#docs-install .docs-command code');
  if (installCommand) installCommand.textContent = 'npm install ikonym';
  const definitionsHeading = app.querySelector('#docs-definitions h3');
  if (definitionsHeading) definitionsHeading.textContent = english ? 'Choose a density' : 'Choisir une densité';
  const definitionsIntro = app.querySelector('#docs-definitions > p');
  if (definitionsIntro) definitionsIntro.textContent = english
    ? 'Choose a 3×3, 5×5, 7×7, 9×9, or 12×12 grid. The identifier determines the composition and colors.'
    : 'Choisissez une grille de 3 × 3, 5 × 5, 7 × 7, 9 × 9 ou 12 × 12 carreaux. L’identifiant détermine la composition et les couleurs.';
  const downloads = english ? ['Expressive', 'Airy', 'Balanced', 'Detailed', 'Fine detail'] : ['Très expressive', 'Aérée', 'Équilibrée', 'Détaillée', 'Détails fins'];
  const styleDownloads = app.querySelector('#docs-definitions .style-downloads');
  if (styleDownloads) styleDownloads.innerHTML = [3, 5, 7, 9, 12].map((density, index) => `<a href="/downloads/styles/ikonym-${density}.json" download><strong>${density} × ${density}</strong><span>${downloads[index]}</span></a>`).join('');
  const apiHeading = app.querySelector('#docs-api h3');
  if (apiHeading) apiHeading.textContent = english ? 'Generation options' : 'Options de génération';
  const apiNames = english ? ['Identifier (seed)', 'Density', 'Size', 'Corner radius', 'Custom colors', 'Accessible title'] : ['Identifiant (seed)', 'Densité', 'Taille', 'Arrondi des coins', 'Couleurs personnalisées', 'Titre accessible'];
  const apiDescriptions = english
    ? ['A stable identifier such as a username or user ID. The same value and style produce the same composition.', 'Choose a 3×3, 5×5, 7×7, 9×9, or 12×12 grid.', 'The SVG canvas size in pixels.', 'Round the avatar from square to circle.', 'Optionally supply a custom eight-color palette.', 'Add a descriptive title when the avatar conveys information.']
    : ['Identifiant stable (pseudo, nom ou ID utilisateur). À valeur identique, même composition.', 'Grille de 3×3, 5×5, 7×7, 9×9 ou 12×12 carreaux.', 'Taille de la zone SVG en pixels.', 'Arrondissez les coins de la forme carrée au cercle.', 'Fournissez éventuellement une palette personnalisée de huit couleurs.', 'Ajoutez un titre descriptif si l’avatar transmet une information.'];
  app.querySelectorAll('#docs-api dt').forEach((term, index) => { term.textContent = apiNames[index] ?? term.textContent; });
  app.querySelectorAll('#docs-api dd').forEach((description, index) => { description.textContent = apiDescriptions[index] ?? description.textContent; });
  const accessibilityHeading = app.querySelector('#docs-accessibility h3');
  if (accessibilityHeading) accessibilityHeading.textContent = english ? 'Color and accessibility' : 'Couleurs et accessibilité';
  const accessibilityIntro = app.querySelector('#docs-accessibility article p:first-of-type');
  if (accessibilityIntro) accessibilityIntro.textContent = english
    ? 'Tile colors are decorative; do not rely on them alone to communicate information. Interface text and controls keep their own accessible contrast.'
    : 'Les couleurs des carreaux sont décoratives; ne les utilisez pas seules pour transmettre une information. Le texte et les contrôles gardent leur propre contraste accessible.';
  const accessibilityCopy = app.querySelector('#docs-accessibility article p:last-child');
  if (accessibilityCopy) accessibilityCopy.textContent = english
    ? 'If the SVG is decorative beside a visible name, hide it from assistive technology. If the avatar conveys information on its own, add an SVG title or alternative text to the element that displays it.'
    : 'Si le SVG est décoratif à côté d’un nom visible, masquez-le aux technologies d’assistance. Si l’avatar porte seul une information, ajoutez un titre au SVG ou un texte alternatif à l’élément qui l’affiche.';
  const languageParity = app.querySelector('.language-parity');
  if (languageParity) languageParity.textContent = english ? 'Same identifier + same definition = same SVG.' : 'Même identifiant + même définition = même SVG.';
  app.querySelectorAll<HTMLButtonElement>('[data-seed]').forEach((button) => {
    button.setAttribute('aria-label', `${english ? 'Try avatar with identifier' : 'Tester l’avatar avec l’identifiant'} ${button.dataset.seed ?? ''}`);
  });
  const footerNote = app.querySelector('footer > span');
  if (footerNote) footerNote.textContent = english ? 'Ikonym — geometric avatars from an identifier.' : 'Ikonym — des avatars géométriques générés à partir d’un identifiant.';
  const footerLink = app.querySelector<HTMLAnchorElement>('footer > a:last-child');
  if (footerLink) {
    footerLink.href = 'https://www.numera11y.fr/';
    footerLink.textContent = english ? 'Numera11y · Digital tools' : 'Numera11y · Outils numériques';
  }
}

function updatePreview() {
  const mount = document.querySelector('#main-avatar');
  if (mount) {
    mount.innerHTML = framedAvatar(currentSeed);
    (mount as HTMLElement).style.setProperty('--preview-size', `${previewSize()}px`);
  }
  const caption = document.querySelector('#seed-caption');
  if (caption) caption.textContent = currentSeed || (locale === 'en' ? 'no identifier' : 'sans-identifiant');
  const colors = document.querySelector('#color-pair');
  if (colors) colors.innerHTML = colorPairMarkup(currentSeed);
  const note = document.querySelector('.palette-note');
  if (note) note.textContent = paletteNote();
}

function bindEvents() {
  const seedInput = document.querySelector<HTMLInputElement>('#seed')!;
  seedInput.addEventListener('input', () => {
    currentSeed = seedInput.value.slice(0, 64);
    document.querySelector('.input-wrap > span')!.textContent = `${currentSeed.length}/64`;
    updatePreview();
  });
  document.querySelector<HTMLInputElement>('#size')!.addEventListener('input', (event) => {
    size = Number((event.target as HTMLInputElement).value);
    document.querySelector('#size-value')!.textContent = `${size} px`;
    updatePreview();
  });
  document.querySelector<HTMLInputElement>('#radius')!.addEventListener('input', (event) => {
    radius = Number((event.target as HTMLInputElement).value);
    document.querySelector('#radius-value')!.textContent = `${radius}%`;
    updatePreview();
  });
  document.querySelector<HTMLSelectElement>('#pattern-density')!.addEventListener('change', async (event) => {
    const selected = Number((event.target as HTMLSelectElement).value);
    if (selected === 3 || selected === 5 || selected === 7 || selected === 9 || selected === 12) {
      await loadDensity(selected);
      density = selected;
    }
    const styleButton = document.querySelector('#download-style');
    if (styleButton) styleButton.textContent = `JSON · ${density} × ${density}`;
    updateIntegration(currentLanguage);
    updatePreview();
  });
  document.querySelector('#shuffle')!.addEventListener('click', () => {
    currentSeed = seeds[Math.floor(Math.random() * seeds.length)] + '-' + Math.floor(Math.random() * 99);
    seedInput.value = currentSeed;
    updatePreview();
  });
  document.querySelector('#copy')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(avatar(currentSeed));
    toast(locale === 'en' ? 'SVG copied.' : 'Le SVG est copié.');
  });
  document.querySelector('#download')!.addEventListener('click', () => {
    const blob = new Blob([avatar(currentSeed)], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ikonym-${currentSeed || 'motif'}.svg`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((button) => button.addEventListener('click', () => {
    const language = button.dataset.language as keyof typeof integrations;
    if (language in integrations) updateIntegration(language);
  }));
  document.querySelector('#copy-install')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(integrations[currentLanguage].install);
    toast(locale === 'en' ? 'Command copied.' : 'Commande copiée.');
  });
  document.querySelector('#copy-example')!.addEventListener('click', async () => {
    await navigator.clipboard.writeText(document.querySelector('#integration-code')?.textContent ?? integrations[currentLanguage].code);
    toast(locale === 'en' ? 'Example copied.' : 'Exemple copié.');
  });
  document.querySelector('#download-style')!.addEventListener('click', async () => {
    await loadDensity(density);
    const blob = new Blob([JSON.stringify(getLoadedStyleDefinition(density), null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `ikonym-${density}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast(locale === 'en' ? `${density} × ${density} definition downloaded.` : `Définition ${density} × ${density} téléchargée.`);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-seed]').forEach((button) => button.addEventListener('click', () => {
    currentSeed = button.dataset.seed ?? '';
    seedInput.value = currentSeed;
    updatePreview();
    document.querySelector('#studio')?.scrollIntoView({ behavior: 'smooth' });
  }));
}

let toastTimer = 0;
function toast(message: string) {
  document.querySelector('.toast')?.remove();
  const notice = document.createElement('div');
  notice.className = 'toast';
  notice.setAttribute('role', 'status');
  notice.textContent = message;
  document.body.append(notice);
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => notice.remove(), 2400);
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!); }
function escapeAttr(value: string) { return escapeHtml(value); }
function colorPairMarkup(seed: string) {
  const palette = getLoadedPalette(seed, density);
  const colors = browserPaletteRoles.map((role) => palette.colors[role]);
  const paletteStrip = `linear-gradient(90deg, ${colors.join(', ')})`;
  const entries = [
    { label: locale === 'en' ? 'Base color' : 'Base', value: palette.colors.navy, chip: palette.colors.navy },
    { label: locale === 'en' ? 'Full palette' : 'Palette', value: locale === 'en' ? 'VIVID' : 'VIVE', chip: paletteStrip },
  ];
  return entries.map(({ label, value, chip }) => `<span class="color-chip" title="${label} ${value}"><i style="--chip:${chip}"></i><code>${value}</code></span>`).join('');
}
function paletteNote() {
  return locale === 'en' ? 'Edge-to-edge tiles · 8 colors' : 'Carreaux raccordés · 8 couleurs';
}
function updateIntegration(language: keyof typeof integrations) {
  currentLanguage = language;
  const example = integrations[language];
  const install = document.querySelector('#install-command');
  const code = document.querySelector('#integration-code');
  if (install) install.textContent = example.install;
  if (code) code.textContent = example.code
    .replace(/ikonym-7\.json/g, `ikonym-${density}.json`)
    .replace(/density: 7/g, `density: ${density}`);
  document.querySelectorAll<HTMLButtonElement>('[data-language]').forEach((button) => {
    const selected = button.dataset.language === language;
    button.setAttribute('aria-pressed', String(selected));
  });
}

export async function startIkonymApp() {
  await loadDensity(density);
  render();
}
