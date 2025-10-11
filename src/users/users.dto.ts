import { IsNotEmpty, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty({ message: 'Email requis' })
  email: string;

  @IsNotEmpty({ message: 'Mot de passe requis' })
  @MinLength(12, {
    message: 'Le mot de passe doit contenir au moins 12 caractères',
  })
  password: string;
}
