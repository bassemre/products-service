import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable /* NotFoundException*/,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { ProductEntity } from './products.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>,
  ) {}
  async getProducts(data: any): Promise<ProductEntity[]> {
    return await this.products.find(data);
  }
  async fetchProductsByIds(ids: Array<string>): Promise<ProductEntity[]> {
    return await this.products
      .createQueryBuilder('products')
      .where(`products.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(data: any): Promise<ProductEntity> {
    return await this.products.save(data);
  }

  async update(
    id: string,
    data: object,
    user_id: string,
  ): Promise<ProductEntity> {
    const product = await this.products.findOneBy({ id });
    if (product.user_id === user_id) {
      await this.products.update({ id }, data);
      return await this.products.findOneBy({ id });
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async show(id: string): Promise<ProductEntity> {
    return await this.products.findOneOrFail({ where: { id } });
  }
  async destroy(id: string, user_id: string): Promise<ProductEntity> {
    const product = await this.products.findOneBy({ id });
    if (product.user_id === user_id) {
      await this.products.delete({ id });
      return product;
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }
  async decrementProductsStock(products) {
    await products.forEach((product) => {
      this.products.decrement({ id: product.id }, 'quantity', product.quantity);
    });
  }
  async incrementProductsStock(products) {
    await products.forEach((product) => {
      this.products.increment({ id: product.id }, 'quantity', product.quantity);
    });
  }
}
