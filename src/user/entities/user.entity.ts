import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @ObjectIdColumn({ primary: true, generated: 'uuid' })
  _id!: ObjectId;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude() // <-- this field is stripped when serialized via class-transformer  is a sticky note on the password field that says "never show this to the outside world, no matter what."
  password!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
