import { ConfigService } from '@nestjs/config';

const defaultConfig = {
  auth: {
    passwordSaltLength: 10,
    hashedPasswordLength: 60,
  },
};

export const getMockConfigService = (
  mockConfig?: Record<string, unknown>,
): Partial<ConfigService> => {
  const config = Object.assign(defaultConfig, mockConfig);
  return {
    get: jest.fn().mockImplementation((slice: string) => {
      return config[slice];
    }),
  };
};
