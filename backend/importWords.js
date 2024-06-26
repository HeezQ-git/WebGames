const fs = require('fs');
const path = require('path');
const prisma = require('./lib/prisma');

async function main() {
  // const filePath = path.join(__dirname, 'lib', 'profane.txt');
  // const words = fs
  //   .readFileSync(filePath, 'utf-8')
  //   .split('\n')
  //   .map((word) => word.trim())
  //   .filter(Boolean);

  // const wordEntries = words.map((word) => ({
  //   word,
  //   isProfane: true, // assuming all words in filtered_words.txt are not profane
  // }));

  // // Insert words in batches to avoid performance issues
  // const batchSize = 1000;
  // for (let i = 0; i < wordEntries.length; i += batchSize) {
  //   const batch = wordEntries.slice(i, i + batchSize);
  //   await prisma.word.createMany({
  //     data: batch,
  //   });
  //   console.log(`Inserted batch ${i / batchSize + 1}`);
  // }

  // console.log('All words imported successfully');

  // filter words that are only 5 characters long and put them in a new .json file

  const filePath = path.join(__dirname, 'lib', 'no_profane.txt');
  const words = fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .map((word) => word.trim())
    .filter(Boolean);

  fs.writeFileSync(
    path.join(__dirname, 'lib', 'no_profane.json'),
    JSON.stringify(
      words.filter((word) => word.length === 5),
      null,
      2
    )
  );

  console.log('Filtered words exported successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
