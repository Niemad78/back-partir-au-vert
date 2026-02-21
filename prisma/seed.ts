import { PrismaClient, Duree, TypePublication } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function ask(rl: readline.Interface, question: string): Promise<number> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const num = parseInt(answer, 10);
      resolve(isNaN(num) || num < 0 ? 0 : num);
    });
  });
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function slugify(text: string, suffix: number): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') +
    '-' +
    suffix
  );
}

// ─── Données fictives ─────────────────────────────────────────────────────────

const VILLES = [
  'Grenoble',
  'Chamonix',
  'Annecy',
  'Briançon',
  'Gap',
  'Chambéry',
  'Albertville',
  'Valence',
  'Bourg-en-Bresse',
  'Aix-les-Bains',
  'Megève',
  'Les Deux Alpes',
  'Vars',
  'Embrun',
  'Barcelonnette',
];

const DEPARTEMENTS = [38, 74, 5, 4, 73, 1, 26, 7, 15, 63, 43, 48, 30, 34, 9];

const THEMES_NOMS = [
  'Randonnée',
  'Vélo de montagne',
  'Escalade',
  'Kayak',
  'Via ferrata',
  'Trail',
  'Parapente',
  'Canyoning',
  'Ski de randonnée',
  'Surf des neiges',
  'Accrobranche',
  'Spéléologie',
  "Tir à l'arc",
  'Équitation',
  'Pêche sportive',
];

const ACTIVITES_NOMS = [
  'Randonnée en forêt',
  'Balade à vélo',
  'Escalade en falaise',
  'Descente en kayak',
  'Via ferrata panoramique',
  'Trail des crêtes',
  'Vol en parapente',
  'Canyoning sauvage',
  'Ski de randonnée',
  'Surf initiation',
  'Bivouac étoilé',
  'Accrobranche famille',
  'Journée spéléologie',
  'Sortie pêche en rivière',
  'Randonnée raquettes',
  'VTT enduro',
  'Nuit en refuge',
  'Observation faune',
  'Escalade débutant',
  'Descente en rappel',
];

const POINTS_FORTS = [
  'Vue panoramique exceptionnelle',
  'Guide certifié et expérimenté',
  'Matériel professionnel fourni',
  'Accessible aux débutants',
  'Petit groupe (max 8 personnes)',
  'Repas local inclus',
  'Photos souvenir offertes',
  'Brevet officiel délivré',
  'En pleine nature préservée',
  'Tous niveaux acceptés',
  'Découverte de la faune locale',
  'Circuit inédit hors des sentiers',
];

const FAQ_QR = [
  {
    q: "Quelle est la durée de l'activité ?",
    r: "La durée varie selon l'activité, en général entre 2h et une journée complète. Consultez la fiche de chaque activité pour plus de détails.",
  },
  {
    q: 'Quel équipement dois-je apporter ?',
    r: 'Nous vous recommandons des chaussures de marche adaptées, des vêtements en couches, une gourde et de la crème solaire. Le matériel technique est fourni.',
  },
  {
    q: "L'activité est-elle accessible aux débutants ?",
    r: 'Oui, la plupart de nos activités sont accessibles aux débutants avec un encadrement professionnel. Le niveau requis est précisé sur chaque fiche.',
  },
  {
    q: "Y a-t-il une limite d'âge ?",
    r: "L'âge minimum est généralement de 8 ans pour les activités familiales, et 16 ans pour les activités plus engagées. Vérifiez la fiche de l'activité.",
  },
  {
    q: 'Comment se déroule la réservation ?',
    r: "La réservation s'effectue directement sur notre site en quelques étapes simples. Un acompte de 30% est demandé à la réservation.",
  },
  {
    q: 'Puis-je annuler ma réservation ?',
    r: "Vous pouvez annuler jusqu'à 48h avant la date de l'activité pour un remboursement complet. Au-delà, l'acompte est conservé.",
  },
  {
    q: 'Le matériel est-il fourni ?',
    r: "Oui, tout le matériel spécifique à l'activité (casque, harnais, pagaie, etc.) est fourni et inclus dans le prix.",
  },
  {
    q: 'Que se passe-t-il en cas de mauvais temps ?',
    r: "En cas de conditions météo dangereuses, nous reportons l'activité à une date ultérieure de votre choix ou proposons un remboursement complet.",
  },
  {
    q: 'Y a-t-il un parking sur place ?',
    r: 'Un parking gratuit est disponible sur place ou à proximité du point de rendez-vous. Les détails sont communiqués après réservation.',
  },
  {
    q: 'Les activités sont-elles assurées ?',
    r: 'Toutes nos activités sont encadrées par des professionnels diplômés et couvertes par une assurance responsabilité civile professionnelle.',
  },
  {
    q: 'Quelle est la capacité maximale du groupe ?',
    r: "Nous limitons volontairement la taille des groupes pour garantir la qualité de l'encadrement et le respect de l'environnement.",
  },
  {
    q: 'Proposez-vous des tarifs groupe ou famille ?',
    r: 'Oui, des tarifs réduits sont disponibles pour les groupes de plus de 6 personnes et pour les familles avec enfants. Contactez-nous pour un devis.',
  },
];

