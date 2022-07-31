/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import { jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
// import { PrismaPromise, Recommendation } from '@prisma/client';
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

describe('downvote tests', () => {
  it('should throw an error if the recommendation does not exist', async () => {
    const id = +faker.datatype.uuid();
    const find = jest
      .spyOn(recommendationRepository, 'find')
      .mockImplementationOnce((): any => null);

    const promise = recommendationService.downvote(id);

    expect(find).toHaveBeenCalled();
    expect(promise).rejects.toEqual(notFoundError());
  });

  it('should downvote a recommendation', async () => {
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
      .mockImplementationOnce((): any => ({
        id,
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
        score: faker.datatype.number({ min: -4, max: 50 }),
      }));

    await recommendationService.downvote(id);
    expect(updateScore).toHaveBeenCalled();
  });

  it('should remove a recommendation when its score is lower than -5', async () => {
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
      .mockImplementationOnce((): any => ({
        id,
        name: faker.random.word(),
        youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
        score: -6,
      }));

    const remove = jest
      .spyOn(recommendationRepository, 'remove')
      .mockImplementationOnce((): any => {});

    await recommendationService.downvote(id);

    expect(updateScore).toBeCalled();
    expect(remove).toBeCalled();
  });
});

describe('get tests', () => {
  it('shold call findAll function', async () => {
    const findAll = jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => {});

    await recommendationService.get();

    expect(findAll).toBeCalled();
  });
});

describe('getTop tests', () => {
  it('should call getAmountByScore', async () => {
    const amount = faker.datatype.number({ min: 1, max: 10 });
    const getAmountByScore = jest
      .spyOn(recommendationRepository, 'getAmountByScore')
      .mockImplementationOnce((): any => {});

    await recommendationService.getTop(amount);

    expect(getAmountByScore).toBeCalled();
  });
});

describe('getRandom tests', () => {
  it('random < 0.7', async () => {
    const random = jest
      .spyOn(Math, 'random')
      .mockImplementationOnce((): any =>
        faker.datatype.float({ min: 0, max: 0.6, precision: 0.1 }),
      );

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => [
        {
          id: 1,
          name: faker.random.word(),
          youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
          score: faker.datatype.number({ min: 11, max: 50 }),
        },
        {
          id: 2,
          name: faker.random.word(),
          youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
          score: faker.datatype.number({ min: 11, max: 50 }),
        },
      ]);

    const result = await recommendationService.getRandom();

    expect(result.id).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.youtubeLink).toBeDefined();
    expect(result.score).toBeDefined();
    expect(result.score).toBeGreaterThan(10);
    expect(random).toBeCalled();
  });

  it('random >= 0.7', async () => {
    const random = jest
      .spyOn(Math, 'random')
      .mockImplementationOnce((): any =>
        faker.datatype.float({ min: 0.7, max: 1, precision: 0.1 }),
      );

    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementationOnce((): any => [
        {
          id: 1,
          name: faker.random.word(),
          youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
          score: faker.datatype.number({ min: -4, max: 10 }),
        },
        {
          id: 2,
          name: faker.random.word(),
          youtubeLink: `https://www.youtube.com/watch?v=${faker.random.alpha()}`,
          score: faker.datatype.number({ min: -4, max: 10 }),
        },
      ]);

    const result = await recommendationService.getRandom();

    expect(result.id).toBeDefined();
    expect(result.name).toBeDefined();
    expect(result.youtubeLink).toBeDefined();
    expect(result.score).toBeDefined();
    expect(result.score).toBeLessThanOrEqual(10);
    expect(random).toBeCalled();
  });

  it('notFoundError when get recommendations', async () => {
    const random = jest
      .spyOn(Math, 'random')
      .mockImplementationOnce((): any =>
        faker.datatype.float({ min: 0, max: 1, precision: 0.1 }),
      );
    jest
      .spyOn(recommendationRepository, 'findAll')
      .mockImplementation((): any => []);
    const promise = recommendationService.getRandom();
    expect(random).toBeCalled();
    expect(promise).rejects.toEqual(notFoundError());
  });
});

describe('reset database tests', () => {
  it('should call resetDatabase', async () => {
    const resetDatabase = jest
      .spyOn(recommendationRepository, 'resetDatabase')
      .mockImplementationOnce((): any => {});

    await recommendationService.resetDatabase();

    expect(resetDatabase).toBeCalled();
  });
});
