import { prisma } from '../../src/database.js';

export const deleteAllData = async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
};
