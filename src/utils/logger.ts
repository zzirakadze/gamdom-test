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


// src/utils/logger.ts

export function logRequestResponse() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(`🛫 Request to ${propertyKey} with params:`, args);
      const result = await originalMethod.apply(this, args);
      console.log(`🛬 Response from ${propertyKey}:`, result?.status?.(), await result?.json?.());
      return result;
    };

    return descriptor;
  };
}


