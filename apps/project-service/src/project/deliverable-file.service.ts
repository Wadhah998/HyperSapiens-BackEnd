import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Driver, Session } from 'neo4j-driver';
import { DeliverableFile } from './entities/deliverable-file.entity';
import { CreateDeliverableFileInput } from './dto/create-deliverable-file.input';
import { UpdateDeliverableFileInput } from './dto/update-deliverable-file.input';
import { FileUploadService } from './file-upload.service';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeliverableFileService {
  constructor(
    @Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver,
    private readonly fileUploadService: FileUploadService,
  ) {}

  private getSession(): Session {
    return this.neo4jDriver.session();
  }

  // 👈 CRÉER UN FICHIER DELIVERABLE
  async create(
    projectId: string,
    file: Express.Multer.File,
    uploadedBy: 'user' | 'admin' = 'user',
    uploadedById?: string,
  ): Promise<DeliverableFile> {
    const session = this.getSession();
    try {
      // Vérifier que le projet existe
      const projectExists = await session.run(
        'MATCH (p:Project {id: $projectId}) RETURN p',
        { projectId }
      );
      
      if (projectExists.records.length === 0) {
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

      // Sauvegarder le fichier
      const fileResult = await this.fileUploadService.saveDeliverablesFile(projectId, file);

      // Créer l'entité DeliverableFile dans Neo4j avec relation vers le projet
      const deliverableFileId = uuidv4();
      const uploadedAt = new Date().toISOString();

      const result = await session.run(
        `
        MATCH (p:Project {id: $projectId})
        CREATE (df:DeliverableFile {
          id: $id,
          fileName: $fileName,
          originalName: $originalName,
          mimeType: $mimeType,
          size: $size,
          url: $url,
          uploadedAt: datetime($uploadedAt),
          projectId: $projectId,
          approved: NULL,
          uploadedBy: $uploadedBy,
          uploadedById: $uploadedById
        })
        CREATE (df)-[:BELONGS_TO]->(p)
        RETURN df
        `,
        {
          id: deliverableFileId,
          fileName: fileResult.fileName,
          originalName: file.originalname,
          mimeType: fileResult.mimeType,
          size: fileResult.size,
          url: fileResult.url,
          uploadedAt,
          projectId,
          uploadedBy,
          uploadedById,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to create deliverable file');
      }

      return result.records[0].get('df').properties as DeliverableFile;
    } finally {
      await session.close();
    }
  }

  // 👈 RÉCUPÉRER TOUS LES FICHIERS DELIVERABLES D'UN PROJET
  async findByProjectId(projectId: string): Promise<DeliverableFile[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (df:DeliverableFile {projectId: $projectId})
        RETURN df
        ORDER BY df.uploadedAt DESC
        `,
        { projectId }
      );

      return result.records.map((record) => {
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
        } as DeliverableFile;
      });
    } finally {
      await session.close();
    }
  }

  // 👈 RÉCUPÉRER UN FICHIER DELIVERABLE PAR ID
  async findOne(id: string): Promise<DeliverableFile> {
    const session = this.getSession();
    try {
      const result = await session.run(
        'MATCH (df:DeliverableFile {id: $id}) RETURN df',
        { id }
      );

      if (result.records.length === 0) {
        throw new NotFoundException(`DeliverableFile ${id} not found`);
      }

      const deliverableFile = result.records[0].get('df').properties;
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
      } as DeliverableFile;
    } finally {
      await session.close();
    }
  }

  // 👈 METTRE À JOUR LE STATUT D'APPROBATION D'UN FICHIER DELIVERABLE
  async updateApprovalStatus(id: string, approved: boolean): Promise<DeliverableFile> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (df:DeliverableFile {id: $id})
        SET df.approved = $approved
        RETURN df
        `,
        { id, approved }
      );

      if (result.records.length === 0) {
        throw new NotFoundException(`DeliverableFile ${id} not found`);
      }

      const deliverableFile = result.records[0].get('df').properties;
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
      } as DeliverableFile;
    } finally {
      await session.close();
    }
  }

  // 👈 METTRE À JOUR LE STATUT D'APPROBATION ET LE COMMENTAIRE DE REFUS D'UN FICHIER DELIVERABLE
  async updateApprovalStatusWithComment(
    id: string,
    approved: boolean,
    refusComment?: string,
  ): Promise<DeliverableFile> {
    const session = this.getSession();
    try {
      // Si le fichier est rejeté, on met à jour le commentaire de refus
      // Si le fichier est approuvé, on supprime le commentaire de refus
      const setClause = approved
        ? 'SET df.approved = $approved, df.refusComment = NULL'
        : 'SET df.approved = $approved, df.refusComment = $refusComment';

      const result = await session.run(
        `
        MATCH (df:DeliverableFile {id: $id})
        ${setClause}
        RETURN df
        `,
        { id, approved, refusComment: refusComment || null }
      );

      if (result.records.length === 0) {
        throw new NotFoundException(`DeliverableFile ${id} not found`);
      }

      const deliverableFile = result.records[0].get('df').properties;
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
      } as DeliverableFile;
    } finally {
      await session.close();
    }
  }
  async remove(id: string): Promise<boolean> {
    const session = this.getSession();
    try {
      // Récupérer les informations du fichier avant suppression
      const fileInfo = await this.findOne(id);
      
      // Supprimer le fichier physique
      const fileName = path.basename(fileInfo.url);
      await this.fileUploadService.deleteDeliverablesFile(fileInfo.projectId, fileName);

      // Supprimer l'entité de Neo4j
      const result = await session.run(
        'MATCH (df:DeliverableFile {id: $id}) DETACH DELETE df RETURN count(df) AS deleted',
        { id }
      );

      return result.records[0].get('deleted').toInt() > 0;
    } finally {
      await session.close();
    }
  }

  // 👈 SUPPRIMER TOUS LES FICHIERS DELIVERABLES D'UN PROJET
  async removeByProjectId(projectId: string): Promise<number> {
    const session = this.getSession();
    try {
      // Récupérer tous les fichiers du projet
      const files = await this.findByProjectId(projectId);
      
      // Supprimer les fichiers physiques
      for (const file of files) {
        const fileName = path.basename(file.url);
        await this.fileUploadService.deleteDeliverablesFile(projectId, fileName);
      }

      // Supprimer toutes les entités de Neo4j
      const result = await session.run(
        'MATCH (df:DeliverableFile {projectId: $projectId}) DETACH DELETE df RETURN count(df) AS deleted',
        { projectId }
      );

      return result.records[0].get('deleted').toInt();
    } finally {
      await session.close();
    }
  }
}