const PARTENAIRES_NOMS = [
  'Office de Tourisme Alpin',
  'Montagne & Aventure',
  'Nature Évasion',
  'Vert Horizon',
  'EcoTrail France',
  'Les Guides Verts',
  'Alpin Sport Pro',
  'Randonnées Pyrénées',
  'Mer & Montagne',
  'Loisirs Verts',
  'Alpes Outdoor',
  'Aventure Nature',
];

const EQUIPE = [
  {
    nom: 'Thomas Dupont',
    desc: "Guide de montagne certifié avec 10 ans d'expérience en alpinisme et randonnée haute montagne.",
  },
  {
    nom: 'Marie Leroy',
    desc: "Monitrice d'escalade passionnée par la nature et l'environnement. Diplômée d'État BPJEPS.",
  },
  {
    nom: 'Lucas Bernard',
    desc: 'Expert en canyoning et activités nautiques, formé aux premiers secours en montagne.',
  },
  {
    nom: 'Sophie Martin',
    desc: "Spécialiste trail et randonnée, ambassadrice du tourisme durable et de l'éco-responsabilité.",
  },
  {
    nom: 'Julien Moreau',
    desc: 'Instructeur parapente avec plus de 1 500 heures de vol. Brevet de pilote professionnel.',
  },
  {
    nom: 'Camille Simon',
    desc: "Coordinatrice de l'expérience client et des réservations, passionnée de pleine nature.",
  },
  {
    nom: 'Antoine Laurent',
    desc: "Guide VTT et vélo de montagne, ancien champion régional d'enduro.",
  },
  {
    nom: 'Emma Petit',
    desc: 'Responsable développement et partenariats éco-touristiques, engagée pour la biodiversité.',
  },
  {
    nom: 'Hugo Rousseau',
    desc: 'Guide spéléologie et escalade, passionné par la géologie et les milieux souterrains.',
  },
  {
    nom: 'Léa Vincent',
    desc: "Monitrice kayak et canyoning, diplômée de l'École Nationale de Voile et des Sports Nautiques.",
  },
];

const PUBLICATION_TITRES = [
  'Notre histoire',
  'Conditions Générales de Vente',
  'Mentions légales',
  'Séminaires en pleine nature',
  'Découvrez nos valeurs',
  "L'éco-tourisme responsable",
  'Notre engagement environnemental',
  'Politique de confidentialité',
];

const PUBLICATION_TYPES: TypePublication[] = [
  'histoire',
  'seminaire',
  'cgv',
  'mentions_legales',
  'autre',
  'autre',
  'histoire',
  'autre',
];

const ARTICLE_TITRES = [
  'Top 5 des randonnées en été',
  'Comment choisir ses chaussures de trail',
  'Les bienfaits du sport en plein air',
  'Guide du débutant en escalade',
  'Nos meilleures destinations nature',
  'Préparer son premier bivouac',
  "L'éco-tourisme, un tourisme d'avenir",
  'Découverte du canyoning en Ardèche',
  "Initiation au parapente : ce qu'il faut savoir",
  'VTT : les plus beaux sentiers des Alpes',
  'Pourquoi pratiquer des activités en groupe ?',
  'La faune alpine en hiver',
];

