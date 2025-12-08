import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategoriesService } from './categories/categories.service';

async function seedCategories() {
  console.log('🌱 Populando categorias...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const categoriesService = app.get(CategoriesService);
    
    const categories = [
      { nome: 'Teoria Narrativa', slug: 'teoria-narrativa' },
      { nome: 'Worldbuilding', slug: 'worldbuilding' },
      { nome: 'Técnica', slug: 'tecnica' },
      { nome: 'Estrutura', slug: 'estrutura' },
      { nome: 'Personagens', slug: 'personagens' },
    ];

    for (const category of categories) {
      try {
        const created = await categoriesService.create(category);
        console.log(`✅ Categoria criada: ${created.nome} (${created.slug})`);
      } catch (error) {
        if (error.message.includes('já existe')) {
          console.log(`⚠️  Categoria já existe: ${category.nome}`);
        } else {
          throw error;
        }
      }
    }

    console.log('✨ Seed de categorias concluído!');
  } catch (error) {
    console.error('❌ Erro ao popular categorias:', error.message);
  } finally {
    await app.close();
  }
}

seedCategories();
