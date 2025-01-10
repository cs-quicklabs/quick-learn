import {
  DeepPartial,
  DeleteResult,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * A basic CRUD service for performing common database operations.
 * @template T - The entity type that this service operates on.
 */
export class BasicCrudService<T> {
  constructor(protected repository: Repository<T>) {}

  /**
   * Retrieves a single entity based on the provided options.
   * @param {FindOptionsWhere<T> | FindOptionsWhere<T>[]} [options] - The options for finding the entity.
   * @returns {Promise<T>} A promise that resolves with the retrieved entity.
   */
  async get(
    options?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    relations: string[] = [],
  ): Promise<T> {
    return await this.repository.findOne({
      where: options,
      relations: [...relations],
    });
  }

  /**
   * Retrieves multiple entities based on the provided options.
   * @param {FindOptionsWhere<T> | FindOptionsWhere<T>[]} [options] - The options for finding the entities.
   * @param {FindOptionsOrder<T>} [orderOptions] - The options for ordering the retrieved entities.
   * @param {string[]} [relations] - The relations to include in the retrieved entities.
   * @param {number} [take] - The maximum number of entities to retrieve.
   * @param {number} [skip] - The number of entities to skip.
   * @returns {Promise<T[]>} A promise that resolves with an array of retrieved entities.
   */
  async getMany(
    options?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    orderOptions?: FindOptionsOrder<T>,
    relations: string[] = [],
    take?: number,
    skip?: number,
  ): Promise<T[]> {
    return await this.repository.find({
      where: options,
      order: orderOptions,
      relations: [...relations],
      take,
      skip,
    });
  }

  /**
   * Creates a new entity with the provided payload.
   * @param {T | DeepPartial<T>} payload - The payload for creating the new entity.
   * @returns {Promise<T>} A promise that resolves with the created entity.
   */
  async create(payload: T | DeepPartial<T>): Promise<T> {
    return await this.repository.save(payload);
  }

  /**
   * Updates an existing entity based on the provided condition and payload.
   * @param {FindOptionsWhere<T>} condition - The condition for finding the entity to update.
   * @param {T | Partial<T> | DeepPartial<T>} payload - The payload for updating the entity.
   * @returns {Promise<UpdateResult>} A promise that resolves with the update result.
   */
  async update(
    condition: FindOptionsWhere<T>,
    payload: T | Partial<T> | DeepPartial<T>,
  ): Promise<UpdateResult> {
    return await this.repository.update(
      condition,
      payload as QueryDeepPartialEntity<T>,
    );
  }

  /**
   * updates or create a entity based on the provided payload.
   * @param {T | Partial<T> | DeepPartial<T>} payload - The payload for updating the entity.
   * @returns {Promise<T>} A promise that resolves with the saved enity
   */
  async save(payload: T | Partial<T> | DeepPartial<T>): Promise<T> {
    return await this.repository.save(payload as DeepPartial<T>);
  }

  /**
   * Deletes an entity based on the provided condition.
   * @param {FindOptionsWhere<T>} condition - The condition for finding the entity to delete.
   * @returns {Promise<DeleteResult>} A promise that resolves with the delete result.
   */
  async delete(condition: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.repository.delete(condition);
  }
}
