import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer')
  price: number;
  @PrimaryGeneratedColumn('uuid')
  user_id: string;
  @Column('integer', { default: 1 })
  quantity: number;
  @Column('text', { unique: true, nullable: true })
  title: string;
  @Column('text')
  description: string;

  @Column('text')
  image: string;

  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
