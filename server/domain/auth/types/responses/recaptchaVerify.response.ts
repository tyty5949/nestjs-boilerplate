export type RecaptchaVerifyResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  'error-codes'?: Array<string>;
};
