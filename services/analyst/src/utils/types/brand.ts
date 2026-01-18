declare const __analyst_brand: unique symbol;

export type Branded<T, B> = Brand<B> & T;

type Brand<B> = { [__analyst_brand]: B };
