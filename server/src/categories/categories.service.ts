import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verifica se slug ou nome já existe
    const existing = await this.categoryRepository.findOne({
      where: [
        { slug: createCategoryDto.slug },
        { nome: createCategoryDto.nome },
      ],
    });

    if (existing) {
      throw new ConflictException('Categoria com este nome ou slug já existe');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Categoria com slug "${slug}" não encontrada`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Verifica conflito de slug/nome se estiver atualizando
    if (updateCategoryDto.slug || updateCategoryDto.nome) {
      const existing = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.id != :id', { id })
        .andWhere('(category.slug = :slug OR category.nome = :nome)', {
          slug: updateCategoryDto.slug || category.slug,
          nome: updateCategoryDto.nome || category.nome,
        })
        .getOne();

      if (existing) {
        throw new ConflictException('Categoria com este nome ou slug já existe');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
