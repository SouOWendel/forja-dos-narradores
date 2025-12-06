import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function checkAndUpdateAdmin() {
  console.log('🔍 Verificando e atualizando usuário admin...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    
    // Verifica se a coluna title existe
    const columnExists = await dataSource.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' AND column_name='title';
    `);
    
    console.log('📊 Coluna title existe:', columnExists.length > 0);
    
    // Busca usuário admin
    const users = await dataSource.query(`
      SELECT id, email, name, title, "isAdmin" 
      FROM users 
      WHERE "isAdmin" = true 
      LIMIT 5;
    `);
    
    console.log('👥 Usuários admin encontrados:', users.length);
    users.forEach((user: any) => {
      console.log(`  - ${user.name} (${user.email}) - Título: ${user.title || 'NULL'}`);
    });
    
    // Atualiza todos os admins sem título
    if (columnExists.length > 0) {
      const result = await dataSource.query(`
        UPDATE users 
        SET title = 'Desenvolvedor & Community Expert' 
        WHERE "isAdmin" = true AND (title IS NULL OR title = '');
      `);
      
      console.log('✅ Usuários atualizados:', result[1] || 0);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await app.close();
  }
}

checkAndUpdateAdmin();
