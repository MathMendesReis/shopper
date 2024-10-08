import { Injectable } from '@nestjs/common';
import { $Enums, Measure } from '@prisma/client';
import { PrismaService } from '../PrismaService';
import { MeasureModel } from 'src/domain/gemini/enterprise/MeasureModel';
import { IMeasurePrismaRepositorie } from 'src/domain/measure/application/repositories/measure-repositorie';

@Injectable()
export class MeasurePrismaRepositorie implements IMeasurePrismaRepositorie {
  constructor(private prisma: PrismaService) {}
  async createCustomer(body: MeasureModel): Promise<Measure> {
    return await this.prisma.measure.create({
      data: {
        id: body.getId(),
        measureValue: body.getMeasureValue(),
        image: body.getImageUrl(),
        customerId: body.getCustomerId(),
        measureDatetime: body.getMeasureDatetime(),
        measureType: body.getMeasureType() as $Enums.MeasureType,
        hasConfirmed: body.getHasConfirmed(),
        monthYear: body.getMonthYear(),
      },
    });
  }

  async findUnique(
    monthYear: string,
    customerId: string,
  ): Promise<Measure | null> {
    return await this.prisma.measure.findFirst({
      where: {
        customerId,
        monthYear,
      },
    });
  }
  async findUniqueById(id: string): Promise<Measure | null> {
    return await this.prisma.measure.findFirst({
      where: {
        id,
      },
    });
  }

  async updateMeasureHasConfirmedToTrue(
    id: string,
    hasConfirmed: boolean,
  ): Promise<Measure> {
    return this.prisma.measure.update({
      data: {
        hasConfirmed,
      },
      where: {
        id,
      },
    });
  }

  async findAll(
    customerId: string,
    measureType?: 'GAS' | 'WATER',
  ): Promise<Measure[]> {
    return this.prisma.measure.findMany({
      where: {
        customerId: customerId,
        measureType: measureType,
      },
    });
  }
}
