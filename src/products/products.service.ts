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
  async getProducts(): Promise<ProductEntity[]> {
    console.log('data loader');
    return await this.products.find();
  }

  async show(id: string): Promise<ProductEntity> {
    console.log('loader');
    return await this.products.findOneBy({ id });
  }
  async fetchProductsByIds(ids: Array<string>): Promise<ProductEntity[]> {
    return await this.products
      .createQueryBuilder('products')
      .where(`products.id IN (:...ids)`, { ids })
      .getMany();
  }
  async store(createProductDto: any): Promise<ProductEntity> {
    return await this.products.save(createProductDto);
  }

  async update(
    id: string,
    data: object,
    userId: string,
  ): Promise<ProductEntity> {
    const product = await this.products.findOneBy({ id });
    if (product.user_id === userId) {
      await this.products.update({ id }, data);

      return await this.products.findOneBy({ id });
    }
    throw new RpcException(
      new NotFoundException("You cannot update what you don't own..."),
    );
  }

  async deleteProduct(productId: string, userId: string): Promise<any> {
    const product = await this.products.findOneBy({ id: productId });
    if (product.user_id === userId) {
      await this.products.delete({ id: productId });
      return null;
    }
    throw new RpcException(
      new NotFoundException("You cannot delete what you don't own..."),
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
