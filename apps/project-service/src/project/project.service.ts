// project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';


@Injectable()
export class ProjectService {
  constructor(@Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver) {}

  private getSession(): Session {
    return this.neo4jDriver.session();
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const session = this.getSession();
    try {
      const now = new Date().toISOString();
      const result = await session.run(
        `
        CREATE (p:Project {
          id: randomUUID(),
          name: $name,
          description: $description,
          clientId: $clientId,
          status: $status,
          progress: $progress,
          budgetEstime: $budgetEstime,
          devise: $devise,
          budgetDepense: $budgetDepense,
          jalonsIds: $jalonsIds,
          livrablesIds: $livrablesIds,
          cahierCharge: $cahierCharge,
          startDate: datetime($startDate),
          endDate: CASE WHEN $endDate IS NOT NULL THEN datetime($endDate) ELSE NULL END,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt),
          lastUpdatedById: $lastUpdatedById,
          tags: $tags,
          demandes: $demandes
        })
        RETURN p
        `,
        {
          ...input,
          createdAt: now,
          updatedAt: now,
        },
      );
      if (result.records.length === 0) {
        throw new Error('Failed to create project');
      }
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async findAll(): Promise<Project[]> {
    const session = this.getSession();
    try {
      const result = await session.run(`MATCH (p:Project) RETURN p`);
      return result.records.map((r) => r.get('p').properties as Project);
    } finally {
      await session.close();
    }
  }

  async findOne(id: string): Promise<Project> {
    const session = this.getSession();
    try {
      const result = await session.run(`MATCH (p:Project {id: $id}) RETURN p`, { id });
      if (result.records.length === 0) {
        throw new NotFoundException(`Project ${id} not found`);
      }
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async update(input: UpdateProjectInput): Promise<Project> {
    const session = this.getSession();
    try {
      const { id, ...fields } = input;
      const updatedAt = new Date().toISOString();

      // Construire la clause SET dynamique
      const setClauses = Object.keys(fields)
        .map((key) => {
          if (fields[key] === undefined) return null;
          if (key === 'startDate' || key === 'endDate' || key === 'createdAt' || key === 'updatedAt') {
            return `p.${key} = datetime($${key})`;
          }
          return `p.${key} = $${key}`;
        })
        .filter(Boolean)
        .join(', ');

      const params = { id, ...fields, updatedAt };

      const query = `
        MATCH (p:Project {id: $id})
        SET ${setClauses}, p.updatedAt = datetime($updatedAt)
        RETURN p
      `;

      const result = await session.run(query, params);
      if (result.records.length === 0) {
        throw new NotFoundException(`Project ${id} not found`);
      }
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async remove(id: string): Promise<boolean> {
    const session = this.getSession();
    try {
      const result = await session.run(`MATCH (p:Project {id: $id}) DETACH DELETE p RETURN count(p) AS deleted`, { id });
      return result.records[0].get('deleted').toInt() > 0;
    } finally {
      await session.close();
    }
  }

  async createProjectRequest(input: CreateProjectInput): Promise<Project> {
    const session = this.getSession();
    try {
      const now = new Date().toISOString();

      // Seules les informations essentielles sont utilisées pour la demande
      const result = await session.run(
        `
        CREATE (p:Project {
          id: randomUUID(),
          name: $name,
          description: $description,
          clientId: $clientId,
          status: "PENDING",  // Demande avec statut "PENDING"
          startDate: datetime($startDate),
          endDate: CASE WHEN $endDate IS NOT NULL THEN datetime($endDate) ELSE NULL END,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt)
        })
        RETURN p
        `,
        {
          ...input,
          createdAt: now,
          updatedAt: now,
        },
      );
      if (result.records.length === 0) {
        throw new Error('Failed to create project request');
      }
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // Mettre à jour le statut de la demande de projet (par exemple "validée")
  async updateProjectStatus(id: string, status: string): Promise<Project> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Project {id: $id})
        SET p.status = $status, p.updatedAt = datetime()
        RETURN p
        `,
        { id, status },
      );
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // Convertir la demande validée en projet officiel (changer le statut en "DRAFT")
  async convertRequestToProject(id: string): Promise<Project> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (p:Project {id: $id})
        SET p.status = 'DRAFT', p.updatedAt = datetime()
        RETURN p
        `,
        { id },
      );
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async findPendingRequests(): Promise<Project[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (p:Project {status: 'PENDING'}) RETURN p`
      );
      return result.records.map((r) => r.get('p').properties as Project);
    } finally {
      await session.close();
    }
  }
  async acceptOrRejectRequest(id: string, decision: boolean): Promise<Project> {
    const session = this.getSession();
    try {
      const updatedAt = new Date().toISOString();
      let status: string;

      // Vérifier la décision de l'administrateur : accepter ou refuser
      if (decision) {
        status = 'DRAFT'; // Si accepté, le projet passe en statut DRAFT
      } else if (!decision) {
        status = 'ON_HOLD'; // Si refusé, le projet passe en statut ON_HOLD
      } else {
        throw new Error('Invalid decision. Use "true" or "false".');
      }

      // Requête Neo4j pour mettre à jour le statut du projet
      const result = await session.run(
        `
      MATCH (p:Project {id: $id})
      SET p.status = $status, p.updatedAt = datetime($updatedAt)
      RETURN p
      `,
        { id, status, updatedAt }
      );

      // Si le projet n'existe pas, on retourne une exception
      if (result.records.length === 0) {
        throw new NotFoundException(`Project ${id} not found`);
      }

      // Retourner les propriétés du projet après la mise à jour
      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }}

}
