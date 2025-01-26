import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      user: string;
      role: string;
    };
  }
}
