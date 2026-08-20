// ponytail: seed slownika przy starcie kontenera; no-op gdy kolekcja juz pelna.
// Jesli kiedys dojdzie druga instancja backendu - przeniesc do osobnego job-a.
const fs = require('fs');
const path = require('path');
const prisma = require('./lib/prisma');

const read = (file, isProfane) =>
  fs
    .readFileSync(path.join(__dirname, 'lib', file), 'utf-8')
    .split('\n')
    .map((word) => word.trim().toLowerCase())
    .filter(Boolean)
    .map((word) => ({ word, isProfane }));

(async () => {
  if ((await prisma.word.count()) > 0) return console.log('Words already seeded');

  const words = [...read('no_profane.txt', false), ...read('profane.txt', true)];
  // `word` jest @unique, a listy sie nakladaja (np. "abuse") - wygrywa profane
  const unique = [...new Map(words.map((w) => [w.word, w])).values()];

  for (let i = 0; i < unique.length; i += 1000) {
    await prisma.word.createMany({ data: unique.slice(i, i + 1000) });
  }
  console.log(`Seeded ${unique.length} words`);
})()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
