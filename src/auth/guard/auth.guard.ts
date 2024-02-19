import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {IS_PUBLIC_KEY} from "../decorators/public.decorator";
import {Reflector} from "@nestjs/core";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly reflector: Reflector, private readonly jwtService: JwtService) {
    }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            request['user'] = await this.jwtService.verifyAsync(token, {
                secret: 'Xw7d84aUEjj5JGu6UabZn73w8YMGa7TA2kfhgvnYZca4Sb0ctZKz01cpA1Ay509wFkeBzp6VFvtJGTSCjPxVGBFfiKmBnxTzyNiR',
            });
        } catch (e) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request): string | undefined {
        return request?.headers?.authorization?.split("Bearer ")[1];
    }
}
