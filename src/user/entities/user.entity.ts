import { Entity, ObjectIdColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Exclude, Transform } from 'class-transformer';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { Roles } from 'src/utility/common/user-roles.enum';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn({ primary: true, generated: 'uuid' })
  @Transform(({ value }) => value?.toString())
  _id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude() // <-- this field is stripped when serialized via class-transformer  is a sticky note on the password field that says "never show this to the outside world, no matter what."
  password!: string;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  roles!: Roles[];

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => CategoryEntity, (cat) => cat.addedBy)
  categories!: CategoryEntity[];


  @OneToMany(() => ProductEntity, (prod) => prod.addedBy)
  products!: ProductEntity[];
}
