import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file manually
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && !key.startsWith('#')) {
      const value = values.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  
  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 API endpoints available at http://localhost:${port}/api`);
}

bootstrap();
