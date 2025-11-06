import { ObjectType, Field, ID, Float, Int, Directive , registerEnumType } from '@nestjs/graphql';
import { DeliverableFile } from './deliverable-file.entity';

// Note: On ne doit pas importer User, Milestone, Deliverable directement en microservice isolé,
// ici on suppose qu'ils sont exposés par d'autres microservices via API Gateway.

export enum ProjectStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
  description: 'Status du projet',
});

@ObjectType('Project')
@Directive('@key(fields: "id")')
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  // Id du client (User)
  @Field(() => ID)
  clientId: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int, { defaultValue: 0 })
  progress: number; // 0–100

  @Field(() => Float, { nullable: true })
  budgetEstime?: number;

  @Field({ nullable: true })
  devise?: string;

  @Field(() => Float, { nullable: true })
  budgetDepense?: number;

  // Ids ou objets jalons à synchroniser via API ou events
  @Field(() => [String], { nullable: 'itemsAndList' })
  jalonsIds?: string[];
  // Ids ou objets livrables à synchroniser via API ou events
  @Field(() => [String], { nullable: 'itemsAndList' })
  livrablesIds?: string[];

  @Field({ nullable: true })
  cahierCharge?: string;

  // 👈 MÉTADONNÉES DU FICHIER CAHIER DES CHARGES
  @Field({ nullable: true })
  cahierChargeUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  cahierChargeFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  cahierChargeMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  cahierChargeSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER OFFRE PROJECT
  @Field({ nullable: true })
  offreProjectUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  offreProjectFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  offreProjectMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  offreProjectSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT
  @Field({ nullable: true })
  contratUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  contratFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  contratMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  contratSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT SIGNÉ
  @Field({ nullable: true })
  contratSigneUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  contratSigneFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  contratSigneMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  contratSigneSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER PURCHASE
  @Field({ nullable: true })
  purchaseUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  purchaseFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  purchaseMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  purchaseSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER MEETING REPORT
  @Field({ nullable: true })
  meetingReportUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  meetingReportFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  meetingReportMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  meetingReportSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER RAPPORT TEST
  @Field({ nullable: true })
  rapportTestUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  rapportTestFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  rapportTestMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  rapportTestSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER GUIDE UTILISATEUR
  @Field({ nullable: true })
  guideUtilisateurUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  guideUtilisateurFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  guideUtilisateurMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  guideUtilisateurSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER DOC TECHNIQUE
  @Field({ nullable: true })
  docTechniqueUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  docTechniqueFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  docTechniqueMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  docTechniqueSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER FORMATION CLIENT
  @Field({ nullable: true })
  formationClientUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  formationClientFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  formationClientMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  formationClientSize?: number; // Taille du fichier en bytes

  // 👈 MÉTADONNÉES DU FICHIER DEMO FILE
  @Field({ nullable: true })
  demoFileUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  demoFileFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  demoFileMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  demoFileSize?: number; // Taille du fichier en bytes

  // 👈 CHAMP DEMO URL
  @Field({ nullable: true })
  demoUrl?: string; // URL de démonstration

  // 👈 MÉTADONNÉES DU FICHIER DOC RECETTE
  @Field({ nullable: true })
  docRecetteUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  docRecetteFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  docRecetteMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  docRecetteSize?: number; // Taille du fichier en bytes

  // 👈 CHAMP STATUS RECETTE
  @Field(() => Boolean, { defaultValue: false })
  statusRecette: boolean = false;

  // 👈 CHAMP REFUS RECETTE
  @Field({ nullable: true })
  refusRecette?: string; // Motif de refus de la recette

  // 👈 CHAMP URL PRODUCTION
  @Field({ nullable: true })
  urlProduction?: string; // URL de production

  // 👈 MÉTADONNÉES DU FICHIER DOC EXPLOITATION
  @Field({ nullable: true })
  docExploitationUrl?: string; // URL/chemin du fichier

  @Field({ nullable: true })
  docExploitationFileName?: string; // Nom original du fichier

  @Field({ nullable: true })
  docExploitationMimeType?: string; // Type MIME (application/pdf, etc.)

  @Field({ nullable: true })
  docExploitationSize?: number; // Taille du fichier en bytes

  // 👈 CHAMP STATUS PROCEDURE
  @Field(() => Boolean, { defaultValue: false })
  statusProcedure: boolean = false;

  // 👈 CHAMP REFUS PROCEDURE
  @Field({ nullable: true })
  refusProcedure?: string; // Motif de refus de la procédure

  // 👈 CHAMPS POUR LES DONNÉES DES EXIGENCES
  @Field({ nullable: true })
  titreExigence?: string; // Titre de l'exigence

  @Field({ nullable: true })
  descriptionExigence?: string; // Description de l'exigence

  @Field({ nullable: true })
  categorieExigence?: string; // Catégorie de l'exigence

  @Field({ nullable: true })
  complexiteExigence?: string; // Complexité de l'exigence

  @Field(() => Number, { nullable: true })
  coutExigence?: number; // Coût de l'exigence

  @Field(() => Number, { nullable: true })
  delaiExigence?: number; // Délai de l'exigence

  @Field(() => Boolean, { defaultValue: false })
  statutExigence: boolean = false; // Statut de l'exigence

  // 👈 FICHIERS DELIVERABLES MULTIPLES
  @Field(() => [String], { nullable: 'itemsAndList' })
  deliverableFiles?: string[]; // URLs des fichiers deliverables

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Id du dernier utilisateur qui a modifié le projet
  @Field(() => ID, { nullable: true })
  lastUpdatedById?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  tags?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  demandes?: string[];

  // 👈 NOUVEAUX CHAMPS SPOC : Informations du SPOC
  @Field({ nullable: true })
  nomSpoc?: string;

  @Field({ nullable: true })
  prenomSpoc?: string;

  @Field({ nullable: true })
  posteSpoc?: string;

  @Field({ nullable: true })
  telephoneSpoc?: string;

  @Field({ nullable: true })
  emailSpoc?: string;

  // 👈 NOUVEAU CHAMP : Motif de refus du projet
  @Field({ nullable: true })
  motifRefus?: string;

  // 👈 NOUVEAU CHAMP : Chef de projet
  @Field({ nullable: true })
  chefProject?: string;

  // 👈 NOUVEAU CHAMP : Dates de réunion (peut contenir plusieurs dates complètes)
  @Field(() => [String], { nullable: 'itemsAndList' })
  datesReunion?: string[]; // Array de dates ISO string (date + heure)

  // 👈 NOUVEAU CHAMP : Offre acceptée (boolean, défaut: false)
  @Field(() => Boolean, { defaultValue: false })
  offerAccepted: boolean = false;

  // 👈 NOUVEAU CHAMP : Ajustements du contrat
  @Field({ nullable: true })
  contratAdjustments?: string;

  // 👈 NOUVELLE PROPRIÉTÉ : Propriétaire du projet (Federation)
  @Field(() => ID, { nullable: true })
  ownerId?: string; // ID de l'utilisateur propriétaire

  // 👈 NOUVEAUX CHAMPS : Bugs majeurs et mineurs
  @Field({ nullable: true })
  bugMajeur?: string;

  @Field({ nullable: true })
  bugMineur?: string;

  // 👈 NOUVEAU CHAMP : Status Demo (boolean, défaut: false)
  @Field(() => Boolean, { defaultValue: false })
  statusDemo: boolean = false;
}
