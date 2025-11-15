// project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Project } from './entities/project.entity';
import { FileUploadService } from './file-upload.service';
import { DeliverableFileService } from './deliverable-file.service';
import * as path from 'path';


@Injectable()
export class ProjectService {
  constructor(
    @Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver,
    private readonly fileUploadService: FileUploadService,
    private readonly deliverableFileService: DeliverableFileService,
  ) {}

  private getSession(): Session {
    return this.neo4jDriver.session();
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const session = this.getSession();
    try {
      const now = new Date().toISOString();
      
      // 1. Créer le projet
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
          demandes: $demandes,
          nomSpoc: CASE WHEN $nomSpoc IS NOT NULL THEN $nomSpoc ELSE NULL END,
          prenomSpoc: CASE WHEN $prenomSpoc IS NOT NULL THEN $prenomSpoc ELSE NULL END,
          posteSpoc: CASE WHEN $posteSpoc IS NOT NULL THEN $posteSpoc ELSE NULL END,
          telephoneSpoc: CASE WHEN $telephoneSpoc IS NOT NULL THEN $telephoneSpoc ELSE NULL END,
          emailSpoc: CASE WHEN $emailSpoc IS NOT NULL THEN $emailSpoc ELSE NULL END,
          motifRefus: CASE WHEN $motifRefus IS NOT NULL THEN $motifRefus ELSE NULL END,
          chefProject: CASE WHEN $chefProject IS NOT NULL THEN $chefProject ELSE NULL END,
          datesReunion: CASE WHEN $datesReunion IS NOT NULL THEN $datesReunion ELSE NULL END,
          offerAccepted: $offerAccepted,
          statusDemo: $statusDemo,
          offreProjectUrl: CASE WHEN $offreProjectUrl IS NOT NULL THEN $offreProjectUrl ELSE NULL END,
          offreProjectFileName: CASE WHEN $offreProjectFileName IS NOT NULL THEN $offreProjectFileName ELSE NULL END,
          offreProjectMimeType: CASE WHEN $offreProjectMimeType IS NOT NULL THEN $offreProjectMimeType ELSE NULL END,
          offreProjectSize: CASE WHEN $offreProjectSize IS NOT NULL THEN $offreProjectSize ELSE NULL END,
          contratUrl: CASE WHEN $contratUrl IS NOT NULL THEN $contratUrl ELSE NULL END,
          contratFileName: CASE WHEN $contratFileName IS NOT NULL THEN $contratFileName ELSE NULL END,
          contratMimeType: CASE WHEN $contratMimeType IS NOT NULL THEN $contratMimeType ELSE NULL END,
          contratSize: CASE WHEN $contratSize IS NOT NULL THEN $contratSize ELSE NULL END,
          contratSigneUrl: CASE WHEN $contratSigneUrl IS NOT NULL THEN $contratSigneUrl ELSE NULL END,
          contratSigneFileName: CASE WHEN $contratSigneFileName IS NOT NULL THEN $contratSigneFileName ELSE NULL END,
          contratSigneMimeType: CASE WHEN $contratSigneMimeType IS NOT NULL THEN $contratSigneMimeType ELSE NULL END,
          contratSigneSize: CASE WHEN $contratSigneSize IS NOT NULL THEN $contratSigneSize ELSE NULL END,
          purchaseUrl: CASE WHEN $purchaseUrl IS NOT NULL THEN $purchaseUrl ELSE NULL END,
          purchaseFileName: CASE WHEN $purchaseFileName IS NOT NULL THEN $purchaseFileName ELSE NULL END,
          purchaseMimeType: CASE WHEN $purchaseMimeType IS NOT NULL THEN $purchaseMimeType ELSE NULL END,
          purchaseSize: CASE WHEN $purchaseSize IS NOT NULL THEN $purchaseSize ELSE NULL END,
          meetingReportUrl: CASE WHEN $meetingReportUrl IS NOT NULL THEN $meetingReportUrl ELSE NULL END,
          meetingReportFileName: CASE WHEN $meetingReportFileName IS NOT NULL THEN $meetingReportFileName ELSE NULL END,
          meetingReportMimeType: CASE WHEN $meetingReportMimeType IS NOT NULL THEN $meetingReportMimeType ELSE NULL END,
          meetingReportSize: CASE WHEN $meetingReportSize IS NOT NULL THEN $meetingReportSize ELSE NULL END,
          rapportTestUrl: CASE WHEN $rapportTestUrl IS NOT NULL THEN $rapportTestUrl ELSE NULL END,
          rapportTestFileName: CASE WHEN $rapportTestFileName IS NOT NULL THEN $rapportTestFileName ELSE NULL END,
          rapportTestMimeType: CASE WHEN $rapportTestMimeType IS NOT NULL THEN $rapportTestMimeType ELSE NULL END,
          rapportTestSize: CASE WHEN $rapportTestSize IS NOT NULL THEN $rapportTestSize ELSE NULL END,
          guideUtilisateurUrl: CASE WHEN $guideUtilisateurUrl IS NOT NULL THEN $guideUtilisateurUrl ELSE NULL END,
          guideUtilisateurFileName: CASE WHEN $guideUtilisateurFileName IS NOT NULL THEN $guideUtilisateurFileName ELSE NULL END,
          guideUtilisateurMimeType: CASE WHEN $guideUtilisateurMimeType IS NOT NULL THEN $guideUtilisateurMimeType ELSE NULL END,
          guideUtilisateurSize: CASE WHEN $guideUtilisateurSize IS NOT NULL THEN $guideUtilisateurSize ELSE NULL END,
          docTechniqueUrl: CASE WHEN $docTechniqueUrl IS NOT NULL THEN $docTechniqueUrl ELSE NULL END,
          docTechniqueFileName: CASE WHEN $docTechniqueFileName IS NOT NULL THEN $docTechniqueFileName ELSE NULL END,
          docTechniqueMimeType: CASE WHEN $docTechniqueMimeType IS NOT NULL THEN $docTechniqueMimeType ELSE NULL END,
          docTechniqueSize: CASE WHEN $docTechniqueSize IS NOT NULL THEN $docTechniqueSize ELSE NULL END,
          formationClientUrl: CASE WHEN $formationClientUrl IS NOT NULL THEN $formationClientUrl ELSE NULL END,
          formationClientFileName: CASE WHEN $formationClientFileName IS NOT NULL THEN $formationClientFileName ELSE NULL END,
          formationClientMimeType: CASE WHEN $formationClientMimeType IS NOT NULL THEN $formationClientMimeType ELSE NULL END,
          formationClientSize: CASE WHEN $formationClientSize IS NOT NULL THEN $formationClientSize ELSE NULL END,
          demoFileUrl: CASE WHEN $demoFileUrl IS NOT NULL THEN $demoFileUrl ELSE NULL END,
          demoFileFileName: CASE WHEN $demoFileFileName IS NOT NULL THEN $demoFileFileName ELSE NULL END,
          demoFileMimeType: CASE WHEN $demoFileMimeType IS NOT NULL THEN $demoFileMimeType ELSE NULL END,
          demoFileSize: CASE WHEN $demoFileSize IS NOT NULL THEN $demoFileSize ELSE NULL END,
          demoUrl: CASE WHEN $demoUrl IS NOT NULL THEN $demoUrl ELSE NULL END,
          docRecetteUrl: CASE WHEN $docRecetteUrl IS NOT NULL THEN $docRecetteUrl ELSE NULL END,
          docRecetteFileName: CASE WHEN $docRecetteFileName IS NOT NULL THEN $docRecetteFileName ELSE NULL END,
          docRecetteMimeType: CASE WHEN $docRecetteMimeType IS NOT NULL THEN $docRecetteMimeType ELSE NULL END,
          docRecetteSize: CASE WHEN $docRecetteSize IS NOT NULL THEN $docRecetteSize ELSE NULL END,
          statusRecette: $statusRecette,
          refusRecette: CASE WHEN $refusRecette IS NOT NULL THEN $refusRecette ELSE NULL END,
          urlProduction: CASE WHEN $urlProduction IS NOT NULL THEN $urlProduction ELSE NULL END,
          docExploitationUrl: CASE WHEN $docExploitationUrl IS NOT NULL THEN $docExploitationUrl ELSE NULL END,
          docExploitationFileName: CASE WHEN $docExploitationFileName IS NOT NULL THEN $docExploitationFileName ELSE NULL END,
          docExploitationMimeType: CASE WHEN $docExploitationMimeType IS NOT NULL THEN $docExploitationMimeType ELSE NULL END,
          docExploitationSize: CASE WHEN $docExploitationSize IS NOT NULL THEN $docExploitationSize ELSE NULL END,
          statusProcedure: $statusProcedure,
          refusProcedure: CASE WHEN $refusProcedure IS NOT NULL THEN $refusProcedure ELSE NULL END,
          titreExigence: CASE WHEN $titreExigence IS NOT NULL THEN $titreExigence ELSE NULL END,
          descriptionExigence: CASE WHEN $descriptionExigence IS NOT NULL THEN $descriptionExigence ELSE NULL END,
          categorieExigence: CASE WHEN $categorieExigence IS NOT NULL THEN $categorieExigence ELSE NULL END,
          complexiteExigence: CASE WHEN $complexiteExigence IS NOT NULL THEN $complexiteExigence ELSE NULL END,
          coutExigence: CASE WHEN $coutExigence IS NOT NULL THEN $coutExigence ELSE NULL END,
          delaiExigence: CASE WHEN $delaiExigence IS NOT NULL THEN $delaiExigence ELSE NULL END,
          statutExigence: $statutExigence,
          // Les fichiers deliverables sont maintenant gérés séparément
          contratAdjustments: CASE WHEN $contratAdjustments IS NOT NULL THEN $contratAdjustments ELSE NULL END
        })
        RETURN p
        `,
        {
          ...input,
          createdAt: now,
          updatedAt: now,
          // Valeurs par défaut pour les champs SPOC optionnels
          nomSpoc: input.nomSpoc ?? null,
          prenomSpoc: input.prenomSpoc ?? null,
          posteSpoc: input.posteSpoc ?? null,
          telephoneSpoc: input.telephoneSpoc ?? null,
          emailSpoc: input.emailSpoc ?? null,
          motifRefus: input.motifRefus ?? null,
          chefProject: input.chefProject ?? null,
          datesReunion: input.datesReunion ?? null,
          offerAccepted: input.offerAccepted ?? false,
          statusDemo: input.statusDemo ?? false,
          offreProjectUrl: input.offreProjectUrl ?? null,
          offreProjectFileName: input.offreProjectFileName ?? null,
          offreProjectMimeType: input.offreProjectMimeType ?? null,
          offreProjectSize: input.offreProjectSize ?? null,
          contratUrl: input.contratUrl ?? null,
          contratFileName: input.contratFileName ?? null,
          contratMimeType: input.contratMimeType ?? null,
          contratSize: input.contratSize ?? null,
          contratSigneUrl: input.contratSigneUrl ?? null,
          contratSigneFileName: input.contratSigneFileName ?? null,
          contratSigneMimeType: input.contratSigneMimeType ?? null,
          contratSigneSize: input.contratSigneSize ?? null,
          purchaseUrl: input.purchaseUrl ?? null,
          purchaseFileName: input.purchaseFileName ?? null,
          purchaseMimeType: input.purchaseMimeType ?? null,
          purchaseSize: input.purchaseSize ?? null,
          meetingReportUrl: input.meetingReportUrl ?? null,
          meetingReportFileName: input.meetingReportFileName ?? null,
          meetingReportMimeType: input.meetingReportMimeType ?? null,
          meetingReportSize: input.meetingReportSize ?? null,
          rapportTestUrl: input.rapportTestUrl ?? null,
          rapportTestFileName: input.rapportTestFileName ?? null,
          rapportTestMimeType: input.rapportTestMimeType ?? null,
          rapportTestSize: input.rapportTestSize ?? null,
          guideUtilisateurUrl: input.guideUtilisateurUrl ?? null,
          guideUtilisateurFileName: input.guideUtilisateurFileName ?? null,
          guideUtilisateurMimeType: input.guideUtilisateurMimeType ?? null,
          guideUtilisateurSize: input.guideUtilisateurSize ?? null,
          docTechniqueUrl: input.docTechniqueUrl ?? null,
          docTechniqueFileName: input.docTechniqueFileName ?? null,
          docTechniqueMimeType: input.docTechniqueMimeType ?? null,
          docTechniqueSize: input.docTechniqueSize ?? null,
          formationClientUrl: input.formationClientUrl ?? null,
          formationClientFileName: input.formationClientFileName ?? null,
          formationClientMimeType: input.formationClientMimeType ?? null,
          formationClientSize: input.formationClientSize ?? null,
          demoFileUrl: input.demoFileUrl ?? null,
          demoFileFileName: input.demoFileFileName ?? null,
          demoFileMimeType: input.demoFileMimeType ?? null,
          demoFileSize: input.demoFileSize ?? null,
          demoUrl: input.demoUrl ?? null,
          docRecetteUrl: input.docRecetteUrl ?? null,
          docRecetteFileName: input.docRecetteFileName ?? null,
          docRecetteMimeType: input.docRecetteMimeType ?? null,
          docRecetteSize: input.docRecetteSize ?? null,
          statusRecette: input.statusRecette ?? false,
          refusRecette: input.refusRecette ?? null,
          urlProduction: input.urlProduction ?? null,
          docExploitationUrl: input.docExploitationUrl ?? null,
          docExploitationFileName: input.docExploitationFileName ?? null,
          docExploitationMimeType: input.docExploitationMimeType ?? null,
          docExploitationSize: input.docExploitationSize ?? null,
          statusProcedure: input.statusProcedure ?? false,
          refusProcedure: input.refusProcedure ?? null,
          titreExigence: input.titreExigence ?? null,
          descriptionExigence: input.descriptionExigence ?? null,
          categorieExigence: input.categorieExigence ?? null,
          complexiteExigence: input.complexiteExigence ?? null,
          coutExigence: input.coutExigence ?? null,
          delaiExigence: input.delaiExigence ?? null,
          statutExigence: input.statutExigence ?? false,
          // Les fichiers deliverables sont maintenant gérés séparément
          contratAdjustments: input.contratAdjustments ?? null,
        },
      );
      
      if (result.records.length === 0) {
        throw new Error('Failed to create project');
      }
      
      const project = result.records[0].get('p').properties as Project;
      
      // 2. 👈 CRÉER LA RELATION OWNS avec l'utilisateur
      const relationResult = await session.run(
        `
        MATCH (u:User), (p:Project {id: $projectId})
        WHERE u.id = toInteger($clientId)
        CREATE (u)-[:OWNS {createdAt: datetime()}]->(p)
        RETURN count(*) as relationsCreated
        `,
        { 
          projectId: project.id, 
          clientId: input.clientId 
        }
      );
      
      return project;
    } finally {
      await session.close();
    }
  }

  async findAll(): Promise<Project[]> {
    const session = this.getSession();
    try {
      const result = await session.run(`MATCH (p:Project) RETURN p`);
      return result.records.map((r) => {
        const project = r.get('p').properties as any;
        // Mapper cahierChargeUrl vers cahierCharge pour la compatibilité
        if (project.cahierChargeUrl && !project.cahierCharge) {
          project.cahierCharge = project.cahierChargeUrl;
        }
        return project as Project;
      });
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
      const project = result.records[0].get('p').properties as any;
      // Mapper cahierChargeUrl vers cahierCharge pour la compatibilité
      if (project.cahierChargeUrl && !project.cahierCharge) {
        project.cahierCharge = project.cahierChargeUrl;
      }
      return project as Project;
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

  async findProjectsWithCahierCharge(): Promise<Project[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `MATCH (p:Project) 
         WHERE p.cahierChargeUrl IS NOT NULL AND p.cahierChargeUrl <> ''
         RETURN p
         ORDER BY p.createdAt DESC`
      );
      return result.records.map((r) => {
        const project = r.get('p').properties as any;
        // Mapper cahierChargeUrl vers cahierCharge pour la compatibilité
        if (project.cahierChargeUrl && !project.cahierCharge) {
          project.cahierCharge = project.cahierChargeUrl;
        }
        return project as Project;
      });
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
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LA GESTION DES FICHIERS

  async uploadCahierCharge(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Valider le fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.cahierChargeUrl) {
        const oldFileName = path.basename(project.cahierChargeUrl);
        await this.fileUploadService.deleteProjectFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveProjectFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.cahierChargeUrl = $url,
            p.cahierChargeFileName = $fileName,
            p.cahierChargeMimeType = $mimeType,
            p.cahierChargeSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async deleteCahierCharge(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.cahierChargeUrl) {
        const fileName = path.basename(project.cahierChargeUrl);
        await this.fileUploadService.deleteProjectFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.cahierChargeUrl = NULL,
            p.cahierChargeFileName = NULL,
            p.cahierChargeMimeType = NULL,
            p.cahierChargeSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async saveCahierChargeAnalysis(projectId: string, analysis: any): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Extraire le statut de validation
      const status = analysis.statutValidation?.split(':')[0]?.trim() || 'UNKNOWN';
      
      // Convertir l'objet analysis en JSON string
      const analysisResultJson = JSON.stringify(analysis);
      
      // Date de l'analyse
      const analysisDate = new Date().toISOString();
      const updatedAt = new Date().toISOString();

      // Mettre à jour le projet dans Neo4j
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.cahierChargeAnalysisStatus = $status,
            p.cahierChargeAnalysisResult = $analysisResult,
            p.cahierChargeAnalysisDate = datetime($analysisDate),
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { 
          projectId, 
          status,
          analysisResult: analysisResultJson,
          analysisDate,
          updatedAt
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with analysis results');
      }

      const updatedProject = result.records[0].get('p').properties as Project;
      
      // Mapper cahierChargeUrl si nécessaire
      if (updatedProject.cahierChargeUrl && !updatedProject.cahierCharge) {
        updatedProject.cahierCharge = updatedProject.cahierChargeUrl;
      }

      return updatedProject;
    } finally {
      await session.close();
    }
  }

  async updateProjectRefusalReason(projectId: string, motifRefus: string): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Mettre à jour le motif de refus dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.motifRefus = $motifRefus,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, motifRefus, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project refusal reason');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LA GESTION DU FICHIER OFFRE PROJECT

  async uploadOffreProject(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Valider le fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.offreProjectUrl) {
        const oldFileName = path.basename(project.offreProjectUrl);
        await this.fileUploadService.deleteOffreProjectFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier d'offre
      const fileResult = await this.fileUploadService.saveOffreProjectFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.offreProjectUrl = $url,
            p.offreProjectFileName = $fileName,
            p.offreProjectMimeType = $mimeType,
            p.offreProjectSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  async deleteOffreProject(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.offreProjectUrl) {
        const fileName = path.basename(project.offreProjectUrl);
        await this.fileUploadService.deleteOffreProjectFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.offreProjectUrl = NULL,
            p.offreProjectFileName = NULL,
            p.offreProjectMimeType = NULL,
            p.offreProjectSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier contrat
  async uploadContrat(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }
      

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.contratUrl) {
        const oldFileName = path.basename(project.contratUrl);
        await this.fileUploadService.deleteContratFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveContratFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.contratUrl = $url,
            p.contratFileName = $fileName,
            p.contratMimeType = $mimeType,
            p.contratSize = $size,
            p.contratAdjustments = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );
      
      
      
      const updatedProject = result.records[0].get('p').properties as Project;
     

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return updatedProject;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier contrat
  async deleteContrat(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.contratUrl) {
        const fileName = path.basename(project.contratUrl);
        await this.fileUploadService.deleteContratFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.contratUrl = NULL,
            p.contratFileName = NULL,
            p.contratMimeType = NULL,
            p.contratSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete contrat file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier contrat signé
  async uploadContratSigne(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.contratSigneUrl) {
        const oldFileName = path.basename(project.contratSigneUrl);
        await this.fileUploadService.deleteContratSigneFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveContratSigneFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.contratSigneUrl = $url,
            p.contratSigneFileName = $fileName,
            p.contratSigneMimeType = $mimeType,
            p.contratSigneSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier contrat signé
  async deleteContratSigne(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.contratSigneUrl) {
        const fileName = path.basename(project.contratSigneUrl);
        await this.fileUploadService.deleteContratSigneFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.contratSigneUrl = NULL,
            p.contratSigneFileName = NULL,
            p.contratSigneMimeType = NULL,
            p.contratSigneSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete contrat signe file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier purchase
  async uploadPurchase(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.purchaseUrl) {
        const oldFileName = path.basename(project.purchaseUrl);
        await this.fileUploadService.deletePurchaseFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.savePurchaseFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.purchaseUrl = $url,
            p.purchaseFileName = $fileName,
            p.purchaseMimeType = $mimeType,
            p.purchaseSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier purchase
  async deletePurchase(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.purchaseUrl) {
        const fileName = path.basename(project.purchaseUrl);
        await this.fileUploadService.deletePurchaseFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.purchaseUrl = NULL,
            p.purchaseFileName = NULL,
            p.purchaseMimeType = NULL,
            p.purchaseSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete purchase file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier meeting report
  async uploadMeetingReport(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.meetingReportUrl) {
        const oldFileName = path.basename(project.meetingReportUrl);
        await this.fileUploadService.deleteMeetingReportFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveMeetingReportFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.meetingReportUrl = $url,
            p.meetingReportFileName = $fileName,
            p.meetingReportMimeType = $mimeType,
            p.meetingReportSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier meeting report
  async deleteMeetingReport(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.meetingReportUrl) {
        const fileName = path.basename(project.meetingReportUrl);
        await this.fileUploadService.deleteMeetingReportFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.meetingReportUrl = NULL,
            p.meetingReportFileName = NULL,
            p.meetingReportMimeType = NULL,
            p.meetingReportSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete meeting report file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier rapport test
  async uploadRapportTest(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.rapportTestUrl) {
        const oldFileName = path.basename(project.rapportTestUrl);
        await this.fileUploadService.deleteRapportTestFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveRapportTestFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.rapportTestUrl = $url,
            p.rapportTestFileName = $fileName,
            p.rapportTestMimeType = $mimeType,
            p.rapportTestSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier rapport test
  async deleteRapportTest(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.rapportTestUrl) {
        const fileName = path.basename(project.rapportTestUrl);
        await this.fileUploadService.deleteRapportTestFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.rapportTestUrl = NULL,
            p.rapportTestFileName = NULL,
            p.rapportTestMimeType = NULL,
            p.rapportTestSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete rapport test file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier guide utilisateur
  async uploadGuideUtilisateur(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.guideUtilisateurUrl) {
        const oldFileName = path.basename(project.guideUtilisateurUrl);
        await this.fileUploadService.deleteGuideUtilisateurFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveGuideUtilisateurFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.guideUtilisateurUrl = $url,
            p.guideUtilisateurFileName = $fileName,
            p.guideUtilisateurMimeType = $mimeType,
            p.guideUtilisateurSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier guide utilisateur
  async deleteGuideUtilisateur(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.guideUtilisateurUrl) {
        const fileName = path.basename(project.guideUtilisateurUrl);
        await this.fileUploadService.deleteGuideUtilisateurFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.guideUtilisateurUrl = NULL,
            p.guideUtilisateurFileName = NULL,
            p.guideUtilisateurMimeType = NULL,
            p.guideUtilisateurSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete guide utilisateur file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier doc technique
  async uploadDocTechnique(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.docTechniqueUrl) {
        const oldFileName = path.basename(project.docTechniqueUrl);
        await this.fileUploadService.deleteDocTechniqueFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveDocTechniqueFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docTechniqueUrl = $url,
            p.docTechniqueFileName = $fileName,
            p.docTechniqueMimeType = $mimeType,
            p.docTechniqueSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier doc technique
  async deleteDocTechnique(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.docTechniqueUrl) {
        const fileName = path.basename(project.docTechniqueUrl);
        await this.fileUploadService.deleteDocTechniqueFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docTechniqueUrl = NULL,
            p.docTechniqueFileName = NULL,
            p.docTechniqueMimeType = NULL,
            p.docTechniqueSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete doc technique file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier formation client
  async uploadFormationClient(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.formationClientUrl) {
        const oldFileName = path.basename(project.formationClientUrl);
        await this.fileUploadService.deleteFormationClientFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveFormationClientFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.formationClientUrl = $url,
            p.formationClientFileName = $fileName,
            p.formationClientMimeType = $mimeType,
            p.formationClientSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier formation client
  async deleteFormationClient(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.formationClientUrl) {
        const fileName = path.basename(project.formationClientUrl);
        await this.fileUploadService.deleteFormationClientFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.formationClientUrl = NULL,
            p.formationClientFileName = NULL,
            p.formationClientMimeType = NULL,
            p.formationClientSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete formation client file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier demo file
  async uploadDemoFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.demoFileUrl) {
        const oldFileName = path.basename(project.demoFileUrl);
        await this.fileUploadService.deleteDemoFileFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveDemoFileFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.demoFileUrl = $url,
            p.demoFileFileName = $fileName,
            p.demoFileMimeType = $mimeType,
            p.demoFileSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier demo file
  async deleteDemoFile(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.demoFileUrl) {
        const fileName = path.basename(project.demoFileUrl);
        await this.fileUploadService.deleteDemoFileFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.demoFileUrl = NULL,
            p.demoFileFileName = NULL,
            p.demoFileMimeType = NULL,
            p.demoFileSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete demo file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier doc recette
  async uploadDocRecette(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.docRecetteUrl) {
        const oldFileName = path.basename(project.docRecetteUrl);
        await this.fileUploadService.deleteDocRecetteFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveDocRecetteFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docRecetteUrl = $url,
            p.docRecetteFileName = $fileName,
            p.docRecetteMimeType = $mimeType,
            p.docRecetteSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier doc recette
  async deleteDocRecette(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.docRecetteUrl) {
        const fileName = path.basename(project.docRecetteUrl);
        await this.fileUploadService.deleteDocRecetteFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docRecetteUrl = NULL,
            p.docRecetteFileName = NULL,
            p.docRecetteMimeType = NULL,
            p.docRecetteSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        { projectId, updatedAt }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to delete doc recette file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Upload du fichier doc exploitation
  async uploadDocExploitation(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Supprimer l'ancien fichier s'il existe
      if (project.docExploitationUrl) {
        const oldFileName = path.basename(project.docExploitationUrl);
        await this.fileUploadService.deleteDocExploitationFile(projectId, oldFileName);
      }

      // Sauvegarder le nouveau fichier
      const fileResult = await this.fileUploadService.saveDocExploitationFile(projectId, file);

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docExploitationUrl = $url,
            p.docExploitationFileName = $fileName,
            p.docExploitationMimeType = $mimeType,
            p.docExploitationSize = $size,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          url: fileResult.url,
          fileName: fileResult.fileName,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project with file info');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLE MÉTHODE : Suppression du fichier doc exploitation
  async deleteDocExploitation(projectId: string): Promise<Project> {
    const session = this.getSession();
    try {
      const project = await this.findOne(projectId);
      if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
      }

      // Supprimer le fichier physique
      if (project.docExploitationUrl) {
        const fileName = path.basename(project.docExploitationUrl);
        await this.fileUploadService.deleteDocExploitationFile(projectId, fileName);
      }

      // Mettre à jour le projet dans Neo4j
      const updatedAt = new Date().toISOString();
      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        SET p.docExploitationUrl = NULL,
            p.docExploitationFileName = NULL,
            p.docExploitationMimeType = NULL,
            p.docExploitationSize = NULL,
            p.updatedAt = datetime($updatedAt)
        RETURN p
        `,
        {
          projectId,
          updatedAt,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to update project');
      }

