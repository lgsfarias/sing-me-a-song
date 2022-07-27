import { faker } from '@faker-js/faker';
import supertest from 'supertest';
import { prisma } from '../src/database.js';

import app from './../src/app.js';
import { recommendationBodyFactory } from './factories/recommendationBody.factory.js';
import { deleteAllData } from './factories/scenario.factory.js';

beforeEach(async () => {
  await deleteAllData();
});

const agent = supertest(app);

describe('POST /recommendations', () => {
  it('sould return 201 status code when create a recomendation', async () => {
    const body = recommendationBodyFactory();
    const response = await agent.post('/recommendations').send(body);
    expect(response.status).toBe(201);

    const userCreated = await prisma.recommendation.findFirst({
      where: { name: body.name },
    });
    expect(userCreated).toBeDefined();
    expect(userCreated.name).toBe(body.name);
    expect(userCreated.youtubeLink).toBe(body.youtubeLink);
  });

  it('should return 422 status code when create a recomendation with invalid data', async () => {
    const body = recommendationBodyFactory();
    const invalidName = await agent.post('/recommendations').send({
      ...body,
      name: '',
    });
    expect(invalidName.status).toBe(422);

    const invalidYoutubeLink = await agent.post('/recommendations').send({
      ...body,
      youtubeLink: 'https://www.wrong.com/',
    });
    expect(invalidYoutubeLink.status).toBe(422);
  });
});
