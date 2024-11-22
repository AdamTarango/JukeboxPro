const prisma = require("../prisma");
const seed = async (numTracks=20) => {
  tracks = []
  for (i=0; i<numTracks; i++){
    tracks.push({ name: `track ${i}` })
  }
  await prisma.track.createMany({ data : tracks })
  
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });