import { Recommendation } from '@prisma/client';
import { prisma } from '../../src/database.js';
import { recommendationBodyFactory } from './recommendationBody.factory';

export const createRecommendation = async (): Promise<Recommendation> => {
  const recommendation = await prisma.recommendation.create({
    data: recommendationBodyFactory(),
  });
  return recommendation;
};
