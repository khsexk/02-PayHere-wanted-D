import {
  Column,
  CreateDateColumn,
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

  @Column({ nullable: true })
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  update({
    income,
    expenditure,
    remarks,
  }: {
    income: number;
    expenditure: number;
    remarks: string;
  }) {
    this.expenditure = expenditure;
    this.income = income;
    this.remarks = remarks;
  }

  delete() {
    this.deletedAt = new Date();
  }

  isDeleted() {
    return this.deletedAt !== null;
  }

  restore() {
    this.deletedAt = null;
  }
}
