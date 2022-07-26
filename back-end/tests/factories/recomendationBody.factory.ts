import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from './../../src/services/recommendationsService.js';
export const recommendationBodyFactory = (): CreateRecommendationData => {
  return {
    name: faker.name.firstName(),
    youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
  };
};
