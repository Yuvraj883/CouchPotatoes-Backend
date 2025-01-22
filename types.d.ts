// types.d.ts
/// <reference types="express" />

declare global {
    namespace Express {
      interface Request extends Express.Request {
        user?: any; // You can specify a more specific type for `user` if needed
      }
    }
  }
  