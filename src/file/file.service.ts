import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdirSync, existsSync, copyFileSync, renameSync } from 'fs';
import { EFileUsage } from './file.enum';
import { CRUDService } from 'src/shared/crud.service';
import { FileEntity } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService extends CRUDService<FileEntity> {
  private imageUploadStoragePath: string;
  private imagePublicStoragePath: string;

  constructor(
    @InjectRepository(FileEntity)
    repo: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {
    super(repo);
    this.imageUploadStoragePath = this.configService.get<string>(
      'IMAGE_UPLOAD_STORAGE_PATH',
    )!;
    this.imagePublicStoragePath = this.configService.get<string>(
      'IMAGE_PUBLIC_STORAGE_PATH',
    )!;
  }

  getImagePublicUrl(filename: string): string {
    return `/image/${filename}`;
  }

  ensureDir(dirPath: string) {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
  }

  buildRelativePath(usage: EFileUsage, extension: string): string {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const filename = `${randomUUID()}.${extension}`;
    return `${usage}/${yyyy}/${mm}/${dd}/${filename}`;
  }

  getAbsolutePath(relativePath: string): string {
    return join(this.imageUploadStoragePath, relativePath);
  }

  async saveUploadedFile(params: {
    usage: EFileUsage;
    originalName: string;
    filename: string;
    extension: string;
    size: number;
    mimetype: string;
    relativePath: string;
  }) {
    const saved = await this.createOne({
      usage: params.usage,
      originalName: params.originalName,
      extension: params.extension,
      size: params.size,
      mimetype: params.mimetype,
      relativePath: params.relativePath,
      active: false,
    });

    // 물리 파일 이동: files/uuid.ext -> files/<usage>/YYYY/MM/DD/uuid.ext
    const destAbs = this.getAbsolutePath(params.relativePath);
    const destDir = destAbs.split('/').slice(0, -1).join('/');
    this.ensureDir(destDir);
    renameSync(join(this.imageUploadStoragePath, params.filename), destAbs);

    return saved;
  }

  activateToPublicImage(relativePath: string) {
    // files/<usage>/YYYY/MM/DD/uuid.ext -> public/image/uuid.ext
    const src = this.getAbsolutePath(relativePath);
    const filename = relativePath.split('/').pop() as string;

    const destDir = join(
      this.imagePublicStoragePath,
      'image',
      relativePath.split('/').slice(0, -1).join('/'),
    );
    this.ensureDir(destDir);

    const dest = join(destDir, filename);
    copyFileSync(src, dest);
    return `/image/${filename}`;
  }

  async activateFile(fileId: number): Promise<{ url: string } | null> {
    const meta = await this.findOne({ id: fileId });
    if (!meta) return null;
    const url = this.activateToPublicImage(meta.relativePath);
    await this.updateById(fileId, { active: true });
    return { url };
  }
}
