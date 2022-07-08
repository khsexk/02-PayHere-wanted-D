import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { setSwagger } from './setSwagger';
import { ResponseWrapperInterceptor } from './common/interceptors/response.interceptor';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setSwagger(app);

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, forbidUnknownValues: true }),
  );
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector),),
    new ResponseWrapperInterceptor()
  );
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
