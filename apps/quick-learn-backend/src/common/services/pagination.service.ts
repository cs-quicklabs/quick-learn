import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationDto } from '../dto';
import { PaginatedResult } from '../interfaces/paginate.interface';

export class PaginationService<T> {
  constructor(private repository: Repository<T>) {}

  async paginate(
    paginationDto: PaginationDto,
    searchOptions: FindOptionsWhere<T> = {},
    relations: string[],
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;
    const findAndCountOptions: unknown = {
      skip,
      take: limit,
      where: searchOptions,
      relations,
      order: { updated_at: 'DESC' },
    };

    if (paginationDto.sortBy && paginationDto.sortOrder) {
      findAndCountOptions['order'] = JSON.parse(
        `{ ${paginationDto.sortBy}: ${paginationDto.sortOrder} }`,
      );
    }

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
