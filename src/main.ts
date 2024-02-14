import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as dotenv from 'dotenv';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    dotenv.config();
    // app.enableCors({
    //     origin: '*', // Allow requests from this origin
    //     methods: ['GET', 'POST'], // Allow only GET and POST requests
    //     allowedHeaders: ['Content-Type', 'Authorization'], //
    // });
    const whitelist = ['http://localhost:3001', 'api.example.com'];
    app.enableCors({
        origin: '*', // Allow requests from all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specified methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specified headers
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
