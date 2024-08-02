import { makeElectricDependencyInjector } from 'electric-sql/vuejs';
import { Electric } from '../src/generated/client';

const { provideElectric, injectElectric } =
  makeElectricDependencyInjector<Electric>();

export { provideElectric, injectElectric };
