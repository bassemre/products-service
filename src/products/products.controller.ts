import { Controller } from '@nestjs/common';
import { MessagePattern, EventPattern } from '@nestjs/microservices';
import { ProductEntity } from './products.entity';
import { ProductsService } from './products.service';
import {
  create_product,
  fetch_products_by_ids,
  get_product,
  order_deleted,
  show_product,
  update_product,
} from 'src/shared/config/cmd-patterns/products.patterns';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @MessagePattern({ cmd: get_product })
  async getProducts(data: any): Promise<ProductEntity[]> {
    return await this.products.getProducts(data);
  }

  @MessagePattern({ cmd: create_product })
  async store(data: any): Promise<any> {
    return await this.products.store(data);
  }

  @MessagePattern({ cmd: update_product })
  update({
    id,
    title,
    description,
    image,
    price,
    user_id,
  }: any): Promise<ProductEntity> {
    return this.products.update(
      id,
      { title, description, image, price },
      user_id,
    );
  }

  @MessagePattern({ cmd: show_product })
  async show(id: string): Promise<ProductEntity> {
    return await this.products.show(id);
  }
  @MessagePattern({ cmd: fetch_products_by_ids })
  async fetchProductsByIds(ids: Array<string>) {
    return await this.products.fetchProductsByIds(ids);
  }
  @EventPattern({ cmd: order_deleted })
  async handleOrderDeleted(products: Array<{ id: string; quantity: number }>) {
    return await this.products.incrementProductsStock(products);
  }
  @EventPattern('order_created')
  async handleOrderCreated(products: Array<{ id: string; quantity: number }>) {
    this.products.decrementProductsStock(products);
  }

  @MessagePattern('delete-product')
  destroy({ id, user_id }: { id: string; user_id: string }) {
    return this.products.destroy(id, user_id);
  }
}