      return result.records[0].get('p').properties as Project;
    } finally {
      await session.close();
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DELIVERABLES MULTIPLES
  async getDeliverableFiles(projectId: string) {
    return this.deliverableFileService.findByProjectId(projectId);
  }

  async addDeliverableFile(projectId: string, file: Express.Multer.File) {
    return this.deliverableFileService.create(projectId, file);
  }

  async removeDeliverableFile(fileId: string) {
    return this.deliverableFileService.remove(fileId);
  }

  async removeAllDeliverableFiles(projectId: string) {
    return this.deliverableFileService.removeByProjectId(projectId);
  }

  // 👈 NOUVELLE MÉTHODE : Initialiser les champs deliverables pour les projets existants
  async initializeDeliverablesFields(): Promise<void> {
    const session = this.getSession();
    try {
      const result = await session.run(`
        MATCH (p:Project)
        WHERE p.deliverablesUrl IS NULL
        SET p.deliverablesUrl = NULL,
            p.deliverablesFileName = NULL,
            p.deliverablesMimeType = NULL,
            p.deliverablesSize = NULL
        RETURN count(p) as updated
      `);
      
      console.log(`Initialized deliverables fields for ${result.records[0].get('updated')} projects`);
    } finally {
      await session.close();
    }
  }


}
