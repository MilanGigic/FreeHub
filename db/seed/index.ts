import { seedMunicipalities } from "./seedMunicipalities";

async function main() {
  await seedMunicipalities();
  process.exit(0);
}

main();
