// src/neo4j/neo4j.module.ts
import { Module } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';

@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: (): Driver => {
        return neo4j.driver(
          'bolt://localhost:7687',
          neo4j.auth.basic('neo4j', '24259043')
        );
      },
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
