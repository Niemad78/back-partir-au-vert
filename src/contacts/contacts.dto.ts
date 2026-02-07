import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class ContactCreation {
  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  facebook?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  instagram?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  tiktok?: string;
}

export type ContactOutput = {
  id: string;
  telephone: string;
  email: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  tiktok: string | null;
};
