import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as dotenv from 'dotenv';
import * as cors from 'cors';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    dotenv.config();

    app.use(
        cors({
            origin: 'http://localhost:3001', // Allow requests from this origin
            methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified methods
            allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
        })
    );
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
