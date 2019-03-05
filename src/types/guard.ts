import { Runtype, create } from '../runtype';
import { String } from './string';
import { ValidationError } from '../errors';

export interface Guard<V> extends Runtype<V> {
  tag: 'guard';
  name: string;
}

export function Guard<V>(
  name: string,
  guard: (x: any, errorReporter?: (message: string) => void) => x is V,
) {
  return create<Guard<V>>(
    x => {
      let errMsg: string | undefined;
      const errorReporter = (message: string) => {
        if (String.guard(errMsg))
          throw new Error('Cannot report more than one error from a type guard');
        errMsg = message;
      };
      if (guard(x, errorReporter)) {
        if (String.guard(errMsg))
          throw new Error('Type guard must return false after reporting an error');
        return x;
      } else {
        if (String.guard(errMsg)) throw new ValidationError(errMsg);
        else throw new ValidationError(`Failed to pass type guard for ${name}`);
      }
    },
    { tag: 'guard', name },
  );
}