// ─── Images seeds ──────────────────────────────────────────────────────────────
// Chemins relatifs au dossier public/assets/ (servi statiquement)

const IMAGES_ACTIVITE = [
  'seeds/activite-1-first.png',
  'seeds/activite-2-second.png',
  'seeds/activite-3-second.png',
  'seeds/activite-4-first.png',
  'seeds/activite-5-second.png',
  'seeds/activite-6-first.png',
  'seeds/activite-7-first.png',
  'seeds/activite-8-first.jpg',
  'seeds/activite-9-first.png',
  'seeds/activite-10-second.png',
  'seeds/activite-11-second.png',
];

const IMAGES_EQUIPE = [
  'seeds/equipe-1.png',
  'seeds/equipe-2.png',
  'seeds/equipe-3.png',
  'seeds/equipe-4.png',
];

const IMAGES_PARTENAIRE = [
  'seeds/partenaire-1.png',
  'seeds/partenaire-2.jpg',
  'seeds/partenaire-3.png',
  'seeds/partenaire-4.png',
];

const IMAGES_SEMINAIRE = [
  'seeds/seminaire-1.png',
  'seeds/seminaire-2.png',
  'seeds/seminaire-3.png',
];

const IMAGES_THEME = [
  'seeds/theme-1.webp',
  'seeds/theme-2.webp',
  'seeds/theme-3.webp',
  'seeds/theme-4.webp',
  'seeds/theme-5.webp',
  'seeds/theme-6.webp',
];

// Images pouvant illustrer les articles : activité, équipe ou séminaire
const IMAGES_ARTICLE = [
  ...IMAGES_ACTIVITE,
  ...IMAGES_EQUIPE,
  ...IMAGES_SEMINAIRE,
];

