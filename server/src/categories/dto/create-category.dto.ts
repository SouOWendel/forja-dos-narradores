import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  @IsString()
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  nome: string;

  @IsNotEmpty({ message: 'O slug é obrigatório' })
  @IsString()
  @MaxLength(50, { message: 'O slug deve ter no máximo 50 caracteres' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;
}
