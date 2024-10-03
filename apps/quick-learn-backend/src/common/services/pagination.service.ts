import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { BasePaginationDto } from '../dto';
import { PaginatedResult } from '../interfaces';
import { BasicCrudService } from './basic-crud.service';

export class PaginationService<T> extends BasicCrudService<T> {
  async paginate(
    paginationDto: BasePaginationDto,
    searchOptions: FindOptionsWhere<T>[] | FindOptionsWhere<T> = {},
    relations: string[] = [],
    order: FindOptionsOrder<T> = {},
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const findAndCountOptions: unknown = {
      skip,
      take: limit,
      where: searchOptions,
      relations,
      order: Object.keys(order).length > 0 ? order : { updated_at: 'DESC' },
    };

    const [items, total] = await this.repository.findAndCount(
      findAndCountOptions,
    );

    return {
      items,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
}
