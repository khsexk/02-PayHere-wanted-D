import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('PayHere Task')
    .setDescription('by 3rd-wanted-pre-onboarding-team-D')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
