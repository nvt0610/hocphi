import { PaginationMeta } from '../interfaces/response.interface';

export class PaginationUtil {
  static getMeta(
    itemCount: number,
    totalItems: number,
    page: number = 1,
    limit: number = 10,
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      itemCount,
      totalItems,
      itemsPerPage: limit,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  static paginate<T>(
    data: T[],
    total: number,
    page: number = 1,
    limit: number = 10,
  ) {
    return {
      data,
      meta: this.getMeta(data.length, total, page, limit),
    };
  }
}
