/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, NotFoundException } from '@nestjs/common';
import { AssetClass, Prisma, TradeSide, TradeStatus } from '../../../generated/prisma';

import { CreateTradeDto } from './dto/create-trade.dto';
import {
  ImportTradeRowDto,
  ImportTradesDto,
} from './dto/import-trades.dto';
import { UpdateTradeDto } from './dto/update-trade.dto';
import { TradesRepository } from './trades.repository';
import {
  CsvImportResult,
  CsvImportRowError,
} from './types/trade-import.types';

@Injectable()
export class TradesService {
  constructor(private readonly tradesRepository: TradesRepository) {}

  findAll(userId: string) {
    return this.tradesRepository.findAllByUserId(userId);
  }

  async create(userId: string, dto: CreateTradeDto) {

    const pnl = this.calculatePnl({
        side: dto.side,
        entryPrice: Number(dto.entryPrice),
        exitPrice: dto.exitPrice ? Number(dto.exitPrice) : null,
        quantity: Number(dto.quantity),
        status: dto.status ?? 'OPEN',
    });

    const tradingAccount =
      await this.tradesRepository.findTradingAccountByIdAndUserId(
        dto.tradingAccountId,
        userId,
      );

    if (!tradingAccount) {
      throw new NotFoundException('Trading account not found');
    }

    const data: Prisma.TradeCreateInput = {
      user: {
        connect: { id: userId },
      },
      tradingAccount: {
        connect: { id: dto.tradingAccountId },
      },
      symbol: {
        connectOrCreate: {
          where: {
            code: dto.symbol,
          },
          create: {
            code: dto.symbol,
            assetClass: AssetClass.STOCK,
          },
        },
      },
      side: dto.side,
      pnl,
      status: dto.status ?? 'OPEN',
      entryPrice: dto.entryPrice,
      exitPrice: dto.exitPrice,
      quantity: dto.quantity,
      notes: dto.notes,
      openedAt: dto.openedAt ? new Date(dto.openedAt) : new Date(),
      closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined,
    };

    return this.tradesRepository.create(data);
  }

