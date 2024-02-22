import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import * as firebase from 'firebase/app';
import 'firebase/auth';
import {
    getAuth,
    Auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "firebase/auth";
import * as jwt from 'jsonwebtoken';
import process from "process";
import {EmailNotVerified, UserMismatch} from "../exceptions/userexist.exception";
import {UserType} from "@prisma/client";
import {JwtService} from '@nestjs/jwt'


const firebaseConfig = {
    apiKey: "AIzaSyDtYhkOLZRO_yYlWqEDcayhjVtHuUtjWA8",
    authDomain: "ada-crypto-32c63.firebaseapp.com",
    projectId: "ada-crypto-32c63",
    storageBucket: "ada-crypto-32c63.appspot.com",
    messagingSenderId: "284293185399",
    appId: "1:284293185399:web:cd7f5376323ce03a8d2b72",
    measurementId: "G-74CKCCH1QT"
};

interface SignupParams {
    name: string;
    phoneNumber: string;
    password: string;
    email: string;
}

interface SigninParams {
    password: string;
    email: string;
}

@Injectable()
export class AuthService {
    private readonly firebaseAuth: Auth;

    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {
        const app = firebase.initializeApp(firebaseConfig);
        this.firebaseAuth = getAuth(app)
    }

    async signUp({email, password, name, phoneNumber}: SignupParams) {
        //    creating firebase user
        const firebaseUser = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);

        const {uid} = firebaseUser.user;

        const localUser = await this.prismaService.user.create({
            data: {
                id: uid,
                email: email,
                user_type: UserType.REGULAR,
                name: name,
                phoneNumber: phoneNumber
            }
        });
        await sendEmailVerification(firebaseUser.user);
        return this.generateJWT(uid, name, email);

    }

    async signIn({email, password}: SigninParams) {
        const firebaseUser = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
        const {uid, emailVerified} = firebaseUser.user;
        const localUser = await this.prismaService.user.findUnique({
            where: {
                id: uid
            }
        });

        if (!emailVerified) {
            throw new EmailNotVerified();
        }
        //     creating the jwt token
        if (!localUser) {
            throw new UserMismatch();
        }
        return this.generateJWT(uid, localUser.email, localUser.name);
    }

    async signOut(): Promise<void> {
        return await this.firebaseAuth.signOut();
    }

    private generateJWT(uid: string, name: string, email: string) {
        return this.jwtService.signAsync({name, uid, email});
    }
}
