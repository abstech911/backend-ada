import {IsEmail, IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Matches(/^(\+234|0)([789][01]\d{8}|[789][01]\d{9}|[789][01]\d{10})$/, {message: 'Invalid Nigerian phone number'})
    phoneNumber: string;

    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class SignInDto {
    @IsNotEmpty()
    @MinLength(5)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}