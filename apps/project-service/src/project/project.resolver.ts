import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../../../Libs/shared/gql-auth.guard';
import { CurrentUser } from '../../../../Libs/shared/current-user.decorator';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project], { name: 'projects' })
  findAll() {
    return this.projectService.findAll();
  }

  @Query(() => Project, { name: 'project' })
  findOne(@Args('id') id: string) {
    return this.projectService.findOne(id);
  }

  @Mutation(() => Project)
  createProject(@Args('input') input: CreateProjectInput) {
    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  updateProject(@Args('input') input: UpdateProjectInput) {
    return this.projectService.update(input);
  }

  @Mutation(() => Boolean)
  removeProject(@Args('id') id: string) {
    return this.projectService.remove(id);
  }
  // Soumettre une demande de création de projet
  @Mutation(() => Project)
  async createProjectRequest(@Args('input') input: CreateProjectInput) {
    return this.projectService.createProjectRequest(input);
  }
  @Mutation(() => Project)
  async updateProjectStatus(@Args('id') id: string, @Args('status') status: string) {
    return this.projectService.updateProjectStatus(id, status);
  }
  @Mutation(() => Project)
  async convertRequestToProject(@Args('id') id: string) {
    return this.projectService.convertRequestToProject(id);
  }

  // Query pour récupérer toutes les demandes de projet avec statut "PENDING"
  @Query(() => [Project], { name: 'pendingRequests' })
  @UseGuards(GqlAuthGuard)
  findPendingRequests(@CurrentUser() user: { role: string }) {
    if (user.role !== 'ADMIN') {
      throw new Error('Only admins can view pending user requests');
    }
    return this.projectService.findPendingRequests();
  }

  @Query(() => [Project], { name: 'projectsWithCahierCharge' })
  @UseGuards(GqlAuthGuard)
  findProjectsWithCahierCharge(@CurrentUser() user: { role: string }) {
    if (user.role !== 'ADMIN') {
      throw new Error('Only admins can view projects with cahier charge');
    }
    return this.projectService.findProjectsWithCahierCharge();
  }
  @Mutation(() => Project)
  async acceptOrRejectRequest(
    @Args('id') id: string,
    @Args('decision') decision: boolean,
  ) {
    return this.projectService.acceptOrRejectRequest(id, decision);
  }

  // 👈 RESOLVER FEDERATION : Récupérer l'ID du propriétaire du projet
  @ResolveField('ownerId', () => String)
  async getProjectOwnerId(@Parent() project: Project): Promise<string> {
    return project.clientId; // clientId contient l'ID de l'utilisateur
  }


  @Mutation(() => Project, { name: 'deleteCahierCharge' })
  @UseGuards(GqlAuthGuard)
  async deleteCahierCharge(
    @Args('projectId') projectId: string,
    @CurrentUser() user: any,
  ): Promise<Project> {
    return this.projectService.deleteCahierCharge(projectId);
  }

  @Mutation(() => Project, { name: 'updateProjectRefusalReason' })
  @UseGuards(GqlAuthGuard)
  async updateProjectRefusalReason(
    @Args('projectId') projectId: string,
    @Args('motifRefus') motifRefus: string,
    @CurrentUser() user: any,
  ): Promise<Project> {
    return this.projectService.updateProjectRefusalReason(projectId, motifRefus);
  }

}