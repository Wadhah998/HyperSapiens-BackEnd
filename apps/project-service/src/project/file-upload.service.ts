import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface FileUploadResult {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

@Injectable()
export class FileUploadService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads', 'cahiers-charges');

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  async saveProjectFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(this.uploadPath, `project-${projectId}`);
    await fs.mkdir(projectDir, { recursive: true });

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `cahier-charge-${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, uniqueFileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/cahiers-charges/project-${projectId}/${uniqueFileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async saveOffreProjectFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    // Créer un dossier spécifique pour les offres de projet
    const offreUploadPath = path.join(process.cwd(), 'uploads', 'offres-projets');
    const projectDir = path.join(offreUploadPath, `project-${projectId}`);
    await fs.mkdir(projectDir, { recursive: true });

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `offre-project-${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, uniqueFileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/offres-projets/project-${projectId}/${uniqueFileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteProjectFile(projectId: string, fileName: string): Promise<void> {
    const filePath = path.join(this.uploadPath, `project-${projectId}`, fileName);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Fichier non trouvé: ${filePath}`);
    }
  }

  async deleteOffreProjectFile(projectId: string, fileName: string): Promise<void> {
    const offreUploadPath = path.join(process.cwd(), 'uploads', 'offres-projets');
    const filePath = path.join(offreUploadPath, `project-${projectId}`, fileName);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Fichier d'offre non trouvé: ${filePath}`);
    }
  }

  async getProjectFiles(projectId: string): Promise<string[]> {
    const projectDir = path.join(this.uploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // Validation des types de fichiers autorisés
  isAllowedFileType(mimeType: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];
    return allowedTypes.includes(mimeType);
  }

  // Validation de la taille du fichier (max 10MB)
  isAllowedFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS CONTRAT
  async saveContratFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const contratUploadPath = path.join(process.cwd(), 'uploads', 'contrats');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(contratUploadPath);
    } catch {
      await fs.mkdir(contratUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(contratUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/contrats/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteContratFile(projectId: string, fileName: string): Promise<void> {
    const contratUploadPath = path.join(process.cwd(), 'uploads', 'contrats');
    const filePath = path.join(contratUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete contrat file: ${filePath}`, error);
    }
  }

  async getContratFiles(projectId: string): Promise<string[]> {
    const contratUploadPath = path.join(process.cwd(), 'uploads', 'contrats');
    const projectDir = path.join(contratUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS CONTRAT SIGNÉ
  async saveContratSigneFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const contratSigneUploadPath = path.join(process.cwd(), 'uploads', 'contrats-signes');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(contratSigneUploadPath);
    } catch {
      await fs.mkdir(contratSigneUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(contratSigneUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/contrats-signes/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteContratSigneFile(projectId: string, fileName: string): Promise<void> {
    const contratSigneUploadPath = path.join(process.cwd(), 'uploads', 'contrats-signes');
    const filePath = path.join(contratSigneUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete contrat signe file: ${filePath}`, error);
    }
  }

  async getContratSigneFiles(projectId: string): Promise<string[]> {
    const contratSigneUploadPath = path.join(process.cwd(), 'uploads', 'contrats-signes');
    const projectDir = path.join(contratSigneUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS PURCHASE
  async savePurchaseFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const purchaseUploadPath = path.join(process.cwd(), 'uploads', 'purchases');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(purchaseUploadPath);
    } catch {
      await fs.mkdir(purchaseUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(purchaseUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/purchases/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deletePurchaseFile(projectId: string, fileName: string): Promise<void> {
    const purchaseUploadPath = path.join(process.cwd(), 'uploads', 'purchases');
    const filePath = path.join(purchaseUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete purchase file: ${filePath}`, error);
    }
  }

  async getPurchaseFiles(projectId: string): Promise<string[]> {
    const purchaseUploadPath = path.join(process.cwd(), 'uploads', 'purchases');
    const projectDir = path.join(purchaseUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS MEETING REPORT
  async saveMeetingReportFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const meetingReportUploadPath = path.join(process.cwd(), 'uploads', 'meeting-reports');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(meetingReportUploadPath);
    } catch {
      await fs.mkdir(meetingReportUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(meetingReportUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/meeting-reports/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteMeetingReportFile(projectId: string, fileName: string): Promise<void> {
    const meetingReportUploadPath = path.join(process.cwd(), 'uploads', 'meeting-reports');
    const filePath = path.join(meetingReportUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete meeting report file: ${filePath}`, error);
    }
  }

  async getMeetingReportFiles(projectId: string): Promise<string[]> {
    const meetingReportUploadPath = path.join(process.cwd(), 'uploads', 'meeting-reports');
    const projectDir = path.join(meetingReportUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DELIVERABLES
  async saveDeliverablesFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const deliverablesUploadPath = path.join(process.cwd(), 'uploads', 'deliverables');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(deliverablesUploadPath);
    } catch {
      await fs.mkdir(deliverablesUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(deliverablesUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/deliverables/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteDeliverablesFile(projectId: string, fileName: string): Promise<void> {
    const deliverablesUploadPath = path.join(process.cwd(), 'uploads', 'deliverables');
    const filePath = path.join(deliverablesUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete deliverables file: ${filePath}`, error);
    }
  }

  async getDeliverablesFiles(projectId: string): Promise<string[]> {
    const deliverablesUploadPath = path.join(process.cwd(), 'uploads', 'deliverables');
    const projectDir = path.join(deliverablesUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS RAPPORT TEST
  async saveRapportTestFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const rapportTestUploadPath = path.join(process.cwd(), 'uploads', 'rapports-test');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(rapportTestUploadPath);
    } catch {
      await fs.mkdir(rapportTestUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(rapportTestUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/rapports-test/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteRapportTestFile(projectId: string, fileName: string): Promise<void> {
    const rapportTestUploadPath = path.join(process.cwd(), 'uploads', 'rapports-test');
    const filePath = path.join(rapportTestUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete rapport test file: ${filePath}`, error);
    }
  }

  async getRapportTestFiles(projectId: string): Promise<string[]> {
    const rapportTestUploadPath = path.join(process.cwd(), 'uploads', 'rapports-test');
    const projectDir = path.join(rapportTestUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS GUIDE UTILISATEUR
  async saveGuideUtilisateurFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const guideUtilisateurUploadPath = path.join(process.cwd(), 'uploads', 'guides-utilisateur');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(guideUtilisateurUploadPath);
    } catch {
      await fs.mkdir(guideUtilisateurUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(guideUtilisateurUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/guides-utilisateur/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteGuideUtilisateurFile(projectId: string, fileName: string): Promise<void> {
    const guideUtilisateurUploadPath = path.join(process.cwd(), 'uploads', 'guides-utilisateur');
    const filePath = path.join(guideUtilisateurUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete guide utilisateur file: ${filePath}`, error);
    }
  }

  async getGuideUtilisateurFiles(projectId: string): Promise<string[]> {
    const guideUtilisateurUploadPath = path.join(process.cwd(), 'uploads', 'guides-utilisateur');
    const projectDir = path.join(guideUtilisateurUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DOC TECHNIQUE
  async saveDocTechniqueFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const docTechniqueUploadPath = path.join(process.cwd(), 'uploads', 'docs-techniques');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(docTechniqueUploadPath);
    } catch {
      await fs.mkdir(docTechniqueUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(docTechniqueUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/docs-techniques/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteDocTechniqueFile(projectId: string, fileName: string): Promise<void> {
    const docTechniqueUploadPath = path.join(process.cwd(), 'uploads', 'docs-techniques');
    const filePath = path.join(docTechniqueUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete doc technique file: ${filePath}`, error);
    }
  }

  async getDocTechniqueFiles(projectId: string): Promise<string[]> {
    const docTechniqueUploadPath = path.join(process.cwd(), 'uploads', 'docs-techniques');
    const projectDir = path.join(docTechniqueUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS FORMATION CLIENT
  async saveFormationClientFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const formationClientUploadPath = path.join(process.cwd(), 'uploads', 'formations-client');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(formationClientUploadPath);
    } catch {
      await fs.mkdir(formationClientUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(formationClientUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/formations-client/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteFormationClientFile(projectId: string, fileName: string): Promise<void> {
    const formationClientUploadPath = path.join(process.cwd(), 'uploads', 'formations-client');
    const filePath = path.join(formationClientUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete formation client file: ${filePath}`, error);
    }
  }

  async getFormationClientFiles(projectId: string): Promise<string[]> {
    const formationClientUploadPath = path.join(process.cwd(), 'uploads', 'formations-client');
    const projectDir = path.join(formationClientUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DEMO FILE
  async saveDemoFileFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const demoFileUploadPath = path.join(process.cwd(), 'uploads', 'demo-files');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(demoFileUploadPath);
    } catch {
      await fs.mkdir(demoFileUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(demoFileUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/demo-files/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteDemoFileFile(projectId: string, fileName: string): Promise<void> {
    const demoFileUploadPath = path.join(process.cwd(), 'uploads', 'demo-files');
    const filePath = path.join(demoFileUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete demo file: ${filePath}`, error);
    }
  }

  async getDemoFileFiles(projectId: string): Promise<string[]> {
    const demoFileUploadPath = path.join(process.cwd(), 'uploads', 'demo-files');
    const projectDir = path.join(demoFileUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DOC RECETTE
  async saveDocRecetteFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const docRecetteUploadPath = path.join(process.cwd(), 'uploads', 'docs-recette');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(docRecetteUploadPath);
    } catch {
      await fs.mkdir(docRecetteUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(docRecetteUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/docs-recette/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteDocRecetteFile(projectId: string, fileName: string): Promise<void> {
    const docRecetteUploadPath = path.join(process.cwd(), 'uploads', 'docs-recette');
    const filePath = path.join(docRecetteUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete doc recette file: ${filePath}`, error);
    }
  }

  async getDocRecetteFiles(projectId: string): Promise<string[]> {
    const docRecetteUploadPath = path.join(process.cwd(), 'uploads', 'docs-recette');
    const projectDir = path.join(docRecetteUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }

  // 👈 NOUVELLES MÉTHODES POUR LES FICHIERS DOC EXPLOITATION
  async saveDocExploitationFile(
    projectId: string,
    file: Express.Multer.File,
  ): Promise<FileUploadResult> {
    const docExploitationUploadPath = path.join(process.cwd(), 'uploads', 'docs-exploitation');
    
    // Créer le dossier s'il n'existe pas
    try {
      await fs.access(docExploitationUploadPath);
    } catch {
      await fs.mkdir(docExploitationUploadPath, { recursive: true });
    }

    // Créer un dossier spécifique pour le projet
    const projectDir = path.join(docExploitationUploadPath, `project-${projectId}`);
    try {
      await fs.access(projectDir);
    } catch {
      await fs.mkdir(projectDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(projectDir, fileName);

    // Sauvegarder le fichier
    await fs.writeFile(filePath, file.buffer);

    return {
      url: `/uploads/docs-exploitation/project-${projectId}/${fileName}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  async deleteDocExploitationFile(projectId: string, fileName: string): Promise<void> {
    const docExploitationUploadPath = path.join(process.cwd(), 'uploads', 'docs-exploitation');
    const filePath = path.join(docExploitationUploadPath, `project-${projectId}`, fileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Le fichier n'existe peut-être pas, on ignore l'erreur
      console.warn(`Could not delete doc exploitation file: ${filePath}`, error);
    }
  }

  async getDocExploitationFiles(projectId: string): Promise<string[]> {
    const docExploitationUploadPath = path.join(process.cwd(), 'uploads', 'docs-exploitation');
    const projectDir = path.join(docExploitationUploadPath, `project-${projectId}`);
    try {
      const files = await fs.readdir(projectDir);
      return files;
    } catch {
      return [];
    }
  }
}
