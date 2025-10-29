import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Simple Post model used by the service.
 * Keep this in sync with the JSON placed in `src/assets/posts.json`.
 */
export interface Post {
  id: string;
  title: string;
  author: string;
  date: string;
  readTime?: string;
  category?: string;
  image?: string;
  content: string;
}

/**
 * PostService
 * - Usa HttpClient para buscar posts de um arquivo JSON em assets.
 * - `providedIn: 'root'` torna o serviço disponível globalmente sem precisar declará-lo em um módulo.
 * - Em um app real, substitua a URL por um endpoint de API.
 */
@Injectable({ providedIn: 'root' })
export class PostService {
  // Caminho para um JSON estático com os posts (criado em src/assets/posts.json)
  private readonly postsUrl = 'assets/posts.json';

  constructor(private http: HttpClient) {}

  /**
   * Retorna o array completo de posts.
   * Observable permite composição reativa (map/filter) e assincronismo.
   */
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  /**
   * Busca um post por id. Retorna Observable<Post | undefined>.
   * Implementado via getPosts() + map para manter o serviço simples.
   */
  getPost(id: string): Observable<Post | undefined> {
    return this.getPosts().pipe(map((posts) => posts.find((p) => p.id === id)));
  }
}

