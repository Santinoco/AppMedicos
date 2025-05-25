import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
   constructor(
      @InjectModel(User)
      private userModel: typeof User,
   ) {}

   async getAllUsers() {
      const users = await this.userModel.findAll();
      return users;
   }

   async getUserById(id: number) {
      const user = await this.userModel.findByPk(id);
      return user;
   }

   async createUser(userData: any) {
      const user = await this.userModel.create(userData);
      return user;
   }

   async getUserAppoinments(id: number) {
      // Aquí podrías implementar la relación con citas cuando crees ese modelo
      const user = await this.userModel.findByPk(id);
      return {
         user,
         message: `Citas del usuario con id: ${id}`,
      };
   }
}