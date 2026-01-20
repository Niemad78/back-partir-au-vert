import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export type UserCreation = {
  email: string;
  password: string;
  nom?: string;
  prenom?: string;
};

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
