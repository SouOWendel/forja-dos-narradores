import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function updateAdminTitle() {
  console.log('🔄 Atualizando título do usuário admin...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Busca o admin pelo email
    const admin = await usersService.findByEmail('wendel@forja.com');
    
    if (!admin) {
      console.error('❌ Usuário não encontrado');
      return;
    }

    // Atualiza o título
    await usersService.update(admin.id, {
      title: 'Desenvolvedor & Community Expert',
    });

    console.log('✅ Título atualizado com sucesso!');
    console.log('👤 Usuário:', admin.name);
    console.log('💼 Novo título: Desenvolvedor & Community Expert');
  } catch (error) {
    console.error('❌ Erro ao atualizar:', error.message);
  } finally {
    await app.close();
  }
}

updateAdminTitle();
