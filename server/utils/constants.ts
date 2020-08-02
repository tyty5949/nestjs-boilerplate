import * as Http2 from 'http2';

export const Constants = {
  app: {
    // Session cookie is valid for 6 hours (given in ms)
    maxSessionAge: 21600000,
  },
  auth: {
    passwordSaltLength: 10,
    hashedPasswordLength: 60,
  },
  http: {
    ...Http2.constants,
  },
};