function pickImage(list: string[], index: number): string {
  return list[index % list.length];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    Seeding de la base de données             ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log('Entrez 0 pour ignorer une table.\n');

  const nbFaqs = await ask(rl, '❓  Nombre de FAQs               : ');
  const nbPublications = await ask(rl, '📄  Nombre de Publications       : ');
  const nbPartenaires = await ask(rl, '🤝  Nombre de Partenaires        : ');
  const nbEquipes = await ask(rl, '👥  Nombre de membres Equipe     : ');
  const nbThemes = await ask(rl, '🏷️  Nombre de Themes             : ');
  const nbActivites = await ask(rl, '🏃  Nombre de Activités          : ');
  const nbArticles = await ask(rl, '📝  Nombre de Articles           : ');
  const nbPointsForts = await ask(rl, '⭐  Points forts par activité    : ');
  const nbImagesParActivite = await ask(
    rl,
    '🖼️  Images par activité          : ',
  );
  const createContact = await ask(rl, '📞  Créer un Contact (1=oui/0=non): ');

  rl.close();

  console.log('\n⏳ Création des données en cours...\n');

  // ── 1. Users (non gérés par ce script) ────────────────────────────────────
  const users = await prisma.user.findMany({ select: { id: true } });

  // ── 2. FAQs ────────────────────────────────────────────────────────────────
  if (nbFaqs > 0) {
    for (let i = 0; i < nbFaqs; i++) {
      const item = FAQ_QR[i % FAQ_QR.length];
      await prisma.faq.create({
        data: {
          question: item.q,
          reponse: item.r,
        },
      });
    }
    console.log(`✅ ${nbFaqs} FAQ(s) créée(s)`);
  }

  // ── 3. Publications ────────────────────────────────────────────────────────
  const publications: { id: string }[] = [];
  if (nbPublications > 0) {
    for (let i = 0; i < nbPublications; i++) {
      const pub = await prisma.publication.create({
        data: {
          titre: PUBLICATION_TITRES[i % PUBLICATION_TITRES.length],
          contenu: `<p>Contenu de la publication « ${PUBLICATION_TITRES[i % PUBLICATION_TITRES.length]} ».</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</p>`,
          type: PUBLICATION_TYPES[i % PUBLICATION_TYPES.length],
        },
      });
      publications.push({ id: pub.id });
    }
    console.log(`✅ ${nbPublications} Publication(s) créée(s)`);
  }

  // ── 4. Partenaires ─────────────────────────────────────────────────────────
  const partenaires: { id: string }[] = [];
  if (nbPartenaires > 0) {
    for (let i = 0; i < nbPartenaires; i++) {
      const p = await prisma.partenaire.create({
        data: { nom: PARTENAIRES_NOMS[i % PARTENAIRES_NOMS.length] },
      });
      partenaires.push({ id: p.id });
    }
    console.log(`✅ ${nbPartenaires} Partenaire(s) créé(s)`);
  }

  // ── 5. Équipe ──────────────────────────────────────────────────────────────
  const equipes: { id: string }[] = [];
  if (nbEquipes > 0) {
    for (let i = 0; i < nbEquipes; i++) {
      const member = EQUIPE[i % EQUIPE.length];
      const e = await prisma.equipe.create({
        data: { nom: member.nom, description: member.desc },
      });
      equipes.push({ id: e.id });
    }
    console.log(`✅ ${nbEquipes} membre(s) Equipe créé(s)`);
  }

  // ── 6. Themes ──────────────────────────────────────────────────────────────
  const themes: { id: string }[] = [];
  if (nbThemes > 0) {
    for (let i = 0; i < nbThemes; i++) {
      const baseName = THEMES_NOMS[i % THEMES_NOMS.length];
      const nom =
        i < THEMES_NOMS.length
          ? baseName
          : `${baseName} ${Math.floor(i / THEMES_NOMS.length) + 1}`;
      const t = await prisma.theme.create({ data: { nom } });
      themes.push({ id: t.id });
    }
    console.log(`✅ ${nbThemes} Thème(s) créé(s)`);
  }

  // ── 7. Activités ───────────────────────────────────────────────────────────
  const activites: { id: string }[] = [];
  if (nbActivites > 0) {
    const durees: Duree[] = ['journee', 'matinee', 'apres_midi'];
    for (let i = 0; i < nbActivites; i++) {
      const nom = ACTIVITES_NOMS[i % ACTIVITES_NOMS.length];
      const ville = VILLES[i % VILLES.length];
      const a = await prisma.activite.create({
        data: {
          nom: `${nom} ${i + 1}`,
          description: `<p>Description de l'activité « ${nom} ». Une expérience inoubliable en pleine nature avec des guides professionnels certifiés.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>`,
          prix: randInt(25, 150),
          ville,
          departement: DEPARTEMENTS[i % DEPARTEMENTS.length],
          nbPersonnesMax: randInt(4, 20),
          duree: durees[i % 3],
          latitude: randFloat(43.5, 47.5),
          longitude: randFloat(1.5, 7.5),
          adresse: `${randInt(1, 99)} Chemin des Sommets, ${ville}`,
          accessibilite:
            'Accessible avec accompagnement. Consultez-nous pour les besoins spécifiques.',
          slug: slugify(nom, i + 1),
        },
      });
      activites.push({ id: a.id });
    }
    console.log(`✅ ${nbActivites} Activité(s) créée(s)`);
  }

  // ── 8. Articles ────────────────────────────────────────────────────────────
  const articles: { id: string }[] = [];
  if (nbArticles > 0) {
    if (users.length === 0) {
      console.log('⚠️  Articles ignorés (aucun User trouvé en base)');
    } else {
      for (let i = 0; i < nbArticles; i++) {
        const titre = ARTICLE_TITRES[i % ARTICLE_TITRES.length];
        const art = await prisma.article.create({
          data: {
            titre,
            contenu: `<p>${titre}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>`,
            userId: users[i % users.length].id,
          },
        });
        articles.push({ id: art.id });
      }
      console.log(`✅ ${nbArticles} Article(s) créé(s)`);
    }
  }

  // ── 9. ThemeOnActivite ─────────────────────────────────────────────────────
  if (activites.length > 0 && themes.length > 0) {
    let totalAssoc = 0;
    for (const activite of activites) {
      const nbMax = Math.min(randInt(1, 3), themes.length);
      const shuffled = [...themes]
        .sort(() => Math.random() - 0.5)
        .slice(0, nbMax);
      for (const theme of shuffled) {
        try {
          await prisma.themeOnActivite.create({
            data: { activiteId: activite.id, themeId: theme.id },
          });
          totalAssoc++;
        } catch {
          // doublons ignorés (contrainte composite)
        }
      }
    }
    console.log(`✅ ${totalAssoc} association(s) Thème↔Activité créée(s)`);
  }

  // ── 10. Points Forts ───────────────────────────────────────────────────────
  if (nbPointsForts > 0 && activites.length > 0) {
    let total = 0;
    for (const activite of activites) {
      for (let j = 0; j < nbPointsForts; j++) {
        await prisma.pointFort.create({
          data: {
            nom: POINTS_FORTS[total % POINTS_FORTS.length],
            activiteId: activite.id,
          },
        });
        total++;
      }
    }
    console.log(`✅ ${total} Point(s) Fort(s) créé(s)`);
  }

  // ── 11. Images ─────────────────────────────────────────────────────────────
  // Les images proviennent du dossier public/assets/seeds/ déjà présent sur le serveur.
  let totalImages = 0;
  let imageCounter = 0;

  // N images par activité → images "activite"
  if (nbImagesParActivite > 0) {
    for (const activite of activites) {
      for (let j = 0; j < nbImagesParActivite; j++) {
        await prisma.image.create({
          data: {
            nom: pickImage(IMAGES_ACTIVITE, imageCounter++),
            activiteId: activite.id,
          },
        });
        totalImages++;
      }
    }
  }

  // 1 image par thème (contrainte unique themeId) → images "theme"
  for (let i = 0; i < themes.length; i++) {
    await prisma.image.create({
      data: { nom: pickImage(IMAGES_THEME, i), themeId: themes[i].id },
    });
    totalImages++;
  }

  // 1 image par partenaire (contrainte unique partenaireId) → images "partenaire"
  for (let i = 0; i < partenaires.length; i++) {
    await prisma.image.create({
      data: {
        nom: pickImage(IMAGES_PARTENAIRE, i),
        partenaireId: partenaires[i].id,
      },
    });
    totalImages++;
  }

  // 1 image par membre équipe (contrainte unique equipeId) → images "equipe"
  for (let i = 0; i < equipes.length; i++) {
    await prisma.image.create({
      data: { nom: pickImage(IMAGES_EQUIPE, i), equipeId: equipes[i].id },
    });
    totalImages++;
  }

  // 1 image par publication → images "seminaire"
  for (let i = 0; i < publications.length; i++) {
    await prisma.image.create({
      data: {
        nom: pickImage(IMAGES_SEMINAIRE, i),
        publicationId: publications[i].id,
      },
    });
    totalImages++;
  }

  // 1 image par article → images "activite", "equipe" ou "seminaire" (aléatoire)
  for (let i = 0; i < articles.length; i++) {
    await prisma.image.create({
      data: { nom: pickImage(IMAGES_ARTICLE, i), articleId: articles[i].id },
    });
    totalImages++;
  }

  if (totalImages > 0) {
    console.log(`✅ ${totalImages} Image(s) créée(s) depuis les seeds`);
  }

  // ── 12. Contact ────────────────────────────────────────────────────────────
  if (createContact === 1) {
    await prisma.contact.create({
      data: {
        telephone: '04 76 00 00 00',
        email: 'contact@partir-au-vert.fr',
        facebook: 'https://facebook.com/partirauvent',
        instagram: 'https://instagram.com/partirauvent',
        twitter: null,
        linkedin: null,
        tiktok: null,
      },
    });
    console.log(`✅ Contact créé`);
  }

  console.log('\n✨ Seeding terminé avec succès !\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
