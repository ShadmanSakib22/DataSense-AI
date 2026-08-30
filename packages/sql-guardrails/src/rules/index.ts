import { noWrites } from './no-writes';
import { noMultiStatement } from './no-multi-statement';
import { schemaCheck } from './schema-check';
import { limitCeiling } from './limit-ceiling';
import { dangerousFunctions } from './dangerous-functions';
import { cartesianWarning } from './cartesian-warning';
import type { GuardrailRule } from '../types';

export const allRules: GuardrailRule[] = [
  noWrites,
  noMultiStatement,
  schemaCheck,
  limitCeiling,
  dangerousFunctions,
  cartesianWarning,
];