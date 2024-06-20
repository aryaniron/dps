import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
});

app.enableCors({
    allowedHeaders:"*",
    origin: "*"
});
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
