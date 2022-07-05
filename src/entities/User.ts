import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FinantialLedger } from './FinantialLedger';
import { Token } from './Token';

@Index('id', ['id'], {})
@Entity({ schema: 'payhere', name: 'users' })
export class User extends BaseEntity {
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

  @OneToMany(() => FinantialLedger, (finantialledgers) => finantialledgers.id)
  finantialLedgerList: FinantialLedger[];

  @OneToMany(() => Token, (token) => token.id)
  tokenList: Token[];
}
