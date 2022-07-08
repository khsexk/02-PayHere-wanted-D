import {
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
@Entity({ schema: 'payhere', name: 'financialledgers' })
export class FinancialLedger {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ManyToOne(() => User, (user) => user.financialLedgerList, {
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
