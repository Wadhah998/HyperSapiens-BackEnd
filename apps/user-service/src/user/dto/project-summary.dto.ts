import { ObjectType, Field, ID } from '@nestjs/graphql';
import { DeliverableFileSummary } from './deliverable-file-summary.dto';

@ObjectType('ProjectSummary')
export class ProjectSummary {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  progress?: number;

  @Field({ nullable: true })
  budgetEstime?: number;

  @Field({ nullable: true })
  devise?: string;

  @Field({ nullable: true })
  budgetDepense?: number;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;

  @Field({ nullable: true })
  createdAt?: string;

  @Field({ nullable: true })
  updatedAt?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field(() => [String], { nullable: true })
  demandes?: string[];

  @Field({ nullable: true })
  cahierCharge?: string;

  @Field({ nullable: true })
  cahierChargeUrl?: string;

  @Field({ nullable: true })
  cahierChargeFileName?: string;

  @Field({ nullable: true })
  cahierChargeMimeType?: string;

  @Field({ nullable: true })
  cahierChargeSize?: number;

  // 👈 RÉSULTATS DE L'ANALYSE AUTOMATIQUE DU CAHIER DE CHARGE
  @Field({ nullable: true })
  cahierChargeAnalysisStatus?: string; // VALIDE, INCOMPLET, NON_CONFORME, INVALIDE

  @Field({ nullable: true })
  cahierChargeAnalysisResult?: string; // JSON string contenant tous les résultats de l'analyse

  @Field({ nullable: true })
  cahierChargeAnalysisDate?: string; // Date de l'analyse

  @Field({ nullable: true })
  lastUpdatedById?: string;

  @Field(() => [String], { nullable: true })
  jalonsIds?: string[];

  @Field(() => [String], { nullable: true })
  livrablesIds?: string[];

  @Field({ nullable: true })
  clientId?: string;

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

  // 👈 NOUVEAUX CHAMPS : Bugs majeurs et mineurs
  @Field({ nullable: true })
  bugMajeur?: string;

  @Field({ nullable: true })
  bugMineur?: string;

  // 👈 NOUVEAU CHAMP : Status Demo (boolean, défaut: false)
  @Field(() => Boolean, { defaultValue: false })
  statusDemo: boolean = false;

  // 👈 MÉTADONNÉES DU FICHIER OFFRE PROJECT
  @Field({ nullable: true })
  offreProjectUrl?: string;

  @Field({ nullable: true })
  offreProjectFileName?: string;

  @Field({ nullable: true })
  offreProjectMimeType?: string;

  @Field({ nullable: true })
  offreProjectSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT
  @Field({ nullable: true })
  contratUrl?: string;

  @Field({ nullable: true })
  contratFileName?: string;

  @Field({ nullable: true })
  contratMimeType?: string;

  @Field({ nullable: true })
  contratSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT SIGNÉ
  @Field({ nullable: true })
  contratSigneUrl?: string;

  @Field({ nullable: true })
  contratSigneFileName?: string;

  @Field({ nullable: true })
  contratSigneMimeType?: string;

  @Field({ nullable: true })
  contratSigneSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER PURCHASE
  @Field({ nullable: true })
  purchaseUrl?: string;

  @Field({ nullable: true })
  purchaseFileName?: string;

  @Field({ nullable: true })
  purchaseMimeType?: string;

  @Field({ nullable: true })
  purchaseSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER MEETING REPORT
  @Field({ nullable: true })
  meetingReportUrl?: string;

  @Field({ nullable: true })
  meetingReportFileName?: string;

  @Field({ nullable: true })
  meetingReportMimeType?: string;

  @Field({ nullable: true })
  meetingReportSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER RAPPORT TEST
  @Field({ nullable: true })
  rapportTestUrl?: string;

  @Field({ nullable: true })
  rapportTestFileName?: string;

  @Field({ nullable: true })
  rapportTestMimeType?: string;

  @Field({ nullable: true })
  rapportTestSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER GUIDE UTILISATEUR
  @Field({ nullable: true })
  guideUtilisateurUrl?: string;

  @Field({ nullable: true })
  guideUtilisateurFileName?: string;

  @Field({ nullable: true })
  guideUtilisateurMimeType?: string;

  @Field({ nullable: true })
  guideUtilisateurSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER DOC TECHNIQUE
  @Field({ nullable: true })
  docTechniqueUrl?: string;

  @Field({ nullable: true })
  docTechniqueFileName?: string;

  @Field({ nullable: true })
  docTechniqueMimeType?: string;

  @Field({ nullable: true })
  docTechniqueSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER FORMATION CLIENT
  @Field({ nullable: true })
  formationClientUrl?: string;

  @Field({ nullable: true })
  formationClientFileName?: string;

  @Field({ nullable: true })
  formationClientMimeType?: string;

  @Field({ nullable: true })
  formationClientSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER DEMO FILE
  @Field({ nullable: true })
  demoFileUrl?: string;

  @Field({ nullable: true })
  demoFileFileName?: string;

  @Field({ nullable: true })
  demoFileMimeType?: string;

  @Field({ nullable: true })
  demoFileSize?: number;

  // 👈 CHAMP DEMO URL
  @Field({ nullable: true })
  demoUrl?: string;

  // 👈 MÉTADONNÉES DU FICHIER DOC RECETTE
  @Field({ nullable: true })
  docRecetteUrl?: string;

  @Field({ nullable: true })
  docRecetteFileName?: string;

  @Field({ nullable: true })
  docRecetteMimeType?: string;

  @Field({ nullable: true })
  docRecetteSize?: number;

  // 👈 CHAMP STATUS RECETTE
  @Field(() => Boolean, { defaultValue: false })
  statusRecette: boolean = false;

  // 👈 CHAMP REFUS RECETTE
  @Field({ nullable: true })
  refusRecette?: string;

  // 👈 CHAMP URL PRODUCTION
  @Field({ nullable: true })
  urlProduction?: string;

  // 👈 MÉTADONNÉES DU FICHIER DOC EXPLOITATION
  @Field({ nullable: true })
  docExploitationUrl?: string;

  @Field({ nullable: true })
  docExploitationFileName?: string;

  @Field({ nullable: true })
  docExploitationMimeType?: string;

  @Field({ nullable: true })
  docExploitationSize?: number;

  // 👈 CHAMP STATUS PROCEDURE
  @Field(() => Boolean, { defaultValue: false })
  statusProcedure: boolean = false;

  // 👈 CHAMP REFUS PROCEDURE
  @Field({ nullable: true })
  refusProcedure?: string;

  // 👈 CHAMPS POUR LES DONNÉES DES EXIGENCES
  @Field({ nullable: true })
  titreExigence?: string;

  @Field({ nullable: true })
  descriptionExigence?: string;

  @Field({ nullable: true })
  categorieExigence?: string;

  @Field({ nullable: true })
  complexiteExigence?: string;

  @Field(() => Number, { nullable: true })
  coutExigence?: number;

  @Field(() => Number, { nullable: true })
  delaiExigence?: number;

  @Field(() => Boolean, { defaultValue: false })
  statutExigence: boolean = false;

  // 👈 FICHIERS DELIVERABLES MULTIPLES AVEC STATUT D'APPROBATION
  @Field(() => [DeliverableFileSummary], { nullable: 'itemsAndList' })
  deliverableFiles?: DeliverableFileSummary[]; // Fichiers deliverables avec leur statut
}
