import { Resolver, Query, Mutation, Args, ID, ResolveReference, Directive, Int } from '@nestjs/graphql';
import { UserService } from './user.service';

import { Post, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../../../../Libs/shared/gql-auth.guard';
import { CurrentUser } from '../../../../Libs/shared/current-user.decorator';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../../../Libs/shared/EmailService';
import * as bcrypt from 'bcrypt';







@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService , private readonly jwtService: JwtService,private readonly emailService: EmailService,) {}

  @Query(() => User, { name: 'getProfile' })
  @UseGuards(GqlAuthGuard)
  async getProfile(@CurrentUser() user: { sub: string }) {
    console.log('User in getProfile:', user); // Log the user object
    const fullUser = await this.userService.findOne(Number(user.sub)); // Fetch user details by ID
    if (!fullUser) {
      throw new Error('User not found');
    }
    return fullUser;
  }
  @Directive('@key(fields: "id")')
  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.userService.findOne(Number(reference.id));
  }



  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: number) {
    const numericId = Number(id);
    return this.userService.findOne(numericId);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => Boolean)
  removeUser(@Args('id', { type: () => ID }) id: string) {
    const numericId = Number(id); // ✅ conversion explicite
    return this.userService.remove(numericId);
  }

  @Query(() => User, { name: 'userByEmail', nullable: true })
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }
    return user;
  }

  @Query(() => [User], { name: 'pendingUsers' })
  @UseGuards(GqlAuthGuard)
  async getPendingUsers(@CurrentUser() user: { role: string }) {
    console.log((user.role))
    if (user.role !== 'ADMIN') {
      throw new Error('Only admins can view pending user requests');
    }

    return this.userService.findUsersWithoutPassword();
  }
  @Mutation(() => User,{ name: 'acceptUserRequest' })
  @UseGuards(GqlAuthGuard)  // Ce guard vérifie déjà que le JWT contient un rôle ADMIN
  async acceptUserRequest(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<User> {
    // 1) Vérification de l'existence de l'utilisateur
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2) Génération d’un token temporaire pour définir le mot de passe
    //    on y inclut l’id et, si besoin, un claim « expiresIn » plus court
    const resetToken = this.jwtService.sign(
      { sub: user.id },
    );

    // 3) Montage du lien de reset (le frontend/le client devra le traiter)
    const resetUrl = `'http://localhost:5173/set-password?token=${resetToken}`;

    // 4) Envoi de l’email via le service partagé
    await this.emailService.sendEmail(
      user.email,
      'Activation de votre compte Hyper-Sapiens',
      `Bonjour ${user.name},\n\nVotre compte a été approuvé !\n\nVeuillez définir votre mot de passe en cliquant sur ce lien :\n${resetUrl}\n\n`,
    );

    return user;
  }
  @Mutation(() => Boolean, { name: 'setPassword' })
  async setPassword(
    @Args('token') token: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    // 1) Vérifier/signature du token
    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new Error('Token invalide ou expiré');
    }

    // 2) Récupérer l'ID utilisateur à partir du claim `sub`
    const userId = Number(payload.sub);
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('Utilisateur introuvable');
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    console.log(newPassword)
    console.log('Hashed password:', hashed);

    // 4) Mettre à jour l’utilisateur en base// Log the user ID being updated
    await this.userService.update(userId, { id: userId, password: hashed });

    return true;
  }





}