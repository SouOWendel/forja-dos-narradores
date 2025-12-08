import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function checkAndUpdateAdmin() {
  console.log('🔍 Verificando e atualizando usuário admin...');
  
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    
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
    
      // Novo título e imagem para o admin
      const newTitle = 'Desenvolvedor Full Stack & Mestre de RPG';
      const newProfilePhoto = 'https://i.imgur.com/zpTaeNW.png';
      
      const result = await dataSource.query(`
        UPDATE users 
        SET 
          title = $1,
          "profilePhoto" = $2
        WHERE "isAdmin" = true;
      `, [newTitle, newProfilePhoto]);
      
      console.log('✅ Usuários atualizados:', result[1] || 0);
      console.log(`📝 Novo título: ${newTitle}`);
      console.log(`📷 Nova imagem: ${newProfilePhoto}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await app.close();
  }
}

checkAndUpdateAdmin();
