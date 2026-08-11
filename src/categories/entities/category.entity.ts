import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @Column({ primary: true, generated: 'uuid' })
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


  // In plain English: one user can create lots of categories (e.g., "Electronics", "Groceries", "Books"), but each individual category belongs to exactly one user.
  @ManyToOne(() => UserEntity, (user) => user.categories)
  @JoinColumn({ name: 'addedById' })
  addedBy!: UserEntity;

  //  In plain English: one category (say, "Electronics") can contain many products (phones, laptops, chargers), but each product belongs to just one category.
  @OneToMany(() => ProductEntity, (prod) => prod.category)
  products!: ProductEntity[];
}

