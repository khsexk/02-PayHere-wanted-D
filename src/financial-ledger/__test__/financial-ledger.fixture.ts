import { faker } from '@faker-js/faker';
import { FinancialLedger } from '../../entities/FinancialLedger';
import { User } from '../../entities/User';
import { getUser } from './user.fixture';

export const getFinancialLedger = ({
  id,
  user,
}: { id?: number; user?: User } = {}) => {
  const financialLedger = new FinancialLedger();
  financialLedger.id = id || faker.datatype.number({ min: 1 });
  financialLedger.user = user || getUser();
  financialLedger.date = new Date();
  financialLedger.createdAt = new Date();
  financialLedger.updatedAt = new Date();
  financialLedger.deletedAt = null;
  financialLedger.remarks = 'test';
  financialLedger.income = 0;
  financialLedger.expenditure = 10000;
  return financialLedger;
};
