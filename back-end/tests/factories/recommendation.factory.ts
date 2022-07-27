import { Recommendation } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database.js';
import { recommendationBodyFactory } from './recommendationBody.factory';

export const createRecommendation = async (): Promise<Recommendation> => {
  const body = recommendationBodyFactory();
  const recommendation = await prisma.recommendation.create({
    data: {
      ...body,
      score: faker.datatype.number({ min: 0, max: 50 }),
    },
  });
  return recommendation;
};

export const createManyRecommendations = async (
  count: number,
): Promise<Recommendation[]> => {
  const recommendations = await Promise.all(
    Array.from({ length: count }, () => createRecommendation()),
  );
  return recommendations;
};
