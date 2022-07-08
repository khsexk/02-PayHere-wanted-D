import { DataSource } from 'typeorm';

export const clearDatabase = async (dataSource: DataSource) => {
  await dataSource.query('SET FOREIGN_KEY_CHECKS=0;');
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }

  await dataSource.query('SET FOREIGN_KEY_CHECKS=1;');
};
