import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PostsService } from './posts/posts.service';
import { UsersService } from './users/users.service';
import seedData from './posts/seed-data.json';

async function seed() {
  console.log('🌱 Starting database seed...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const postsService = app.get(PostsService);
  const usersService = app.get(UsersService);

  try {
    // Busca o primeiro usuário admin para usar como autor
    const users = await usersService.findAll();
    const adminUser = users.find(user => user.isAdmin);
    
    if (!adminUser) {
      console.error('❌ Nenhum usuário admin encontrado. Execute "npm run create:admin" primeiro.');
      return;
    }
    
    console.log(`📝 Usando autor: ${adminUser.name} (${adminUser.email})`);
    
    // Clear existing posts (optional - comment out if you want to keep existing data)
    // await postsService.removeAll();
    
    const posts = Array.isArray(seedData) ? seedData : [seedData];
    
    for (const postData of posts) {
      const post = await postsService.create({
        ...postData,
        authorId: adminUser.id, // Adiciona o ID do usuário admin
      } as any);
      console.log(`✅ Created post: ${post.title}`);
    }

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await app.close();
  }
}

seed();
