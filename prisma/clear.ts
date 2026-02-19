import { PrismaClient } from '@prisma/client';
import * as readline from 'readline';

const prisma = new PrismaClient();

function confirm(rl: readline.Interface, question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase() === 'oui');
    });
  });
}

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║    Suppression de toutes les données         ║');
  console.log('╚══════════════════════════════════════════════╝\n');
  console.log(
    '⚠️  Cette action supprime TOUTES les données de TOUTES les tables.',
  );
  console.log('⚠️  Elle est IRRÉVERSIBLE.\n');

  const ok = await confirm(rl, 'Tapez "oui" pour confirmer : ');
  rl.close();

  if (!ok) {
    console.log('\n❌ Opération annulée.\n');
    return;
  }

  console.log('\n⏳ Suppression en cours...\n');

  // Ordre de suppression : enfants (FK) avant parents
  //   Image             → référence Activite, Theme, Publication, Partenaire, Equipe, Article
  //   ThemeOnActivite   → référence Activite, Theme
  //   PointFort         → référence Activite
  //   Article           → référence User
  //   Activite          → parent (plus de FK entrants après les étapes précédentes)
  //   Theme             → parent
  //   Partenaire        → parent
  //   Equipe            → parent
  //   Publication       → parent
  //   Faq, Contact      → aucune dépendance
  //   User              → non géré par ce script

  const [
    images,
    themeOnActivites,
    pointForts,
    articles,
    activites,
    themes,
    partenaires,
    equipes,
    publications,
    faqs,
    contacts,
  ] = await prisma.$transaction([
    prisma.image.deleteMany(),
    prisma.themeOnActivite.deleteMany(),
    prisma.pointFort.deleteMany(),
    prisma.article.deleteMany(),
    prisma.activite.deleteMany(),
    prisma.theme.deleteMany(),
    prisma.partenaire.deleteMany(),
    prisma.equipe.deleteMany(),
    prisma.publication.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.contact.deleteMany(),
  ]);

  const summary = [
    { table: 'Image', count: images.count },
    { table: 'ThemeOnActivite', count: themeOnActivites.count },
    { table: 'PointFort', count: pointForts.count },
    { table: 'Article', count: articles.count },
    { table: 'Activite', count: activites.count },
    { table: 'Theme', count: themes.count },
    { table: 'Partenaire', count: partenaires.count },
    { table: 'Equipe', count: equipes.count },
    { table: 'Publication', count: publications.count },
    { table: 'Faq', count: faqs.count },
    { table: 'Contact', count: contacts.count },
  ];

  summary.forEach(({ table, count }) => {
    const label = table.padEnd(16);
    if (count > 0) {
      console.log(`🗑️  ${label} : ${count} entrée(s) supprimée(s)`);
    } else {
      console.log(`   ${label} : (vide)`);
    }
  });

  const total = summary.reduce((sum, r) => sum + r.count, 0);
  console.log(
    `\n✨ ${total} entrée(s) supprimée(s) au total. Base de données vidée.\n`,
  );
}

main()
  .catch((e) => {
    console.error('\n❌ Erreur lors de la suppression :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
