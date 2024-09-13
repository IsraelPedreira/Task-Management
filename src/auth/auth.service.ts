import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthResponseDTO } from './auth.dto';
import { compareSync } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

    jwtExpirationTime: number;

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){
        this.jwtExpirationTime = +this.configService.get<number>("JWT_EXPIRATION");
    }

    async signIn(username: string, password: string): Promise<AuthResponseDTO>{
        const foundUser = await this.userService.findByUsername(username);

        if(!foundUser || !compareSync(password, foundUser.password)){
            throw new UnauthorizedException();
        }

        const payload = { sub: foundUser.id, username: foundUser.username }

        const token = this.jwtService.sign(payload)

        return{
            token,
            espiresIn: this.jwtExpirationTime
        }

    }
}
