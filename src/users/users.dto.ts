import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;
}

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class PasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class InfoDto {
  @IsNotEmpty()
  nom: string;

  @IsNotEmpty()
  prenom: string;
}
