import { IsNotEmpty, IsNumberString, IsString, IsUUID } from 'class-validator';

export class Customer {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  id: string;

  @IsNumberString()
  @IsNotEmpty()
  document: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
