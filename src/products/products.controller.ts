import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ProductEntity } from './products.entity';
import { ProductsService } from './products.service';
import {
  create_product,
  delete_product,
  fetch_products_by_ids,
  get_products,
  order_deleted,
  show_product,
  update_product,
} from 'src/shared/config/cmd-patterns/products.patterns';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @MessagePattern({ cmd: get_products })
  async getProducts(): Promise<ProductEntity[]> {
    return await this.products.getProducts();
  }

  @MessagePattern({ cmd: show_product })
  async show(id: string): Promise<ProductEntity> {
    return await this.products.show(id);
  }

  @MessagePattern('fetch-products-by-ids')
  async fetchProductsByIds(ids: Array<string>) {
    return await this.products.fetchProductsByIds(ids);
  }

  @MessagePattern({ cmd: create_product })
  async store(data: any): Promise<any> {
    console.log(data.user_id);
    return await this.products.store(data);
  }

  @MessagePattern({ cmd: update_product })
  update({
    productId,
    title,
    description,
    image,
    price,
    userId,
  }: any): Promise<ProductEntity> {
    console.log(productId);
    return this.products.update(
      productId,
      { title, description, image, price },
      userId,
    );
  }

  @EventPattern('order_deleted')
  async handleOrderDeleted(products: Array<{ id: string; quantity: number }>) {
    return await this.products.incrementProductsStock(products);
  }
  @EventPattern('order_created')
  async handleOrderCreated(products: Array<{ id: string; quantity: number }>) {
    console.log(products);
    this.products.decrementProductsStock(products);
  }

  @MessagePattern({ cmd: delete_product })
  deleteProduct({ productId, userId }) {
    console.log(productId);
    console.log(userId);
    return this.products.deleteProduct(productId, userId);
  }
}
