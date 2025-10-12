import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto, LoginAdminDto } from './admin.dto';
import {
  EmailAlreadyExistsException,
  LoginFailedException,
} from './admin.exception';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from 'src/auth/auth.type';
import { SuperAdminGuard } from 'src/auth/guard/superadmin.guard';
import { AdmIpGuard } from 'src/auth/guard/admin-ip.guard';
import { ONE_DAY, ONE_HOUR } from 'src/shared/constant';
import { AdminEntity } from './admin.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';

@Controller('admin')
@UseGuards(AdmIpGuard)
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() { user }: Request) {
    if (!user) return sendFailRes('로그인 후 이용해주세요.');
    const found = await this.service.findOne({ id: user.id });
    if (!found) return sendFailRes('존재하지 않는 계정입니다.');

    return sendSuccessRes({
      me: {
        id: found.id,
        level: found.level,
        email: found.email,
      },
    });
  }

  // 관리자 생성
  @Post('/')
  @UseGuards(SuperAdminGuard)
  async create(@Body() dto: CreateAdminDto) {
    try {
      const created = await this.service.createOne(dto);

      return sendSuccessRes({ id: created.id });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsException)
        return sendFailRes(error.message, error.code);

      throw error;
    }
  }

  // 로그인
  @Post('/login')
  async login(@Body() body: LoginAdminDto, @Res() res: Response): Promise<any> {
    try {
      const admin = await this.service.validateLogin(body);
      const token = this.authService.signWithAdmin(admin);
      const refreshToken = this.authService.signRefreshWithAdmin(admin);

      res.cookie(ACCESS_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ONE_HOUR * 6,
        sameSite: 'none',
      });
      res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: ONE_DAY * 7,
        sameSite: 'none',
      });

      return res.json(
        sendSuccessRes({
          accessToken: token,
          refreshToken,
          me: {
            id: admin.id,
            level: admin.level,
            email: admin.email,
          },
        }),
      );
    } catch (e) {
      if (e instanceof LoginFailedException)
        return res.json(sendFailRes(e.message, e.code));

      throw e;
    }
  }

  // 로그아웃
  @Post('/logout')
  async logout(@Res() res: Response) {
    res.clearCookie(ACCESS_COOKIE_NAME, { path: '/' });
    res.clearCookie(REFRESH_COOKIE_NAME, { path: '/' });
    return res.json(sendSuccessRes(true));
  }

  // 토큰 재발급
  @Post('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      // 리프레시 토큰 쿠키에서 추출
      const refreshToken = req.cookies['rt'];
      if (!refreshToken)
        return res.json(
          sendFailRes('비정상적인 접근입니다.', 'NO_REFRESH_TOKEN'),
        );
      // 검증
      const payload = this.authService.verifyRefresh(refreshToken);
      if (!payload) return res.json(sendFailRes('토큰이 만료되었습니다.'));

      // access/refresh 토큰 재발급
      const admin = await this.service.findOne({ id: payload.id });
      if (!admin)
        return res.json(sendFailRes('존재하지 않는 계정입니다.', 'NO_ACCOUNT'));
      const accessToken = this.authService.signWithAdmin(admin);
      const newRefreshToken = this.authService.signRefreshWithAdmin(admin);
      res.cookie(ACCESS_COOKIE_NAME, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      res.cookie('rt', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return res.json(sendSuccessRes({ accessToken }));
    } catch (e) {
      return res.json(sendFailRes('재발급 실패', 'REFRESH_FAIL'));
    }
  }

  // 관리자 수정
  @Put('/:id')
  @UseGuards(SuperAdminGuard)
  async update(@Param('id') id: number, @Body() dto: UpdateAdminDto) {
    await this.service.updateById(id, dto);
    return sendSuccessRes(true);
  }

  // 관리자 삭제
  @Delete('/:id')
  @UseGuards(SuperAdminGuard)
  async delete(@Param('id') id: number) {
    await this.service.deleteById(id);
    return sendSuccessRes(true);
  }
}
