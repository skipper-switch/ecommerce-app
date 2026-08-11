import { CategoryEntity } from 'src/categories/entities/category.entity';
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

@Entity({ name: 'products' })
export class ProductEntity {
  @Column({ primary: true, generated: 'uuid' })
  _id!: string;

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