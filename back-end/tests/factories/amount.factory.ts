import { faker } from '@faker-js/faker';

export const amountFactory = (maxAmount : number) => faker.datatype.number({ min: 1, max: maxAmount });
