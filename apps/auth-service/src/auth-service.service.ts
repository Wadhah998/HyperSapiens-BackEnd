import { Injectable } from '@nestjs/common';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private client: ApolloClient<any>;

  constructor(private configService: ConfigService) {
    this.client = new ApolloClient({
      uri: 'http://localhost:3001/graphql', // URL de user-service
      cache: new InMemoryCache(),
    });
  }

  async validateUser(email: string, password: string) {
    const GET_USER = gql`
        query getUserByEmail($email: String!) {
            userByEmail(email: $email) {  
            id
            email
            role
            password
        }
        }
    `;

    try {
      const { data } = await this.client.query({
        query: GET_USER,
        variables: { email },
      });

      console.log('Data received from user service:', data); // Vérification de la structure des données

      const user = data.userByEmail; // Vérifiez ici si le champ est bien 'userByEmail'

      if (user) {
        // Comparer le mot de passe brut avec le mot de passe hashé stocké en base de données
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Raw password:', password);
        console.log('Hashed password:', user.password);
        if (isPasswordValid) {
          return user;  // Si les mots de passe correspondent, retourner l'utilisateur
        } else {
          console.log('Invalid password');
        }
      } else {
        console.log('No user found with the given email');
      }
    } catch (error) {
      console.error('Error during GraphQL query:', error);
    }

    return null; // Return null if validation fails
  }

  getHello() {
    return '';
  }
}
