import supertest from 'supertest';
import app from '../src/app.js';
import {
  createManyRecommendations,
  createRecommendation,
} from './factories/recommendation.factory.js';
import { deleteAllData } from './factories/scenario.factory.js';
import { prisma } from '../src/database.js';
import { amountFactory } from './factories/amount.factory.js';

beforeEach(async () => {
  await deleteAllData();
});

const agent = supertest(app);

describe('GET /recommendations', () => {
  it('should return 200 status code when get all recommendations', async () => {
    await createManyRecommendations(20);
    const response = await agent.get('/recommendations');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(10);
  });
});

describe('GET /recommendations/:id', () => {
  it('should return 200 status code when get a recommendation', async () => {
    const recommendation = await createRecommendation();
    const response = await agent.get(`/recommendations/${recommendation.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(recommendation.id);
    expect(response.body.name).toBeDefined();
    expect(response.body.youtubeLink).toBeDefined();
    expect(response.body.score).toBeDefined();
  });

  it('should return 404 status code when get a recommendation that does not exist', async () => {
    const response = await agent.get('/recommendations/1');
    expect(response.status).toBe(404);
  });
});

describe('GET /recommendations/random', () => {
  it('should return 200 status code when get a random recommendation', async () => {
    await createManyRecommendations(20);
    const response = await agent.get('/recommendations/random');
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBeDefined();
    expect(response.body.youtubeLink).toBeDefined();
    expect(response.body.score).toBeDefined();
  });

  it('should return 404 status code when there are no recommendations', async () => {
    const response = await agent.get('/recommendations/random');
    expect(response.status).toBe(404);
  });
});

describe('GET /recommendations/top/:amount', () => {
  it('should return 200 status code when get top recommendations', async () => {
    await createManyRecommendations(20);
    const amount = amountFactory(20);
    const response = await agent.get(`/recommendations/top/${amount}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(amount);
  });

  it('top recomendations must be ordered by score', async () => {
    await createManyRecommendations(20);
    const amount = amountFactory(20);
    const response = await agent.get(`/recommendations/top/${amount}`);
    let isOrdered = true;
    for (let i = 0; i < response.body.length - 1; i++) {
      if (response.body[i].score < response.body[i + 1].score) {
        isOrdered = false;
      }
    }
    expect(isOrdered).toBe(true);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
