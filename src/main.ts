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
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
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
