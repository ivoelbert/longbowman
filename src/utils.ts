export type nil = undefined | null;

export const isNil = (value: any): value is nil => {
    return value === undefined || value === null;
};

export const assertExists = <T>(value: T | nil, msg?: string): T => {
    if (isNil(value)) {
        throw new UnexpectedNilError(msg);
    } else {
        return value;
    }
};

export class UnexpectedNilError extends Error {
    constructor(msg?: string) {
        super(msg ?? 'Unexpected nil value!');
    }
}

export const noop = () => {};
