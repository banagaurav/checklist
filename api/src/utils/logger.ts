export function pinoLokiOptions(config) {
return {
  pinoHttp: {
    level: 'debug',
    transport: {
      target: 'pino-loki',
      options: {
        batching: false,               // disable batching temporarily
        interval: 5,                  // default batch interval
        host: 'https://yedu-loki.onrender.com', // ''
        labels: {
          app: 'yedu',
          env: config.nodeEnv,
        },
      },
    },
  },
}
}
