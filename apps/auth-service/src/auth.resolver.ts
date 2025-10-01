import { Resolver, Mutation, Args , Query } from '@nestjs/graphql';

import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth-service.service';
import { LoginInput } from '../dto/auth.dto';
import { LoginResponseDto } from '../dto/login-response.dto';

 // Assurez-vous que LoginInput est correctement défini
 // Pour renvoyer une réponse structurée avec JWT

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Query(() => String)
  hello(): string {
    return 'Hello from Auth Service!';
  }
  @Mutation(() => LoginResponseDto)  // Renvoie un type spécifique LoginResponseDto
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponseDto> {
    const { email, password } = loginInput;

    // Valide l'utilisateur via le service d'authentification
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Générer un JWT pour l'utilisateur valide
    const payload = { username: user.email, sub: user.id , role: user.role, };
    console.log('Payload:', payload); // Vérifiez le payload avant de le signer
    const accessToken = this.jwtService.sign(payload);

    // Retourner le token JWT dans une réponse structurée
    return {
      access_token: accessToken,
    };

  }

}
