import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ObjectId } from 'mongodb';
import { Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  ObjectIdColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class CategoryEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value?.toString())
  _id!: ObjectId;

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

