import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import {
  recommendationService,
  CreateRecommendationData,
} from '../../src/services/recommendationsService.js';
import { recommendationRepository } from '../../src/repositories/recommendationRepository.js';
import { conflictError, notFoundError } from '../../src/utils/errorUtils.js';

describe('should return true', () => {
  it('should return true', () => {
    expect(true).toBe(true);
  });
});

describe('insert tests', () => {
  it('should insert a recommendation', async () => {
    const createRecommendationData: CreateRecommendationData = {
      name: faker.random.word(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
    };
    const findByName = jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => null);
    const create = jest
      .spyOn(recommendationRepository, 'create')
      .mockImplementationOnce((): any => {});

    await recommendationService.insert(createRecommendationData);

    expect(findByName).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
  });

  it('should throw an error if the recommendation already exists', async () => {
    const createRecommendationData: CreateRecommendationData = {
      name: faker.random.word(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
    };
    const findByName = jest
      .spyOn(recommendationRepository, 'findByName')
      .mockImplementationOnce((): any => ({
        id: 1,
        name: createRecommendationData.name,
        youtubeLink: createRecommendationData.youtubeLink,
        score: 0,
      }));

    const promise = recommendationService.insert(createRecommendationData);

    expect(findByName).toHaveBeenCalled();
    expect(promise).rejects.toEqual(
      conflictError('Recommendations names must be unique'),
    );
  });
});
