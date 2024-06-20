import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // Disable frameguard to remove X-Frame-Options header
  app.use(
    helmet({
      frameguard: false,
    }),
  );

  // Set CSP to allow framing from any origin
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ['*'], // Allow all origins
      },
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
