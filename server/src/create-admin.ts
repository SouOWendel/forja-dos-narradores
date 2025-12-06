import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function createAdmin() {
  console.log('🔐 Criando usuário administrador...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const admin = await usersService.create({
      email: 'wendel@forja.com',
      name: 'Wendel Henrique',
      title: 'Desenvolvedor & Community Expert',
      password: 'admin123',  // Será hasheada automaticamente
      isAdmin: true,
      profilePhoto: 'https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff',
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Senha: admin123');
    console.log('👤 Nome:', admin.name);
    console.log('💼 Título:', admin.title);
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error.message);
  } finally {
    await app.close();
  }
}

createAdmin();
