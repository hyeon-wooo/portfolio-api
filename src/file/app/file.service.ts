import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { mkdirSync, existsSync, copyFileSync, renameSync } from 'fs';
import { EFileUsage } from '../domain/file.enum';
import { FileRepository } from '../infra/file.repository';
import { File } from '../domain/file.entity';

@Injectable()
export class FileService {
  constructor(private readonly repo: FileRepository) {}

  async findOne(
    condition: Partial<Record<keyof File, any>>,
    relations?: Partial<Record<keyof File, any>>,
  ) {
    return this.repo.findOne(condition, relations);
  }

  async findMany(
    condition: Partial<Record<keyof File, any>>,
    relations?: Partial<Record<keyof File, any>>,
  ) {
    return this.repo.findMany(condition, {
      relations,
    });
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
    return join(process.cwd(), 'files', relativePath);
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
    const saved = await this.repo.createOne({
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
    renameSync(join(process.cwd(), 'files', params.filename), destAbs);

    return saved;
  }

  activateToPublicImage(relativePath: string) {
    // files/<usage>/YYYY/MM/DD/uuid.ext -> public/image/uuid.ext
    const src = this.getAbsolutePath(relativePath);
    const filename = relativePath.split('/').pop() as string;

    const destDir = join(
      process.cwd(),
      'public',
      'image',
      relativePath.split('/').slice(0, -1).join('/'),
    );
    this.ensureDir(destDir);

    const dest = join(destDir, filename);
    copyFileSync(src, dest);
    return `/image/${filename}`;
  }

  async activateFile(fileId: number): Promise<{ url: string } | null> {
    const meta = await this.repo.findOne({ id: fileId });
    if (!meta) return null;
    const url = this.activateToPublicImage(meta.relativePath);
    await this.repo.updateById(fileId, { active: true });
    return { url };
  }
}
