import { Controller, Get, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { HttpGoogleOAuthGuard } from './guards/http-google-oauth.guard';
import { GoogleLoginUserDto } from './dto/google-login.dtio';

@SetMetadata('google-login', true)
@UseGuards(HttpGoogleOAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  async googleAuth(@Req() _req: Request) {}

  @Get('google-redirect')
  googleAuthRedirect(@CurrentUser() user: GoogleLoginUserDto) {
    return this.authService.googleLogin(user);
  }
}
