import { Controller, Get, Param, Query, UseGuards, Put, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }

  @Put('status')
  async updateStatus(@Body() data: { status: string }, @Request() req: any) {
    const userId = req.user.id || req.user.sub;
    return this.usersService.updateStatus(userId, data.status);

  }
  
}
