import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class Customer {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumberString()
  @IsNotEmpty()
  document: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
