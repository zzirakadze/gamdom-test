import pino from 'pino';

const isDocker = process.env.IS_DOCKER === 'true';

export const logger = pino(
  isDocker
    ? { level: 'info' }
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }
);



