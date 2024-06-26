//얖은 복사 지원,

const equals = (target1, target2, type = "shallow") => {
  if (target1 === target2) return true;
  if (typeof target1 !== typeof target2) return false;
  if (target1 === null || target2 === null) return false;

  const wrapperTypes = [Number, String, Boolean, Symbol, BigInt];
  if (
    wrapperTypes.some(
      (type) => target1 instanceof type && target2 instanceof type
    )
  )
    return false;

  const isObjectType = [typeof target1, typeof target2].every(
    (type) => type === "object"
  );
  if (isObjectType) {
    if (target1.constructor !== target2.constructor) return false;
    const key1 = Object.keys(target1);
    const key2 = Object.keys(target2);

    if (key1.length !== key2.length) return false;

    for (let key in target1) {
      if (type === "shallow" && target1[key] !== target2[key]) return false;
      if (type === "deep" && !equals(target1[key], target2[key], "deep"))
        return false;
    }
    return true;
  }

  return false;
};

export function shallowEquals(target1, target2) {
  return equals(target1, target2, "shallow");
}

export function deepEquals(target1, target2) {
  return equals(target1, target2, "deep");
}

export function createNumber1(n) {
  return new Number(n);
}

export function createNumber2(n) {
  return new String(n);
}

export function createNumber3(n) {
  const obj = {
    value: n,
    valueOf: function () {
      return this.value;
    },
    toString: function () {
      return `${this.value}`;
    },
    toJSON: function () {
      return `this is createNumber3 => ${this.value}`;
    },
  };

  return obj;
}

export class CustomNumber {
  static #instancePool = new Map();
  constructor(n) {
    if (CustomNumber.#instancePool.has(n)) {
      return CustomNumber.#instancePool.get(n);
    }
    this.n = n;
    CustomNumber.#instancePool.set(n, this);
  }
  valueOf() {
    return this.n;
  }
  toString() {
    return `${this.n}`;
  }
  toJSON() {
    return this.toString();
  }
}

export function createUnenumerableObject(target) {
  const obj = structuredClone(target);

  for (let key in obj) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, key);
    Object.defineProperty(obj, key, {
      ...descriptor,
      enumerable: false,
    });
  }

  return obj;
}

export function forEach(target, callback) {
  const keys = Object.getOwnPropertyNames(target);
  keys.forEach((key) => {
    if (key === "length") return;
    callback(
      Number.isInteger(+target[key]) ? +target[key] : target[key],
      Number.isInteger(+key) ? +key : key
    );
  });
}

export function map(target, callback) {
  const keys = Object.getOwnPropertyNames(target);
  const result = [];
  keys.forEach((key) => {
    if (key === "length") return;
    result.push(
      callback(Number.isInteger(+target[key]) ? +target[key] : target[key])
    );
  });

  if (Array.isArray(target) || target instanceof NodeList) return result;

  return keys.reduce((acc, cur, index) => {
    return {
      ...acc,
      [cur]: result[index],
    };
  }, {});
}

export function filter(target, callback) {
  const result = Array.isArray(target) || target instanceof NodeList ? [] : {};

  forEach(target, (value, key) => {
    if (callback(value, key)) {
      if (Array.isArray(target) || target instanceof NodeList) {
        result.push(value);
      } else {
        result[key] = value;
      }
    }
  });

  return result;
}

export function every(target, callback) {
  let result = true;

  forEach(target, (value, key) => {
    if (!callback(value, key)) {
      result = false;
    }
  });

  return result;
}
export function some(target, callback) {
  let result = false;

  forEach(target, (value, key) => {
    if (callback(value, key)) {
      result = true;
    }
  });

  return result;
}
