import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
    providers: [AuthService],
    controllers: [AuthController],
    imports: [
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: 'Xw7d84aUEjj5JGu6UabZn73w8YMGa7TA2kfhgvnYZca4Sb0ctZKz01cpA1Ay509wFkeBzp6VFvtJGTSCjPxVGBFfiKmBnxTzyNiR',
            signOptions: {expiresIn: '60s'}
        })
    ]
})
export class AuthModule {
}
