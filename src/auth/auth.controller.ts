import {Body, ConflictException, Controller, Get, Post, UnauthorizedException, UseGuards} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {SignInDto, SignUpDto} from "./dto/auth.dto";
import {UserAlreadyExistsException} from "../exceptions/userexist.exception";
import {PrismaService} from "../prisma/prisma.service";
import {AuthGuard} from "./guard/auth.guard";
import {Public} from "./decorators/public.decorator";

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
            throw new ConflictException(e.message)
        }

    }

    @Post('/signin')
    async signin(@Body() body: SignInDto) {
        try {
            const token = await this.authService.signIn(body);
            return {token}
        } catch (e) {
            console.log({e: e.message})
            throw new UnauthorizedException();
        }
    }

    @Public()
    // @UseGuards(AuthGuard)
    @Get('/sani')
    async sign() {
        return {
            sani: "Sani Abubakar"
        }
    }
}
