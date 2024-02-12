import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
    constructor() {
        super('User already exists');
    }
}

export class EmailNotVerified extends BadRequestException{
    constructor() {
        super('Email is not verified');
    }
}

export class UserMismatch extends BadRequestException{
    constructor() {
        super('Email is not verified');
    }

}