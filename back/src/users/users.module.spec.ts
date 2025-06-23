import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});