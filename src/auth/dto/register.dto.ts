import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Kwaku Mensah' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'kwaku@asera.gh' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.MANAGER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
