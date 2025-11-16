// src/neo4j/neo4j.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, { Driver } from 'neo4j-driver';

@Module({
  providers: [
    {
      provide: 'NEO4J_DRIVER',
      useFactory: (configService: ConfigService): Driver => {
        const uri = configService.get<string>('NEO4J_URI') || 'bolt://localhost:7687';
        const user = configService.get<string>('NEO4J_USER') || 'neo4j';
        const password = configService.get<string>('NEO4J_PASSWORD') || '24259043';
        
        return neo4j.driver(
          uri,
          neo4j.auth.basic(user, password)
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: ['NEO4J_DRIVER'],
})
export class Neo4jModule {}
