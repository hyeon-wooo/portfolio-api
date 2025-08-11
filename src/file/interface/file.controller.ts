import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { sendSuccessRes } from 'src/shared/response';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/role.decorator';
import { ERole } from 'src/auth/role.enum';
import { FileService } from '../app/file.service';
import { Body, Param } from '@nestjs/common';
import { UploadFileBodyDto } from './file.dto';
import { EFileUsage } from '../domain/file.enum';
import { existsSync, mkdirSync } from 'fs';
import { sendFailRes } from 'src/shared/response';

@Controller('file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Get('/')
  async getFiles() {
    const files = await this.service.findMany({
      active: true,
    });
    return sendSuccessRes({ list: files });
  }

  @Post('/upload')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADM)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = join(process.cwd(), 'files');
          if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req, file, callback) => {
          const fileExt = extname(file.originalname)
            .replace('.', '')
            .toLowerCase();
          const uuidName = require('crypto').randomUUID();
          callback(null, `${uuidName}.${fileExt}`);
        },
      }),
      // limits: { fileSize: 5 * 1024 * 1024 },
      // fileFilter: (_req, file, cb) => {
      //   // if (/^image\/(jpe?g|png|gif|webp)$/i.test(file.mimetype))
      //   // cb(null, true);
      //   // else cb(null, false);
      // },
    }),
  )
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // new FileTypeValidator({ fileType: /^image\/(jpe?g|png|gif|webp)$/i }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadFileBodyDto,
  ) {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fileExt = extname(file.originalname).replace('.', '').toLowerCase();
    const usage = body.usage || EFileUsage.ETC;
    const relativePath = `${usage}/${yyyy}/${mm}/${dd}/${file.filename}`;

    const saved = await this.service.saveUploadedFile({
      usage,
      originalName: file.originalname,
      filename: file.filename,
      extension: fileExt,
      size: file.size,
      mimetype: file.mimetype,
      relativePath,
    });

    if (body?.active === true) {
      console.log('!', body.active);
      const result = await this.service.activateFile(saved.id);
      if (!result) return sendFailRes('존재하지 않는 파일입니다.');
      return sendSuccessRes({
        id: saved.id,
        relativePath: saved.relativePath,
        active: true,
        url: result.url,
      });
    }

    return sendSuccessRes({
      id: saved.id,
      relativePath: saved.relativePath,
      active: saved.active,
    });
  }

  @Post('/:id/activate')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADM)
  async activate(@Param('id') idStr: string) {
    const id = Number(idStr);
    if (!Number.isInteger(id)) return sendFailRes('잘못된 파일 ID');
    const result = await this.service.activateFile(id);
    if (!result) return sendFailRes('존재하지 않는 파일입니다.');
    return sendSuccessRes(result);
  }
}
