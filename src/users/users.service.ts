import { ConflictException, Injectable } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../db/entities/User.entity'
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ){}

    async create(user: UserDTO){
        const alreadyRegisteredUser = await this.userRepository.findOne({
            where:{
                username: user.username
            }
        })

        if(alreadyRegisteredUser) throw new ConflictException(`User ${user.username} already exists`)

        const saveUser = new UserEntity()
        saveUser.password = hashSync(user.password, 10);
        saveUser.username = user.username
            
        const { id, username } = await this.userRepository.save(saveUser)
        return { id, username }
    }

    async findByUsername(username: string): Promise<UserDTO|null>{
        const user = await this.userRepository.findOne({
            where:{
                username: username
            }
        })

        if(!user) return null

        return {
            id: user.id,
            password: user.password,
            username: user.username
        }
    }


}
