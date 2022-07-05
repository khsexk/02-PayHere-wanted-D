import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { FinantialLedger } from 'src/entities/FinantialLedger';
import { Token } from 'src/entities/Token';
import { User } from 'src/entities/User';

dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, FinantialLedger, Token],
  autoLoadEntities: true,
  charset: 'utf8mb4',
  synchronize: true, //첫 시작은 true, 나머지는 계속 false
  logging: true, //쿼리문 로그
  keepConnectionAlive: true, //핫 리로딩 시 연결 차단 막기
  migrationsRun: false,
};

export = config;
