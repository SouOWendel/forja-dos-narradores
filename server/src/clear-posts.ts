import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function clearPosts() {
  console.log('🗑️  Limpando todas as postagens...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    
    // Deleta todas as postagens
    await dataSource.query('DELETE FROM posts;');
    
    console.log('✅ Todas as postagens foram removidas!');
    console.log('💡 Execute "npm run seed" para popular com novos dados.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await app.close();
  }
}

clearPosts();
