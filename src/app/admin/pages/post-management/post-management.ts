import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../../../blog/services/post.services/post.services';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * PostManagementComponent
 * - Lista TODOS os posts (publicados e rascunhos)
 * - Permite navegar para criar/editar/deletar
 */
@Component({
  selector: 'app-post-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gerenciar Postagens</h2>
        <a 
          routerLink="/admin/posts/new" 
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nova Postagem
        </a>
      </div>

      <div *ngIf="loading$ | async" class="text-center py-8">
        Carregando postagens...
      </div>

      <div *ngIf="(error$ | async) as err" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ err }}
        <button (click)="reload()" class="ml-2 underline">Tentar novamente</button>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visualizações</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let post of posts$ | async" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img 
                    *ngIf="post.author?.profilePhoto; else avatarFallback"
                    [src]="post.author?.profilePhoto" 
                    [alt]="post.author?.name"
                    class="w-10 h-10 rounded-full object-cover">
                  <ng-template #avatarFallback>
                    <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {{ (post.author?.name || 'U').charAt(0).toUpperCase() }}
                    </div>
                  </ng-template>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                    <div class="text-sm text-gray-500">{{ post.author?.name || 'Sem autor' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                <span *ngFor="let cat of post.categories; let last = last">
                  {{ cat.nome }}<span *ngIf="!last">, </span>
                </span>
                <span *ngIf="!post.categories || post.categories.length === 0">Sem categoria</span>
              </td>
              <td class="px-6 py-4">
                <span 
                  [class]="post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  class="px-2 py-1 text-xs font-semibold rounded-full">
                  {{ post.published ? 'Publicado' : 'Rascunho' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ post.viewCount }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ formatDate(post.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-medium">
                <a 
                  [routerLink]="['/admin/posts/edit', post.id]" 
                  class="text-blue-600 hover:text-blue-900 mr-4">
                  Editar
                </a>
                <button 
                  (click)="confirmDelete(post)" 
                  class="text-red-600 hover:text-red-900">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="(posts$ | async)?.length === 0 && !(loading$ | async)" class="text-center py-8 text-gray-500">
          Nenhuma postagem encontrada. Crie sua primeira postagem!
        </div>
      </div>
    </div>

    <!-- Modal de confirmação de exclusão -->
    <div *ngIf="postToDelete" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-bold mb-4">Confirmar Exclusão</h3>
        <p class="text-gray-600 mb-6">
          Tem certeza que deseja excluir a postagem "<strong>{{ postToDelete.title }}</strong>"? 
          Esta ação não pode ser desfeita.
        </p>
        <div class="flex justify-end gap-3">
          <button 
            (click)="cancelDelete()" 
            class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            Cancelar
          </button>
          <button 
            (click)="deletePost()" 
            [disabled]="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50">
            {{ deleting ? 'Excluindo...' : 'Excluir' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class PostManagementComponent implements OnInit {
  posts$: Observable<Post[]> = of([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  private reload$ = new BehaviorSubject<void>(undefined);

  postToDelete: Post | null = null;
  deleting = false;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    // Carrega todos os posts (incluindo rascunhos)
    this.posts$ = this.reload$.pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next(null);
      }),
      switchMap(() =>
        this.postService.getAllPosts().pipe(
          catchError((err) => {
            console.error('Erro ao carregar posts', err);
            this.error$.next('Falha ao carregar postagens.');
            return of([]);
          }),
          finalize(() => this.loading$.next(false))
        )
      )
    );
  }

  reload(): void {
    this.reload$.next();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  confirmDelete(post: Post): void {
    this.postToDelete = post;
  }

  cancelDelete(): void {
    this.postToDelete = null;
  }

  deletePost(): void {
    if (!this.postToDelete) return;

    this.deleting = true;
    const postId = this.postToDelete.id;

    this.postService.deletePost(postId).subscribe({
      next: () => {
        console.log('Post deletado com sucesso');
        this.postToDelete = null;
        this.deleting = false;
        this.reload(); // Recarrega lista
      },
      error: (err) => {
        console.error('Erro ao deletar post', err);
        this.error$.next('Falha ao excluir postagem.');
        this.deleting = false;
        this.postToDelete = null;
      }
    });
  }
}
