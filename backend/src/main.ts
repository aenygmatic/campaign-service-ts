import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IsNewPrefixConstraint } from './campaign/api/v1/campaign.constrains';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //TODO: Investigate why useContainer did not work
  IsNewPrefixConstraint.campaigns = app.get('CampaignRepository');
  await app.listen(3000);
}

bootstrap();
