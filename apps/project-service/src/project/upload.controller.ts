import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Req, Get, Param, Res, Delete, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { FileUploadService } from './file-upload.service';
import { DeliverableFileService } from './deliverable-file.service';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';


@Controller('api/projects')
export class UploadController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly fileUploadService: FileUploadService,
    private readonly deliverableFileService: DeliverableFileService,
  ) {}

  @Post(':id/upload-cahier-charge')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCahierCharge(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Upload du fichier
      const result = await this.projectService.uploadCahierCharge(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          cahierChargeUrl: result.cahierChargeUrl,
          cahierChargeFileName: result.cahierChargeFileName,
          cahierChargeMimeType: result.cahierChargeMimeType,
          cahierChargeSize: result.cahierChargeSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/cahiers-charges/:projectId/:filename')
  async getCahierCharge(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'cahiers-charges', `project-${projectId}`, filename);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      // Définir les headers
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Envoyer le fichier
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  @Get('uploads/offres-projets/:projectId/:filename')
  async getOffreProject(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'offres-projets', `project-${projectId}`, filename);
      
      // Vérifier que le fichier existe
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      // Définir les headers pour l'affichage inline (visualisation)
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Envoyer le fichier
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  @Post(':id/upload-offre-project')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOffreProject(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      // Upload du fichier
      const result = await this.projectService.uploadOffreProject(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          offreProjectUrl: result.offreProjectUrl,
          offreProjectFileName: result.offreProjectFileName,
          offreProjectMimeType: result.offreProjectMimeType,
          offreProjectSize: result.offreProjectSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Récupération du fichier contrat
  @Get('uploads/contrats/:projectId/:filename')
  async getContrat(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'contrats', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAU ENDPOINT : Upload du fichier contrat
  @Post(':id/upload-contrat')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContrat(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadContrat(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          contratUrl: result.contratUrl,
          contratFileName: result.contratFileName,
          contratMimeType: result.contratMimeType,
          contratSize: result.contratSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Récupération du fichier contrat signé
  @Get('uploads/contrats-signes/:projectId/:filename')
  async getContratSigne(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'contrats-signes', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAU ENDPOINT : Upload du fichier contrat signé
  @Post(':id/upload-contrat-signe')
  @UseInterceptors(FileInterceptor('file'))
  async uploadContratSigne(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadContratSigne(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          contratSigneUrl: result.contratSigneUrl,
          contratSigneFileName: result.contratSigneFileName,
          contratSigneMimeType: result.contratSigneMimeType,
          contratSigneSize: result.contratSigneSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Récupération du fichier purchase
  @Get('uploads/purchases/:projectId/:filename')
  async getPurchase(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'purchases', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAU ENDPOINT : Upload du fichier purchase
  @Post(':id/upload-purchase')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPurchase(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadPurchase(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          purchaseUrl: result.purchaseUrl,
          purchaseFileName: result.purchaseFileName,
          purchaseMimeType: result.purchaseMimeType,
          purchaseSize: result.purchaseSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Récupération du fichier meeting report
  @Get('uploads/meeting-reports/:projectId/:filename')
  async getMeetingReport(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'meeting-reports', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
        case '.xlsx':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case '.pptx':
          mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAU ENDPOINT : Upload du fichier meeting report
  @Post(':id/upload-meeting-report')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMeetingReport(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Vérifier le type de fichier
      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      // Vérifier la taille du fichier
      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadMeetingReport(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          meetingReportUrl: result.meetingReportUrl,
          meetingReportFileName: result.meetingReportFileName,
          meetingReportMimeType: result.meetingReportMimeType,
          meetingReportSize: result.meetingReportSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Suppression du fichier meeting report
  @Delete(':id/delete-meeting-report')
  async deleteMeetingReport(
    @Param('id') projectId: string,
  ) {
    try {
      const result = await this.projectService.deleteMeetingReport(projectId);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          meetingReportUrl: result.meetingReportUrl,
          meetingReportFileName: result.meetingReportFileName,
          meetingReportMimeType: result.meetingReportMimeType,
          meetingReportSize: result.meetingReportSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS DELIVERABLES MULTIPLES

  // Récupérer tous les fichiers deliverables d'un projet
  @Get(':id/deliverables')
  async getDeliverableFiles(@Param('id') projectId: string) {
    try {
      const files = await this.deliverableFileService.findByProjectId(projectId);
      return {
        success: true,
        data: files,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload d'un seul fichier deliverable par l'utilisateur
  @Post(':id/upload-deliverables')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDeliverable(
    @Param('id') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      const userId = req.user?.id || 'unknown-user';
      const result = await this.deliverableFileService.create(projectId, file, 'user', userId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload d'un fichier deliverable par l'admin
  @Post(':id/admin/upload-deliverables')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDeliverableAsAdmin(
    @Param('id') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      const adminId = req.user?.id || 'unknown-admin';
      const result = await this.deliverableFileService.create(projectId, file, 'admin', adminId);

      return {
        success: true,
        data: result,
        message: 'Fichier uploadé par l\'admin avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Upload de plusieurs fichiers deliverables par l'utilisateur
  @Post(':id/upload-deliverables-multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Maximum 10 fichiers
  async uploadMultipleDeliverables(
    @Param('id') projectId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any,
  ) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Aucun fichier fourni');
      }

      const userId = req.user?.id || 'unknown-user';
      const results: any[] = [];
      for (const file of files) {
        const result = await this.deliverableFileService.create(projectId, file, 'user', userId);
        results.push(result);
      }

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Récupération de tous les fichiers deliverables d'un projet
  @Get(':id/deliverables')
  async getAllDeliverableFiles(@Param('id') projectId: string) {
    try {
      const files = await this.deliverableFileService.findByProjectId(projectId);
      
      return {
        success: true,
        data: files,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Récupération d'un fichier deliverable spécifique
  @Get('uploads/deliverables/:projectId/:filename')
  async getDeliverableFile(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'deliverables', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      // Déterminer le type MIME basé sur l'extension
      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
        case '.xlsx':
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case '.pptx':
          mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
          break;
        case '.zip':
          mimeType = 'application/zip';
          break;
        case '.rar':
          mimeType = 'application/x-rar-compressed';
          break;
        case '.7z':
          mimeType = 'application/x-7z-compressed';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // Suppression d'un fichier deliverable spécifique
  @Delete('deliverables/:fileId')
  async deleteDeliverableFile(@Param('fileId') fileId: string) {
    try {
      const deleted = await this.deliverableFileService.remove(fileId);
      
      return {
        success: deleted,
        message: deleted ? 'Fichier supprimé avec succès' : 'Fichier non trouvé',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Suppression de tous les fichiers deliverables d'un projet
  @Delete(':id/deliverables')
  async deleteAllDeliverableFiles(@Param('id') projectId: string) {
    try {
      const deletedCount = await this.deliverableFileService.removeByProjectId(projectId);
      
      return {
        success: true,
        message: `${deletedCount} fichier(s) supprimé(s)`,
        deletedCount,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAU ENDPOINT : Initialiser les champs deliverables pour les projets existants
  @Post('initialize-deliverables-fields')
  async initializeDeliverablesFields() {
    try {
      await this.projectService.initializeDeliverablesFields();

      return {
        success: true,
        message: 'Deliverables fields initialized for all existing projects',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LA GESTION DU STATUT D'APPROBATION

  // Approuver un fichier deliverable
  @Post('deliverables/:fileId/approve')
  async approveDeliverableFile(@Param('fileId') fileId: string) {
    try {
      const updatedFile = await this.deliverableFileService.updateApprovalStatusWithComment(fileId, true);
      
      return {
        success: true,
        data: updatedFile,
        message: 'Fichier approuvé avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Rejeter un fichier deliverable avec commentaire de refus
  @Post('deliverables/:fileId/reject')
  async rejectDeliverableFile(
    @Param('fileId') fileId: string,
    @Body() body: { refusComment?: string },
  ) {
    try {
      const updatedFile = await this.deliverableFileService.updateApprovalStatusWithComment(
        fileId,
        false,
        body.refusComment,
      );
      
      return {
        success: true,
        data: updatedFile,
        message: 'Fichier rejeté avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Réinitialiser le statut d'approbation (remettre en attente)
  @Post('deliverables/:fileId/reset-approval')
  async resetDeliverableFileApproval(@Param('fileId') fileId: string) {
    try {
      const session = this.deliverableFileService['getSession']();
      try {
        const result = await session.run(
          `
          MATCH (df:DeliverableFile {id: $id})
          SET df.approved = NULL, df.refusComment = NULL
          RETURN df
          `,
          { id: fileId }
        );

        if (result.records.length === 0) {
          throw new Error('Fichier non trouvé');
        }

        const deliverableFile = result.records[0].get('df').properties;
        const updatedFile = {
          id: deliverableFile.id,
          fileName: deliverableFile.fileName,
          originalName: deliverableFile.originalName,
          mimeType: deliverableFile.mimeType,
          size: deliverableFile.size,
          url: deliverableFile.url,
          uploadedAt: deliverableFile.uploadedAt,
          projectId: deliverableFile.projectId,
          approved: deliverableFile.approved,
          uploadedBy: deliverableFile.uploadedBy,
          uploadedById: deliverableFile.uploadedById,
          refusComment: deliverableFile.refusComment,
        };
        
        return {
          success: true,
          data: updatedFile,
          message: 'Statut d\'approbation réinitialisé avec succès',
        };
      } finally {
        await session.close();
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Récupérer tous les fichiers deliverables avec leur statut d'approbation pour l'admin
  @Get('admin/deliverables')
  async getAllDeliverableFilesForAdmin() {
    try {
      const session = this.deliverableFileService['getSession']();
      try {
        const result = await session.run(
          `
          MATCH (df:DeliverableFile)
          OPTIONAL MATCH (df)-[:BELONGS_TO]->(p:Project)
          RETURN df, p.name as projectName, p.id as projectId
          ORDER BY df.uploadedAt DESC
          `
        );

        const files = result.records.map((record) => {
          const deliverableFile = record.get('df').properties;
          return {
            id: deliverableFile.id,
            fileName: deliverableFile.fileName,
            originalName: deliverableFile.originalName,
            mimeType: deliverableFile.mimeType,
            size: deliverableFile.size,
            url: deliverableFile.url,
            uploadedAt: deliverableFile.uploadedAt,
            projectId: deliverableFile.projectId,
            approved: deliverableFile.approved,
            uploadedBy: deliverableFile.uploadedBy,
            uploadedById: deliverableFile.uploadedById,
            refusComment: deliverableFile.refusComment,
            projectName: record.get('projectName'),
          };
        });

        return {
          success: true,
          data: files,
        };
      } finally {
        await session.close();
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS RAPPORT TEST
  @Post(':id/upload-rapport-test')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRapportTest(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadRapportTest(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          rapportTestUrl: result.rapportTestUrl,
          rapportTestFileName: result.rapportTestFileName,
          rapportTestMimeType: result.rapportTestMimeType,
          rapportTestSize: result.rapportTestSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/rapports-test/:projectId/:filename')
  async getRapportTest(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'rapports-test', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS GUIDE UTILISATEUR
  @Post(':id/upload-guide-utilisateur')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGuideUtilisateur(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadGuideUtilisateur(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          guideUtilisateurUrl: result.guideUtilisateurUrl,
          guideUtilisateurFileName: result.guideUtilisateurFileName,
          guideUtilisateurMimeType: result.guideUtilisateurMimeType,
          guideUtilisateurSize: result.guideUtilisateurSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/guides-utilisateur/:projectId/:filename')
  async getGuideUtilisateur(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'guides-utilisateur', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS DOC TECHNIQUE
  @Post(':id/upload-doc-technique')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocTechnique(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadDocTechnique(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          docTechniqueUrl: result.docTechniqueUrl,
          docTechniqueFileName: result.docTechniqueFileName,
          docTechniqueMimeType: result.docTechniqueMimeType,
          docTechniqueSize: result.docTechniqueSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/docs-techniques/:projectId/:filename')
  async getDocTechnique(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'docs-techniques', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS FORMATION CLIENT
  @Post(':id/upload-formation-client')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFormationClient(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadFormationClient(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          formationClientUrl: result.formationClientUrl,
          formationClientFileName: result.formationClientFileName,
          formationClientMimeType: result.formationClientMimeType,
          formationClientSize: result.formationClientSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/formations-client/:projectId/:filename')
  async getFormationClient(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'formations-client', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS DEMO FILE
  @Post(':id/upload-demo-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDemoFile(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadDemoFile(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          demoFileUrl: result.demoFileUrl,
          demoFileFileName: result.demoFileFileName,
          demoFileMimeType: result.demoFileMimeType,
          demoFileSize: result.demoFileSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/demo-files/:projectId/:filename')
  async getDemoFile(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'demo-files', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS DOC RECETTE
  @Post(':id/upload-doc-recette')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocRecette(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadDocRecette(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          docRecetteUrl: result.docRecetteUrl,
          docRecetteFileName: result.docRecetteFileName,
          docRecetteMimeType: result.docRecetteMimeType,
          docRecetteSize: result.docRecetteSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/docs-recette/:projectId/:filename')
  async getDocRecette(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'docs-recette', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

  // 👈 NOUVEAUX ENDPOINTS POUR LES FICHIERS DOC EXPLOITATION
  @Post(':id/upload-doc-exploitation')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocExploitation(
    @Body('projectId') projectId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    try {
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      if (!this.fileUploadService.isAllowedFileType(file.mimetype)) {
        throw new Error('Type de fichier non autorisé');
      }

      if (!this.fileUploadService.isAllowedFileSize(file.size)) {
        throw new Error('Fichier trop volumineux (max 10MB)');
      }

      const result = await this.projectService.uploadDocExploitation(projectId, file);

      return {
        success: true,
        data: {
          id: result.id,
          name: result.name,
          docExploitationUrl: result.docExploitationUrl,
          docExploitationFileName: result.docExploitationFileName,
          docExploitationMimeType: result.docExploitationMimeType,
          docExploitationSize: result.docExploitationSize,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @Get('uploads/docs-exploitation/:projectId/:filename')
  async getDocExploitation(
    @Param('projectId') projectId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'docs-exploitation', `project-${projectId}`, filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'Fichier non trouvé' });
      }

      const ext = path.extname(filename).toLowerCase();
      let mimeType = 'application/octet-stream';
      
      switch (ext) {
        case '.pdf':
          mimeType = 'application/pdf';
          break;
        case '.doc':
          mimeType = 'application/msword';
          break;
        case '.docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          break;
        case '.txt':
          mimeType = 'text/plain';
          break;
      }

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      return res.sendFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
    }
  }

}
