import { Request, Response } from 'express';
// import { recommendationSchema } from '../schemas/recommendationsSchemas.js';
import { recommendationService } from '../services/recommendationsService.js';
// import { wrongSchemaError } from '../utils/errorUtils.js';

export const testsController = {
  async resetDatabase(req: Request, res: Response) {
    await recommendationService.resetDatabase();
    res.sendStatus(200);
  },
};
