import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as dotenv from 'dotenv';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    dotenv.config();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe(
        {
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        }
    ))
    await app.listen(3000);
}

bootstrap();
