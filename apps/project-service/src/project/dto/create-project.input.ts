// dto/create-project.input.ts
import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString, IsArray, IsBoolean, IsNumber } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';


@InputType()
export class CreateProjectInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => ID)
  @IsUUID()
  clientId: string;

  @Field(() => ProjectStatus)
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  progress?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  budgetEstime?: number;

  @Field({ nullable: true })
  @IsOptional()
  devise?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  budgetDepense?: number;

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  jalonsIds?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  livrablesIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  cahierCharge?: string;

  // 👈 MÉTADONNÉES DU FICHIER CAHIER DES CHARGES
  @Field({ nullable: true })
  @IsOptional()
  cahierChargeUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  cahierChargeFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  cahierChargeMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  cahierChargeSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER OFFRE PROJECT
  @Field({ nullable: true })
  @IsOptional()
  offreProjectUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  offreProjectFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  offreProjectMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  offreProjectSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT
  @Field({ nullable: true })
  @IsOptional()
  contratUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER CONTRAT SIGNÉ
  @Field({ nullable: true })
  @IsOptional()
  contratSigneUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratSigneFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratSigneMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  contratSigneSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER PURCHASE
  @Field({ nullable: true })
  @IsOptional()
  purchaseUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  purchaseFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  purchaseMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  purchaseSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER MEETING REPORT
  @Field({ nullable: true })
  @IsOptional()
  meetingReportUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  meetingReportFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  meetingReportMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  meetingReportSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER RAPPORT TEST
  @Field({ nullable: true })
  @IsOptional()
  rapportTestUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  rapportTestFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  rapportTestMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  rapportTestSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER GUIDE UTILISATEUR
  @Field({ nullable: true })
  @IsOptional()
  guideUtilisateurUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  guideUtilisateurFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  guideUtilisateurMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  guideUtilisateurSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER DOC TECHNIQUE
  @Field({ nullable: true })
  @IsOptional()
  docTechniqueUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  docTechniqueFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  docTechniqueMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  docTechniqueSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER FORMATION CLIENT
  @Field({ nullable: true })
  @IsOptional()
  formationClientUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  formationClientFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  formationClientMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  formationClientSize?: number;

  // 👈 MÉTADONNÉES DU FICHIER DEMO FILE
  @Field({ nullable: true })
  @IsOptional()
  demoFileUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  demoFileFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  demoFileMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  demoFileSize?: number;

  // 👈 CHAMP DEMO URL
  @Field({ nullable: true })
  @IsOptional()
  demoUrl?: string;

  // 👈 MÉTADONNÉES DU FICHIER DOC RECETTE
  @Field({ nullable: true })
  @IsOptional()
  docRecetteUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  docRecetteFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  docRecetteMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  docRecetteSize?: number;

  // 👈 CHAMP STATUS RECETTE
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  statusRecette?: boolean;

  // 👈 CHAMP REFUS RECETTE
  @Field({ nullable: true })
  @IsOptional()
  refusRecette?: string;

  // 👈 CHAMP URL PRODUCTION
  @Field({ nullable: true })
  @IsOptional()
  urlProduction?: string;

  // 👈 MÉTADONNÉES DU FICHIER DOC EXPLOITATION
  @Field({ nullable: true })
  @IsOptional()
  docExploitationUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  docExploitationFileName?: string;

  @Field({ nullable: true })
  @IsOptional()
  docExploitationMimeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  docExploitationSize?: number;

  // 👈 CHAMP STATUS PROCEDURE
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  statusProcedure?: boolean;

  // 👈 CHAMP REFUS PROCEDURE
  @Field({ nullable: true })
  @IsOptional()
  refusProcedure?: string;

  // 👈 CHAMPS POUR LES DONNÉES DES EXIGENCES
  @Field({ nullable: true })
  @IsOptional()
  titreExigence?: string;

  @Field({ nullable: true })
  @IsOptional()
  descriptionExigence?: string;

  @Field({ nullable: true })
  @IsOptional()
  categorieExigence?: string;

  @Field({ nullable: true })
  @IsOptional()
  complexiteExigence?: string;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  coutExigence?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  delaiExigence?: number;

  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  statutExigence?: boolean;

  // 👈 FICHIERS DELIVERABLES MULTIPLES (gérés séparément)
  // Les fichiers deliverables sont maintenant gérés via des endpoints dédiés

  @Field()
  @IsDateString()
  startDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  lastUpdatedById?: string;

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  demandes?: string[];

  // 👈 NOUVEAUX CHAMPS SPOC : Informations du SPOC
  @Field({ nullable: true })
  @IsOptional()
  nomSpoc?: string;

  @Field({ nullable: true })
  @IsOptional()
  prenomSpoc?: string;

  @Field({ nullable: true })
  @IsOptional()
  posteSpoc?: string;

  @Field({ nullable: true })
  @IsOptional()
  telephoneSpoc?: string;

  @Field({ nullable: true })
  @IsOptional()
  emailSpoc?: string;

  // 👈 NOUVEAU CHAMP : Motif de refus du projet
  @Field({ nullable: true })
  @IsOptional()
  motifRefus?: string;

  // 👈 NOUVEAU CHAMP : Chef de projet
  @Field({ nullable: true })
  @IsOptional()
  chefProject?: string;

  // 👈 NOUVEAU CHAMP : Dates de réunion (peut contenir plusieurs dates complètes)
  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  datesReunion?: string[]; // Array de dates ISO string (date + heure)

  // 👈 NOUVEAU CHAMP : Offre acceptée (boolean, défaut: false)
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  offerAccepted?: boolean;

  // 👈 NOUVEAU CHAMP : Ajustements du contrat
  @Field({ nullable: true })
  @IsOptional()
  contratAdjustments?: string;

  // 👈 NOUVEAUX CHAMPS : Bugs majeurs et mineurs
  @Field({ nullable: true })
  @IsOptional()
  bugMajeur?: string;

  @Field({ nullable: true })
  @IsOptional()
  bugMineur?: string;

  // 👈 NOUVEAU CHAMP : Status Demo (boolean, défaut: false)
  @Field(() => Boolean, { defaultValue: false })
  @IsOptional()
  @IsBoolean()
  statusDemo?: boolean;
}
