import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
