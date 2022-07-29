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

describe('getByIdOrFail tests', () => {
  it('should return a recommendation', async () => {
    const id = +faker.datatype.uuid();
    const recommendation = {
      id,
      name: faker.random.word(),
      youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
      score: 0,
    };
    const find = jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => recommendation);

    const receivedRecommendation = await recommendationService.getById(id);

    expect(find).toHaveBeenCalled();
    expect(receivedRecommendation).toEqual(recommendation);
  });

  it('should throw an error if the recommendation does not exist', async () => {
    const id = +faker.datatype.uuid();
    const find = jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => null);

    const promise = recommendationService.getById(id);

    expect(find).toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError());
  });
});

describe('upvote tests', () => {
  it('should upvote a recommendation', async () => {
    const id = +faker.datatype.uuid();

    jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => ({
        id,
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
        score: 0,
      }));

    const updateScore = jest
      .spyOn(recommendationRepository, 'updateScore')
      .mockImplementationOnce((): any => {});

    await recommendationService.upvote(id);
    expect(updateScore).toHaveBeenCalled();
  });

  it('should throw an error if the recommendation does not exist', async () => {
    const id = +faker.datatype.uuid();
    const find = jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => null);

    const promise = recommendationService.upvote(id);

    expect(find).toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError());
  });
});
