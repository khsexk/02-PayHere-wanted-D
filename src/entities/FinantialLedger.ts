import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';

@Index('id', ['id'], {})
@Index('user', ['user'], {})
@Entity({ schema: 'payhere', name: 'finantialledgers' })
export class FinantialLedger extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user!: User;

  @Column()
  expenditure: number;

  @Column()
  income: number;

  @Column()
  date: Date;

  @Column({ length: 4000 })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