  async findOne(id: string, userId: string) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return trade;
  }

  async update(id: string, userId: string, dto: UpdateTradeDto) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    if (dto.tradingAccountId) {
      const tradingAccount =
        await this.tradesRepository.findTradingAccountByIdAndUserId(
          dto.tradingAccountId,
          userId,
        );

      if (!tradingAccount) {
        throw new NotFoundException('Trading account not found');
      }
    }

    const data: Prisma.TradeUpdateInput = {
      symbol: dto.symbol
        ? {
            connect: { code: dto.symbol },
          }
        : undefined,
      side: dto.side,
      status: dto.status ?? undefined,
      entryPrice: dto.entryPrice,
      exitPrice: dto.exitPrice,
      quantity: dto.quantity,
      notes: dto.notes,
      openedAt: dto.openedAt ? new Date(dto.openedAt) : undefined,
      closedAt: dto.closedAt ? new Date(dto.closedAt) : undefined,
      tradingAccount: dto.tradingAccountId
        ? { connect: { id: dto.tradingAccountId } }
        : undefined,
    };

    return this.tradesRepository.update(id, data);
  }

  async remove(id: string, userId: string) {
    const trade = await this.tradesRepository.findByIdAndUserId(id, userId);

    if (!trade) {
      throw new NotFoundException('Trade not found');
    }

    return this.tradesRepository.delete(id);
  }

  private calculatePnl(params: {
    side: 'BUY' | 'SELL';
    entryPrice: number;
    exitPrice?: number | null;
    quantity: number;
    status: string;
  }): number | null {
    if (
      params.status !== 'CLOSED' ||
      params.exitPrice === null ||
      params.exitPrice === undefined
    ) {
      return null;
    }

    if (params.side === 'BUY') {
      return (params.exitPrice - params.entryPrice) * params.quantity;
    }

    return (params.entryPrice - params.exitPrice) * params.quantity;
  }

  async importTrades(
    userId: string,
    dto: ImportTradesDto,
  ): Promise<CsvImportResult> {
    const tradingAccount =
      await this.tradesRepository.findTradingAccountByIdAndUserId(
        dto.tradingAccountId,
        userId,
      );

    if (!tradingAccount) {
      throw new NotFoundException('Trading account not found');
    }

    const normalizedRows = dto.rows.map((row) =>
      this.normalizeImportRow(row),
    );

    const rowErrors: CsvImportRowError[] = [];
    const businessValidRows: ImportTradeRowDto[] = [];

    for (const row of normalizedRows) {
      const error = this.validateImportRow(row);

      if (error) {
        rowErrors.push(error);
        continue;
      }

      businessValidRows.push(row);
    }

    const uniqueSymbolCodes = [
      ...new Set(businessValidRows.map((row) => row.symbol)),
    ];

    const symbols =
      uniqueSymbolCodes.length > 0
        ? await this.tradesRepository.findSymbolsByCodes(
            uniqueSymbolCodes,
          )
        : [];

    const symbolIdByCode = new Map(
      symbols.map((symbol) => [symbol.code, symbol.id]),
    );

    const importableRows: Array<{
      row: ImportTradeRowDto;
      symbolId: string;
    }> = [];

    for (const row of businessValidRows) {
      const symbolId = symbolIdByCode.get(row.symbol);

      if (!symbolId) {
        rowErrors.push({
          rowNumber: row.rowNumber,
          field: 'symbol',
          message: `Unknown or inactive symbol: ${row.symbol}`,
        });

        continue;
      }

      importableRows.push({
        row,
        symbolId,
      });
    }

    if (importableRows.length === 0) {
      return {
        importedCount: 0,
        rejectedCount: this.countRejectedRows(rowErrors),
        importedTradeIds: [],
        errors: this.sortImportErrors(rowErrors),
      };
    }

    const tradesToCreate: Prisma.TradeUncheckedCreateInput[] =
      importableRows.map(({ row, symbolId }) => {
        const exitPrice = row.exitPrice
          ? Number(row.exitPrice)
          : null;

        const pnl = this.calculatePnl({
          side: row.side,
          entryPrice: Number(row.entryPrice),
          exitPrice,
          quantity: Number(row.quantity),
          status: row.status,
        });

        return {
          userId,
          tradingAccountId: dto.tradingAccountId,
          symbolId,

          side: row.side,
          status: row.status,

          quantity: new Prisma.Decimal(row.quantity),
          entryPrice: new Prisma.Decimal(row.entryPrice),
          exitPrice: row.exitPrice
            ? new Prisma.Decimal(row.exitPrice)
            : null,
          pnl: pnl === null
            ? null
            : new Prisma.Decimal(pnl),

          openedAt: new Date(row.openedAt),
          closedAt: row.closedAt
            ? new Date(row.closedAt)
            : null,

          notes: row.notes,
        };
      });

    const importedTrades =
      await this.tradesRepository.createManyImportedTrades(
        tradesToCreate,
      );

    return {
      importedCount: importedTrades.length,
      rejectedCount: this.countRejectedRows(rowErrors),
      importedTradeIds: importedTrades.map((trade) => trade.id),
      errors: this.sortImportErrors(rowErrors),
    };
  }

  private normalizeImportRow(
    row: ImportTradeRowDto,
  ): ImportTradeRowDto {
    const symbol = row.symbol.trim().toUpperCase();

    const side = row.side
      .toString()
      .trim()
      .toUpperCase() as TradeSide;

    const status = row.status
      .toString()
      .trim()
      .toUpperCase() as TradeStatus;

    const exitPrice = this.normalizeOptionalValue(
      row.exitPrice,
    );

    const closedAt = this.normalizeOptionalValue(
      row.closedAt,
    );

    const notes = this.normalizeOptionalValue(row.notes);

    return {
      ...row,
      symbol,
      side,
      status,
      quantity: row.quantity.trim(),
      entryPrice: row.entryPrice.trim(),
      exitPrice,
      openedAt: row.openedAt.trim(),
      closedAt,
      notes,
    };
  }

  private normalizeOptionalValue(
    value: string | null | undefined,
  ): string | null {
    if (value === null || value === undefined) {
      return null;
    }

    const normalizedValue = value.trim();

    return normalizedValue.length > 0
      ? normalizedValue
      : null;
  }

  private validateImportRow(
    row: ImportTradeRowDto,
  ): CsvImportRowError | null {
    if (!row.symbol) {
      return {
        rowNumber: row.rowNumber,
        field: 'symbol',
        message: 'Symbol is required',
      };
    }

    const quantity = Number(row.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      return {
        rowNumber: row.rowNumber,
        field: 'quantity',
        message: 'Quantity must be greater than zero',
      };
    }

    const entryPrice = Number(row.entryPrice);

    if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
      return {
        rowNumber: row.rowNumber,
        field: 'entryPrice',
        message: 'Entry price must be greater than zero',
      };
    }

    if (row.exitPrice !== null) {
      const exitPrice = Number(row.exitPrice);

      if (!Number.isFinite(exitPrice) || exitPrice <= 0) {
        return {
          rowNumber: row.rowNumber,
          field: 'exitPrice',
          message: 'Exit price must be greater than zero',
        };
      }
    }

    const openedAt = new Date(row.openedAt);

    if (Number.isNaN(openedAt.getTime())) {
      return {
        rowNumber: row.rowNumber,
        field: 'openedAt',
        message: 'Opened date is invalid',
      };
    }

    let closedAt: Date | null = null;

    if (row.closedAt !== null && row.closedAt !== undefined) {
      closedAt = new Date(row.closedAt);

      if (Number.isNaN(closedAt.getTime())) {
        return {
          rowNumber: row.rowNumber,
          field: 'closedAt',
          message: 'Closed date is invalid',
        };
      }
    }

    if (
      row.status === TradeStatus.CLOSED &&
      row.exitPrice === null
    ) {
      return {
        rowNumber: row.rowNumber,
        field: 'exitPrice',
        message: 'Exit price is required for a closed trade',
      };
    }

    if (
      row.status === TradeStatus.CLOSED &&
      row.closedAt === null
    ) {
      return {
        rowNumber: row.rowNumber,
        field: 'closedAt',
        message: 'Closed date is required for a closed trade',
      };
    }

    if (
      closedAt !== null &&
      closedAt.getTime() < openedAt.getTime()
    ) {
      return {
        rowNumber: row.rowNumber,
        field: 'closedAt',
        message: 'Closed date cannot be earlier than opened date',
      };
    }

    return null;
  }

  private countRejectedRows(
    errors: CsvImportRowError[],
  ): number {
    return new Set(
      errors.map((error) => error.rowNumber),
    ).size;
  }

  private sortImportErrors(
    errors: CsvImportRowError[],
  ): CsvImportRowError[] {
    return [...errors].sort(
      (first, second) =>
        first.rowNumber - second.rowNumber,
    );
  }
}
