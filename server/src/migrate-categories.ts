import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function migratePostCategories() {
  console.log('🔄 Migrando categorias dos posts para o novo sistema...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    
    // 1. Buscar todos os posts
    const posts = await dataSource.query(`
      SELECT id, title
      FROM posts;
    `);
    
    console.log(`📋 ${posts.length} posts encontrados no total`);
    
    // 2. Buscar todas as categorias do novo sistema
    const categories = await dataSource.query(`
      SELECT id, nome, slug 
      FROM categories;
    `);
    
    console.log(`📂 ${categories.length} categorias disponíveis no novo sistema`);
    
    // Mapeamento de nome antigo para ID novo
    const categoryMap = new Map<string, number>();
    categories.forEach((cat: any) => {
      categoryMap.set(cat.nome, cat.id);
    });
    
    // 3. Atribuir categorias padrão aos posts sem categoria
    // Vamos usar a seed-data.json como referência
    const defaultAssignments = [
      { title: 'A Arte da Narrativa Interativa', categories: ['Teoria Narrativa', 'Técnica'] },
      { title: 'Construindo Mundos Coerentes', categories: ['Worldbuilding', 'Estrutura'] },
      { title: 'Personagens Memoráveis', categories: ['Personagens', 'Técnica'] },
      { title: 'Estrutura de Três Atos', categories: ['Estrutura', 'Teoria Narrativa'] },
      { title: 'Diálogos Naturais', categories: ['Técnica', 'Personagens'] },
      { title: 'Worldbuilding Profundo', categories: ['Worldbuilding', 'Estrutura'] },
    ];
    
    let migratedCount = 0;
    
    for (const post of posts) {
      try {
        // Verifica se o post já tem categorias
        const existingCategories = await dataSource.query(`
          SELECT COUNT(*) as count 
          FROM post_categories 
          WHERE "postId" = $1;
        `, [post.id]);
        
        if (parseInt(existingCategories[0].count) > 0) {
          console.log(`\n📝 Post: "${post.title}" - já tem categorias`);
          continue;
        }
        
        // Busca assignment baseado no título
        const assignment = defaultAssignments.find(a => post.title.includes(a.title) || a.title.includes(post.title));
        
        if (assignment) {
          console.log(`\n📝 Post: "${post.title}"`);
          console.log(`   Atribuindo categorias: ${assignment.categories.join(', ')}`);
          
          for (const catName of assignment.categories) {
            const categoryId = categoryMap.get(catName);
            
            if (categoryId) {
              await dataSource.query(`
                INSERT INTO post_categories ("postId", "categoryId") 
                VALUES ($1, $2);
              `, [post.id, categoryId]);
              
              console.log(`   ✅ Relacionamento criado: ${catName} (ID: ${categoryId})`);
            }
          }
          
          migratedCount++;
        } else {
          // Se não encontrou match, atribui categoria padrão "Teoria Narrativa"
          const defaultCategoryId = categoryMap.get('Teoria Narrativa');
          if (defaultCategoryId) {
            console.log(`\n📝 Post: "${post.title}"`);
            console.log(`   Atribuindo categoria padrão: Teoria Narrativa`);
            
            await dataSource.query(`
              INSERT INTO post_categories ("postId", "categoryId") 
              VALUES ($1, $2);
            `, [post.id, defaultCategoryId]);
            
            migratedCount++;
          }
        }
        
      } catch (error) {
        console.error(`   ❌ Erro ao migrar post ${post.id}:`, error.message);
      }
    }
    
    console.log(`\n✨ Migração concluída! ${migratedCount} posts processados`);
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
  } finally {
    await app.close();
  }
}

migratePostCategories();
