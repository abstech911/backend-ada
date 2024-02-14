import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as dotenv from 'dotenv';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    dotenv.config();
    app.enableCors({
        origin: 'http://localhost:3001', // Allow requests from this origin
        methods: ['GET', 'POST'], // Allow only GET and POST requests
        allowedHeaders: ['Content-Type', 'Authorization'], //
    });

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
