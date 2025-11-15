import { Injectable, Inject } from '@nestjs/common';

import { Driver } from 'neo4j-driver';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';
import { ProjectSummary } from './dto/project-summary.dto';
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
          nomEntreprise: $nomEntreprise,
          adresseFacturation: $adresseFacturation,
          numTva: $numTva,
          nomComptable: $nomComptable,
          contact: $contact,
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
        nomEntreprise: createUserInput.nomEntreprise ?? null,
        adresseFacturation: createUserInput.adresseFacturation ?? null,
        numTva: createUserInput.numTva ?? null,
        nomComptable: createUserInput.nomComptable ?? null,
        contact: createUserInput.contact ?? null,
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

  // 👈 NOUVELLE MÉTHODE : Récupérer les projets complets d'un utilisateur (Federation)
  async findUserProjects(userId: number): Promise<ProjectSummary[]> {
    const session = this.driver.session();

    try {
      const result = await session.run(`
        MATCH (u:User {id: $userId})-[:OWNS]->(p:Project)
        OPTIONAL MATCH (p)<-[:BELONGS_TO]-(df:DeliverableFile)
        WITH p, collect(df) as deliverableFiles
        RETURN p.id, p.name, p.description, p.status, p.progress, p.budgetEstime, p.devise, p.budgetDepense, 
               p.startDate, p.endDate, p.createdAt, p.updatedAt, p.tags, p.demandes, p.cahierCharge, 
               p.cahierChargeFileName, p.cahierChargeAnalysisStatus, p.cahierChargeAnalysisResult, 
               p.cahierChargeAnalysisDate, p.lastUpdatedById, p.jalonsIds, p.livrablesIds, p.clientId,
               p.nomSpoc, p.prenomSpoc, p.posteSpoc, p.telephoneSpoc, p.emailSpoc, p.motifRefus,
               p.chefProject, p.datesReunion, p.offerAccepted, p.contratAdjustments,
               p.bugMajeur, p.bugMineur, p.statusDemo,
               p.offreProjectUrl, p.offreProjectFileName, p.offreProjectMimeType, p.offreProjectSize,
               p.contratUrl, p.contratFileName, p.contratMimeType, p.contratSize,
               p.contratSigneUrl, p.contratSigneFileName, p.contratSigneMimeType, p.contratSigneSize,
               p.purchaseUrl, p.purchaseFileName, p.purchaseMimeType, p.purchaseSize,
               p.meetingReportUrl, p.meetingReportFileName, p.meetingReportMimeType, p.meetingReportSize,
               p.rapportTestUrl, p.rapportTestFileName, p.rapportTestMimeType, p.rapportTestSize,
               p.guideUtilisateurUrl, p.guideUtilisateurFileName, p.guideUtilisateurMimeType, p.guideUtilisateurSize,
               p.docTechniqueUrl, p.docTechniqueFileName, p.docTechniqueMimeType, p.docTechniqueSize,
               p.formationClientUrl, p.formationClientFileName, p.formationClientMimeType, p.formationClientSize,
               p.demoFileUrl, p.demoFileFileName, p.demoFileMimeType, p.demoFileSize,
               p.demoUrl,
               p.docRecetteUrl, p.docRecetteFileName, p.docRecetteMimeType, p.docRecetteSize,
               p.statusRecette,
               p.refusRecette,
               p.urlProduction,
               p.docExploitationUrl, p.docExploitationFileName, p.docExploitationMimeType, p.docExploitationSize,
               p.statusProcedure,
               p.refusProcedure,
               p.titreExigence,
               p.descriptionExigence,
               p.categorieExigence,
               p.complexiteExigence,
               p.coutExigence,
               p.delaiExigence,
               p.statutExigence,
               deliverableFiles
        ORDER BY p.createdAt DESC
      `, { userId });

      // Fonction pour convertir les dates Neo4j en strings
      const formatNeo4jDate = (dateObj: any): string | null => {
        if (!dateObj) return null;
        if (typeof dateObj === 'string') return dateObj;
        
        // Convertir l'objet date Neo4j en string ISO
        try {
          const date = new Date(
            dateObj.year.low,
            dateObj.month.low - 1, // Les mois sont 0-indexés en JavaScript
            dateObj.day.low,
            dateObj.hour?.low || 0,
            dateObj.minute?.low || 0,
            dateObj.second?.low || 0
          );
          return date.toISOString();
        } catch (error) {
          console.warn('Erreur de conversion de date:', error);
          return null;
        }
      };

      return result.records.map((record) => {
        const project = {
          id: record.get('p.id'),
          name: record.get('p.name'),
          description: record.get('p.description'),
          status: record.get('p.status'),
          progress: record.get('p.progress'),
          budgetEstime: record.get('p.budgetEstime'),
          devise: record.get('p.devise'),
          budgetDepense: record.get('p.budgetDepense'),
          startDate: record.get('p.startDate'),
          endDate: record.get('p.endDate'),
          createdAt: record.get('p.createdAt'),
          updatedAt: record.get('p.updatedAt'),
          tags: record.get('p.tags'),
          demandes: record.get('p.demandes'),
          cahierCharge: record.get('p.cahierCharge'),
          cahierChargeFileName: record.get('p.cahierChargeFileName'),
          cahierChargeAnalysisStatus: record.get('p.cahierChargeAnalysisStatus'),
          cahierChargeAnalysisResult: record.get('p.cahierChargeAnalysisResult'),
          cahierChargeAnalysisDate: formatNeo4jDate(record.get('p.cahierChargeAnalysisDate')),
          lastUpdatedById: record.get('p.lastUpdatedById'),
          jalonsIds: record.get('p.jalonsIds'),
          livrablesIds: record.get('p.livrablesIds'),
          clientId: record.get('p.clientId'),
          nomSpoc: record.get('p.nomSpoc'),
          prenomSpoc: record.get('p.prenomSpoc'),
          posteSpoc: record.get('p.posteSpoc'),
          telephoneSpoc: record.get('p.telephoneSpoc'),
          emailSpoc: record.get('p.emailSpoc'),
          motifRefus: record.get('p.motifRefus'),
          chefProject: record.get('p.chefProject'),
          datesReunion: record.get('p.datesReunion'),
          offerAccepted: record.get('p.offerAccepted'),
          contratAdjustments: record.get('p.contratAdjustments'),
          bugMajeur: record.get('p.bugMajeur'),
          bugMineur: record.get('p.bugMineur'),
          statusDemo: record.get('p.statusDemo'),
          offreProjectUrl: record.get('p.offreProjectUrl'),
          offreProjectFileName: record.get('p.offreProjectFileName'),
          offreProjectMimeType: record.get('p.offreProjectMimeType'),
          offreProjectSize: record.get('p.offreProjectSize'),
          contratUrl: record.get('p.contratUrl'),
          contratFileName: record.get('p.contratFileName'),
          contratMimeType: record.get('p.contratMimeType'),
          contratSize: record.get('p.contratSize'),
          contratSigneUrl: record.get('p.contratSigneUrl'),
          contratSigneFileName: record.get('p.contratSigneFileName'),
          contratSigneMimeType: record.get('p.contratSigneMimeType'),
          contratSigneSize: record.get('p.contratSigneSize'),
          purchaseUrl: record.get('p.purchaseUrl'),
          purchaseFileName: record.get('p.purchaseFileName'),
          purchaseMimeType: record.get('p.purchaseMimeType'),
          purchaseSize: record.get('p.purchaseSize'),
          meetingReportUrl: record.get('p.meetingReportUrl'),
          meetingReportFileName: record.get('p.meetingReportFileName'),
          meetingReportMimeType: record.get('p.meetingReportMimeType'),
          meetingReportSize: record.get('p.meetingReportSize'),
          rapportTestUrl: record.get('p.rapportTestUrl'),
          rapportTestFileName: record.get('p.rapportTestFileName'),
          rapportTestMimeType: record.get('p.rapportTestMimeType'),
          rapportTestSize: record.get('p.rapportTestSize'),
          guideUtilisateurUrl: record.get('p.guideUtilisateurUrl'),
          guideUtilisateurFileName: record.get('p.guideUtilisateurFileName'),
          guideUtilisateurMimeType: record.get('p.guideUtilisateurMimeType'),
          guideUtilisateurSize: record.get('p.guideUtilisateurSize'),
          docTechniqueUrl: record.get('p.docTechniqueUrl'),
          docTechniqueFileName: record.get('p.docTechniqueFileName'),
          docTechniqueMimeType: record.get('p.docTechniqueMimeType'),
          docTechniqueSize: record.get('p.docTechniqueSize'),
          formationClientUrl: record.get('p.formationClientUrl'),
          formationClientFileName: record.get('p.formationClientFileName'),
          formationClientMimeType: record.get('p.formationClientMimeType'),
          formationClientSize: record.get('p.formationClientSize'),
          demoFileUrl: record.get('p.demoFileUrl'),
          demoFileFileName: record.get('p.demoFileFileName'),
          demoFileMimeType: record.get('p.demoFileMimeType'),
          demoFileSize: record.get('p.demoFileSize'),
          demoUrl: record.get('p.demoUrl'),
          docRecetteUrl: record.get('p.docRecetteUrl'),
          docRecetteFileName: record.get('p.docRecetteFileName'),
          docRecetteMimeType: record.get('p.docRecetteMimeType'),
          docRecetteSize: record.get('p.docRecetteSize'),
          statusRecette: record.get('p.statusRecette'),
          refusRecette: record.get('p.refusRecette'),
          urlProduction: record.get('p.urlProduction'),
          docExploitationUrl: record.get('p.docExploitationUrl'),
          docExploitationFileName: record.get('p.docExploitationFileName'),
          docExploitationMimeType: record.get('p.docExploitationMimeType'),
          docExploitationSize: record.get('p.docExploitationSize'),
          statusProcedure: record.get('p.statusProcedure'),
          refusProcedure: record.get('p.refusProcedure'),
          titreExigence: record.get('p.titreExigence'),
          descriptionExigence: record.get('p.descriptionExigence'),
          categorieExigence: record.get('p.categorieExigence'),
          complexiteExigence: record.get('p.complexiteExigence'),
          coutExigence: record.get('p.coutExigence'),
          delaiExigence: record.get('p.delaiExigence'),
          statutExigence: record.get('p.statutExigence'),
          deliverableFiles: record.get('deliverableFiles').map((df: any) => {
            const file = df.properties;
            return {
              id: file.id,
              fileName: file.fileName,
              originalName: file.originalName,
              mimeType: file.mimeType,
              size: file.size,
              url: file.url,
              uploadedAt: formatNeo4jDate(file.uploadedAt),
              projectId: file.projectId,
              approved: file.approved,
              uploadedBy: file.uploadedBy, // 👈 NOUVEAU CHAMP : Qui a uploadé
              uploadedById: file.uploadedById, // 👈 NOUVEAU CHAMP : ID de l'uploader
              refusComment: file.refusComment, // 👈 NOUVEAU CHAMP : Commentaire de refus
            };
          })
        };
        
        return {
          id: project.id,
          name: project.name,
          description: project.description,
          status: project.status,
          progress: project.progress,
          budgetEstime: project.budgetEstime,
          devise: project.devise,
          budgetDepense: project.budgetDepense,
          startDate: formatNeo4jDate(project.startDate),
          endDate: formatNeo4jDate(project.endDate),
          createdAt: formatNeo4jDate(project.createdAt),
          updatedAt: formatNeo4jDate(project.updatedAt),
          tags: project.tags,
          demandes: project.demandes,
          cahierCharge: project.cahierCharge,
          cahierChargeFileName: project.cahierChargeFileName,
          cahierChargeAnalysisStatus: project.cahierChargeAnalysisStatus,
          cahierChargeAnalysisResult: project.cahierChargeAnalysisResult,
          cahierChargeAnalysisDate: formatNeo4jDate(project.cahierChargeAnalysisDate),
          lastUpdatedById: project.lastUpdatedById,
          jalonsIds: project.jalonsIds,
          livrablesIds: project.livrablesIds,
          clientId: project.clientId,
          nomSpoc: project.nomSpoc,
          prenomSpoc: project.prenomSpoc,
          posteSpoc: project.posteSpoc,
          telephoneSpoc: project.telephoneSpoc,
          emailSpoc: project.emailSpoc,
          motifRefus: project.motifRefus,
          chefProject: project.chefProject,
          datesReunion: project.datesReunion,
          offerAccepted: project.offerAccepted ?? false,
          contratAdjustments: project.contratAdjustments,
          bugMajeur: project.bugMajeur,
          bugMineur: project.bugMineur,
          statusDemo: project.statusDemo ?? false,
          offreProjectUrl: project.offreProjectUrl,
          offreProjectFileName: project.offreProjectFileName,
          offreProjectMimeType: project.offreProjectMimeType,
          offreProjectSize: project.offreProjectSize,
          contratUrl: project.contratUrl,
          contratFileName: project.contratFileName,
          contratMimeType: project.contratMimeType,
          contratSize: project.contratSize,
          contratSigneUrl: project.contratSigneUrl,
          contratSigneFileName: project.contratSigneFileName,
          contratSigneMimeType: project.contratSigneMimeType,
          contratSigneSize: project.contratSigneSize,
          purchaseUrl: project.purchaseUrl,
          purchaseFileName: project.purchaseFileName,
          purchaseMimeType: project.purchaseMimeType,
          purchaseSize: project.purchaseSize,
          meetingReportUrl: project.meetingReportUrl,
          meetingReportFileName: project.meetingReportFileName,
          meetingReportMimeType: project.meetingReportMimeType,
          meetingReportSize: project.meetingReportSize,
          rapportTestUrl: project.rapportTestUrl,
          rapportTestFileName: project.rapportTestFileName,
          rapportTestMimeType: project.rapportTestMimeType,
          rapportTestSize: project.rapportTestSize,
          guideUtilisateurUrl: project.guideUtilisateurUrl,
          guideUtilisateurFileName: project.guideUtilisateurFileName,
          guideUtilisateurMimeType: project.guideUtilisateurMimeType,
          guideUtilisateurSize: project.guideUtilisateurSize,
          docTechniqueUrl: project.docTechniqueUrl,
          docTechniqueFileName: project.docTechniqueFileName,
          docTechniqueMimeType: project.docTechniqueMimeType,
          docTechniqueSize: project.docTechniqueSize,
          formationClientUrl: project.formationClientUrl,
          formationClientFileName: project.formationClientFileName,
          formationClientMimeType: project.formationClientMimeType,
          formationClientSize: project.formationClientSize,
          demoFileUrl: project.demoFileUrl,
          demoFileFileName: project.demoFileFileName,
          demoFileMimeType: project.demoFileMimeType,
          demoFileSize: project.demoFileSize,
          demoUrl: project.demoUrl,
          docRecetteUrl: project.docRecetteUrl,
          docRecetteFileName: project.docRecetteFileName,
          docRecetteMimeType: project.docRecetteMimeType,
          docRecetteSize: project.docRecetteSize,
          statusRecette: project.statusRecette ?? false,
          refusRecette: project.refusRecette,
          urlProduction: project.urlProduction,
          docExploitationUrl: project.docExploitationUrl,
          docExploitationFileName: project.docExploitationFileName,
          docExploitationMimeType: project.docExploitationMimeType,
          docExploitationSize: project.docExploitationSize,
          statusProcedure: project.statusProcedure ?? false,
          refusProcedure: project.refusProcedure,
          titreExigence: project.titreExigence,
          descriptionExigence: project.descriptionExigence,
          categorieExigence: project.categorieExigence,
          complexiteExigence: project.complexiteExigence,
          coutExigence: project.coutExigence,
          delaiExigence: project.delaiExigence,
          statutExigence: project.statutExigence ?? false,
          deliverableFiles: [] // Les fichiers deliverables sont récupérés via l'API REST
        } as ProjectSummary;
      });
    } finally {
      await session.close();
    }
  }

}
