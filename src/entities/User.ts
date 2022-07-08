import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinancialLedger } from './FinancialLedger';
import { Token } from './Token';

@Index('id', ['id'], {})
@Entity({ schema: 'payhere', name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FinancialLedger, (financialledgers) => financialledgers.user)
  financialLedgerList: FinancialLedger[];

  @OneToMany(() => Token, (token) => token.id)
  tokenList: Token[];
}
