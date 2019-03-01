import { Runtype, create } from '../runtype';
import { ValidationError } from '../errors';

export interface Constructor<V> {
  new(...args: any[]): V;
}

export interface InstanceOf<V> extends Runtype<V> {
  tag: 'instanceof';
  ctor: Constructor<V>;
}

export function InstanceOf<V>(ctor: Constructor<V>, customInstanceOf?: (o: V) => boolean) {
  return create<InstanceOf<V>>(
    x => {
      const isInstanceOf = customInstanceOf ? customInstanceOf(x as any) : (x instanceof ctor);
      if (!isInstanceOf) {
        throw new ValidationError(`Expected ${(ctor as any).name}, but was ${typeof x}`);
      }
      return x as V;
    },
    { tag: 'instanceof', ctor: ctor },
  );
}
