import { Logger as NestLogger } from '@nestjs/common';

export class Logger {
  constructor(protected nestLogger: NestLogger) {}

  /**
   * Logs a message with context at "error" level. Also allows for the error
   * stack trace to be included.
   *
   * @param message
   * @param [context]
   * @param [error]
   */
  error(
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
  ): void {
    this.handleDefaultNestError(message, context, error);
  }

  /**
   * Logs a message with context at "warn" level.
   *
   * @param message
   * @param [context]
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.handleDefaultNestWarn(message, context);
  }

  /**
   * Logs a message with context at "info" level.
   *
   * @param message
   * @param [context]
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.handleDefaultNestInfo(message, context);
  }

  /**
   * Logs a message with context at "verbose" level.
   *
   * @param message
   * @param [context]
   */
  verbose(message: string, context?: Record<string, unknown>): void {
    this.handleDefaultNestVerbose(message, context);
  }

  private handleDefaultNestError(
    message: string,
    context?: Record<string, unknown>,
    error?: unknown,
  ): void {
    const contextString = context ? JSON.stringify(context) : undefined;
    const errorString = error instanceof Error ? error.stack : undefined;

    this.nestLogger.error(message, errorString, contextString);
  }

  private handleDefaultNestWarn(
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const contextString = context ? JSON.stringify(context) : undefined;
    this.nestLogger.warn(message, contextString);
  }

  private handleDefaultNestInfo(
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const contextString = context ? JSON.stringify(context) : undefined;
    this.nestLogger.log(message, contextString);
  }
  private handleDefaultNestVerbose(
    message: string,
    context?: Record<string, unknown>,
  ): void {
    const contextString = context ? JSON.stringify(context) : undefined;
    this.nestLogger.verbose(message, contextString);
  }
}

export const getLogger = (): Logger => {
  return new Logger(new NestLogger());
};
