import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './entities/user-type.model';

@Injectable()
export class UserTypeService {
  constructor(
    @InjectRepository(UserType)
    private readonly userTypeRepository: Repository<UserType>,
  ) {}

  async create(data: Partial<UserType>): Promise<UserType> {
    const userType = this.userTypeRepository.create(data);
    return this.userTypeRepository.save(userType);
  }

  async findAll(): Promise<UserType[]> {
    return this.userTypeRepository.find({ order: { id: "ASC" }});
  }

  async findOne(id: number): Promise<UserType> {
    const userType = await this.userTypeRepository.findOne({ where: { id } });
    if (!userType) throw new NotFoundException('UserType not found');
    return userType;
  }

  async update(id: number, data: Partial<UserType>): Promise<UserType> {
    await this.userTypeRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.userTypeRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('UserType not found');
    return { message: "UserType deleted successfully" };
  }
}
