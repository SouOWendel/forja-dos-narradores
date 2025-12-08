import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * User model - matches the User entity from backend
 */
export interface User {
  id: string;
  email: string;
  name: string;
  title?: string;
  profilePhoto?: string;
  isAdmin: boolean;
}

/**
 * Category model - matches the Category entity from backend
 */
export interface Category {
  id: number;
  nome: string;
  slug: string;
}

/**
 * Post model - matches the API response from NestJS backend
 */
export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  author?: User;      // Relationship to User entity
  authorId?: string;  // Foreign key for creating/updating
  image?: string;
  categories?: Category[];  // Array of category objects
  categoryIds?: number[];   // Array of category IDs for creating/updating
  tags?: string[];
  published: boolean;
  viewCount: number;
  createdAt: string;  // ISO date string from API
  updatedAt: string;  // ISO date string from API
}

/**
 * PostService
 * - Conecta com a API NestJS rodando em localhost:3000
 * - Usa HttpClient para fazer requisições HTTP
 * - `providedIn: 'root'` torna o serviço disponível globalmente
 */
@Injectable({ providedIn: 'root' })
export class PostService {
  // URL base da API NestJS
  private readonly apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  /**
   * Retorna todos os posts publicados da API
   * GET http://localhost:3000/api/posts?published=true
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?published=true`);
  }

  /**
   * Busca posts por categoria
   * GET http://localhost:3000/api/posts/category/:category
   * Exemplo: getPosts('Teoria Narrativa')
   */
  getPostsByCategory(category: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/category/${encodeURIComponent(category)}`);
  }

  /**
   * Busca um post específico por ID
   * GET http://localhost:3000/api/posts/:id
   * Agora usa o endpoint direto da API ao invés de filtrar localmente
   */
  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  /**
   * ADMIN: Retorna TODOS os posts (incluindo não publicados)
   * GET http://localhost:3000/api/posts
   */
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  /**
   * ADMIN: Cria um novo post
   * POST http://localhost:3000/api/posts
   */
  createPost(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  /**
   * ADMIN: Atualiza um post existente
   * PATCH http://localhost:3000/api/posts/:id
   */
  updatePost(id: string, post: Partial<Post>): Observable<Post> {
    return this.http.patch<Post>(`${this.apiUrl}/${id}`, post);
  }

  /**
   * ADMIN: Busca todos os usuários
   * GET http://localhost:3000/api/users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:3000/api/users');
  }

  /**
   * Busca todas as categorias
   * GET http://localhost:3000/api/categories
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:3000/api/categories');
  }

  /**
   * ADMIN: Deleta um post
   * DELETE http://localhost:3000/api/posts/:id
   */
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

