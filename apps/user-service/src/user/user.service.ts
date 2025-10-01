import { Injectable, Inject } from '@nestjs/common';

import { Driver } from 'neo4j-driver';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const session = this.driver.session();

    try {
      // 🔢 Générer un ID auto-incrémenté avec un noeud Counter
      const counterResult = await session.run(`
        MERGE (c:Counter {name: 'User'})
        ON CREATE SET c.value = 1
        ON MATCH SET c.value = c.value + 1
        RETURN c.value AS id
      `);

      const id = counterResult.records[0].get('id').toInt(); // 👈 cast Neo4j int → JS number
      let hashedPassword = '';
      if (createUserInput.password) {
        hashedPassword = await bcrypt.hash(createUserInput.password, 10);
      }

      const query = `
        CREATE (u:User {
          id: $id,
          name: $name,
          prenom: $prenom,
          email: $email,
          password: $password,
          role: $role,
          number: $number,
          createdAt: datetime()
        })
        RETURN u
      `;

      const result = await session.run(query, {
        id,
        name: createUserInput.name,
        prenom: createUserInput.prenom,
        email: createUserInput.email,
        password: hashedPassword,
        role: createUserInput.role ?? 'CLIENT',
        number: createUserInput.number,
      });

      const node = result.records[0].get('u');
      return node.properties as User;
    } finally {
      await session.close();
    }
  }

  async findAll(): Promise<User[]> {
    const session = this.driver.session();
    const result = await session.run('MATCH (u:User) WHERE u.password IS NOT NULL AND u.password <> "" AND u.role = "CLIENT" RETURN u');
    await session.close();
    return result.records.map((record) => record.get('u').properties as User);
  }

  async findOne(id: number): Promise<User | null> {
    const session = this.driver.session();
    const result = await session.run(
      `
      MATCH (u:User {id: $id})
      RETURN u
       `,
      { id },
    );
    await session.close();
    if (result.records.length === 0) return null;



    return result.records[0].get('u').properties as User;
  }

  async update(id: number, updateUserInput: UpdateUserInput): Promise<User | null> {
    const session = this.driver.session();

    const setFields = Object.keys(updateUserInput)
      .filter(key => key !== 'id')
      .map((key) => `u.${key} = $${key}`)
      .join(', ');

    const query = `
      MATCH (u:User {id: $id})
      SET ${setFields}
      RETURN u
    `;

    const { id: _, ...updates } = updateUserInput;

    const result = await session.run(query, {
      id,
      ...updates,
    });

    await session.close();
    if (result.records.length === 0) return null;
    return result.records[0].get('u').properties as User;
  }

  async remove(id: number): Promise<boolean> {
    const session = this.driver.session();



    const result = await session.run(
      'MATCH (u:User {id: $id}) DETACH DELETE u RETURN COUNT(u) as count',
      { id },
    );

    const count = result.records[0].get('count').toInt();
    console.log('Deleted nodes count:', count); // 🪵

    await session.close();
    return count > 0;
  }

  async findByEmail(email: string): Promise<User | null> {
    const session = this.driver.session();

    try {
      const result = await session.run(
        'MATCH (u:User {email: $email}) RETURN u',
        { email },
      );

      if (result.records.length === 0) return null;
      return result.records[0].get('u').properties as User;
    } finally {
      await session.close();
    }
  }

  async findUsersWithoutPassword(): Promise<User[]> {
    const session = this.driver.session();

    try {
      // Requête pour récupérer les utilisateurs sans mot de passe
      const result = await session.run(
        'MATCH (u:User) WHERE u.password = "" RETURN u'
      );

      return result.records.map((record) => record.get('u').properties as User);
    } finally {
      await session.close();
    }
  }

}
