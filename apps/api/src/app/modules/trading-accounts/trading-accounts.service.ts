import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTradingAccountDto } from './dto/create-trading-account.dto';
import { UpdateTradingAccountDto } from './dto/update-trading-account.dto';
import { TradingAccountsRepository } from './trading-accounts.repository';

@Injectable()
export class TradingAccountsService {
  constructor(private readonly repository: TradingAccountsRepository) {}

  findAll(userId: string) {
    return this.repository.findManyByUserId(userId);
  }

  async findOne(id: string, userId: string) {
    const account = await this.repository.findByIdAndUserId(id, userId);

    if (!account) {
      throw new NotFoundException('Trading account not found');
    }

    return account;
  }

  create(userId: string, dto: CreateTradingAccountDto) {
    return this.repository.create(userId, dto);
  }

  async update(id: string, userId: string, dto: UpdateTradingAccountDto) {
    await this.findOne(id, userId);

    return this.repository.update(id, userId, dto);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.repository.delete(id);

    return { success: true };
  }
}
