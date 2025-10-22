import { prisma } from '../../../prisma/prismaClient.js';
export const TransactionWrapper = async function (callback) {
  try {
    await prisma.$transaction(callback);
  } catch (err) {
    console.error(err);
    prisma.$rollback();
  } finally {
    await prisma.$disconnect();
  }
};
