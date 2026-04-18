import { SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { ApiQueryDto } from '../dto/api-query.dto';

interface QueryHelperOptions {
  searchableFields?: string[];
  defaultRelations?: string[];
}

export class QueryHelper {
  static apply<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    query: ApiQueryDto,
    options: QueryHelperOptions = {},
  ): SelectQueryBuilder<T> {
    const { search, page, limit, sortBy, sortOrder, include } = query;
    const { searchableFields = [], defaultRelations = [] } = options;

    // 1. Handle Includes (Relations)
    const relationsToInclude = include ? include.split(',') : defaultRelations;
    const joinedPaths = new Set<string>();

    relationsToInclude.forEach((rel) => {
      const alias = queryBuilder.alias;
      if (rel.includes('.')) {
        const parts = rel.split('.');
        let currentAlias = alias;
        let currentPath = alias;

        parts.forEach((part) => {
          currentPath += `.${part}`;
          const partAlias = `${currentAlias}_${part}`;
          
          if (!joinedPaths.has(currentPath)) {
            queryBuilder.leftJoinAndSelect(`${currentAlias}.${part}`, partAlias);
            joinedPaths.add(currentPath);
          }
          currentAlias = partAlias;
        });
      } else {
        const path = `${alias}.${rel}`;
        if (!joinedPaths.has(path)) {
          queryBuilder.leftJoinAndSelect(path, `${alias}_${rel}`);
          joinedPaths.add(path);
        }
      }
    });

    // 2. Handle Global Search
    if (search && searchableFields.length > 0) {
      queryBuilder.andWhere(
        `(${searchableFields
          .map((field) => `${queryBuilder.alias}.${field} ILIKE :search`)
          .join(' OR ')})`,
        { search: `%${search}%` },
      );
    }

    // 3. Handle Sorting
    if (sortBy) {
      queryBuilder.orderBy(`${queryBuilder.alias}.${sortBy}`, sortOrder || 'DESC');
    }

    // 4. Handle Pagination
    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    return queryBuilder;
  }
}
