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


const firebaseConfig = {
    apiKey: "AIzaSyDV-qslQsor6i55LMcN9DCgukD5aihny6Q",
    authDomain: "ada-crypto.firebaseapp.com",
    projectId: "ada-crypto",
    storageBucket: "ada-crypto.appspot.com",
    messagingSenderId: "39753178126",
    appId: "1:39753178126:web:79c3e0591ae92bd385305f",
    measurementId: "G-TCJYE0RQJQ"
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
    private firebaseAuth: Auth;

    constructor(private readonly prismaService: PrismaService) {

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
                    name,
                    phoneNumber
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
        return jwt.sign(
            {name, uid, email},
            'Xw7d84aUEjj5JGu6UabZn73w8YMGa7TA2kfhgvnYZca4Sb0ctZKz01cpA1Ay509wFkeBzp6VFvtJGTSCjPxVGBFfiKmBnxTzyNiR',
            {expiresIn: 36000000}
        );
    }
}
