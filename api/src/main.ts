import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';
import { formatErrors } from './common/validators/custom-validations';
import * as exphbs from 'express-handlebars';
import { join } from 'path';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  // TODO : Implement convert these constants to use the ConfigService when required.
  const LOG_CONTEXT = 'MAIN';
  const GLOBAL_PREFIX = 'v1'; // Option to add a global prefix if required, example: '/v1';
  const SWAGGER_UI_MOUNT = '/docs'; // NOTE : This is NOT affected by GLOBAL_PREFIX
  const PORT = process.env.PORT; // NOTE : This is NOT affected by GLOBAL_PREFIX

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
    bodyParser: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: formatErrors,
      transform: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.set('trust proxy');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  //app.use(helmet());
  app.setBaseViewsDir(__dirname);
  const helpers = {
    hlp: (echo) => `Echo: ${echo}.`,
    inc: (value) => parseInt(value) + 1,
    dateFormat: require('handlebars-dateformat'),
  };
  const hbs = exphbs.create({
    defaultLayout: false,
    layoutsDir: join(__dirname, 'views', 'layouts'),
    extname: '.hbs',
    helpers,
  });

  app.engine('.hbs', hbs.engine);
  app.set('view engine', '.hbs');

  // Configure the swagger document builder
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Yukta Cadfe API')
    .setDescription(
      'Yukta Cafe API can be used by the trusted parteners. The first thing to do is Authorise',
    )
    .setVersion('1.0')
    .addBearerAuth() // NOTE : This does not add bearer authentication, it simply marks the swagger spec as requiring bearer authentication.
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(SWAGGER_UI_MOUNT, app, document);

  app.useWebSocketAdapter(new WsAdapter(app));

  Logger.log(`Tooling Backend is listening on port ${PORT}`, LOG_CONTEXT);
  Logger.debug(
    `Try connecting to http://localhost:${PORT}${GLOBAL_PREFIX || ''}`,
    LOG_CONTEXT,
  );
  Logger.debug(
    `Swagger UI is at http://localhost:${PORT}${SWAGGER_UI_MOUNT}`,
    LOG_CONTEXT,
  );
  Logger.debug(
    `Swagger JSON specification is at http://localhost:${PORT}${SWAGGER_UI_MOUNT}-json`,
    LOG_CONTEXT,
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
