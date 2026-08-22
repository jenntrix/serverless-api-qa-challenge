import { pino } from 'pino';
export const logger: pino.BaseLogger = pino({
  level: 'debug', //('debug' as string) || 'info',
  name: (process.env.SERVICE_NAME as string) || 'set process.env.SERVICE_NAME',
  timestamp: pino.stdTimeFunctions.isoTime,
});
