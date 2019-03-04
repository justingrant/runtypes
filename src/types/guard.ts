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
      let error: string | undefined;
      const errorReporter = (message: string) => {
        if (String.guard(error))
          throw new Error('Cannot report more than one error from a guard function');
        error = message;
      };
      if (guard(x, errorReporter)) {
        if (String.guard(error))
          throw new Error('Guard function cannot return true after reporting an error');
        return x;
      } else {
        if (String.guard(error)) throw new ValidationError(error);
        else throw new ValidationError(`Failed to pass type guard for ${name}`);
      }
    },
    { tag: 'guard', name },
  );
}
