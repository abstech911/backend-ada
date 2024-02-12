import {Body, ConflictException, Controller, Get, Post, UnauthorizedException} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignInDto, SignUpDto} from "./dto/auth.dto";
import { UserAlreadyExistsException} from "../exceptions/userexist.exception";
import {PrismaService} from "../prisma/prisma.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly prismaService: PrismaService) {
    }

    @Post('/signup')
    async signup(@Body() body: SignUpDto): Promise<any> {
        try {
            const token = await this.authService.signUp(body);
            return {token}

        } catch (e) {
            console.log(e);
            return new ConflictException()
        }

    }

    @Post('/signin')
    async signin(@Body() body: SignInDto) {
        try {
            const token = await this.authService.signIn(body);
            return {token}
        } catch (e) {
            console.log({e})
            throw new UserAlreadyExistsException();
        }
    }
}
