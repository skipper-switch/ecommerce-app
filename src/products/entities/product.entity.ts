import { CategoryEntity } from 'src/categories/entities/category.entity';
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

@Entity({ name: 'products' })
export class ProductEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value?.toString())
  _id!: ObjectId;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column()
  stock!: number;

  @Column('simple-array')
  images!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => UserEntity, (user) => user.products)
  @JoinColumn({ name: 'addedById' })
  addedBy!: UserEntity;


   @ManyToOne(() => CategoryEntity, (cat) => cat.products)
  category!: CategoryEntity;

}