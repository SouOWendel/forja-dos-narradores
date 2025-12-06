import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostCardComponent } from '../post-card/post-card';
import { Categories } from './categories/categories';
import { PaginationComponent } from './pagination/pagination';
import { PostService, Post } from '../../services/post.services/post.services';
import { BehaviorSubject, defer, Observable, of, Subject } from 'rxjs';
import { catchError, finalize, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent, Categories, /* PaginationComponent */],
  template: `
    <section class="max-w-7xl mx-auto p-4">
      <app-categories (categorySelected)="onCategoryChange($event)"></app-categories>
      <hr class="my-4 border-gray-300" />

      <div *ngIf="loading$ | async" class="py-8 text-center">Carregando posts...</div>
      <div *ngIf="(error$ | async) as err" class="py-8 text-center text-red-600">
        <div>{{ err }}</div>
        <button class="mt-2 px-4 py-2 bg-gray-200 rounded" (click)="reload()">Tentar novamente</button>
      </div>

      <section class="post-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-12 py-4 mb-8">
        <a *ngFor="let post of posts$ | async" [routerLink]="['/blog', post.id]" class="block">
          <app-post-card [post]="post"></app-post-card>
        </a>
      </section>

			<!-- Paginação Futura -->
      <!-- <app-pagination></app-pagination> -->
    </section>
  `,
  styles: ``
})
export class PostListComponent {
  posts$: Observable<Post[]> = of([]);
  loading$ = new BehaviorSubject<boolean>(true);
  error$ = new BehaviorSubject<string | null>(null);
  
  // Subject que emite a categoria selecionada
  private categoryFilter$ = new BehaviorSubject<string | null>(null);
  private isFirstLoad = true;

  constructor(private postService: PostService) {
    // Reactive fetch que reage a mudanças de categoria
    this.posts$ = this.categoryFilter$.pipe(
      tap(() => {
        // Só mostra "carregando" no primeiro load
        if (this.isFirstLoad) {
          this.loading$.next(true);
        }
        this.error$.next(null);
      }),
      switchMap((category) => {
        // Se categoria é null, busca todos. Senão, busca por categoria
        const request$ = category 
          ? this.postService.getPostsByCategory(category)
          : this.postService.getPosts();
        
        return request$.pipe(
          tap((posts) => console.log('Posts recebidos:', posts)),
          catchError((err) => {
            console.error('Erro ao carregar posts', err);
            this.error$.next('Falha ao carregar posts. Tente novamente.');
            return of([] as Post[]);
          }),
          finalize(() => {
            this.loading$.next(false);
            this.isFirstLoad = false;
          }),
        );
      }),
      shareReplay(1),
    );
  }

  // Método chamado quando categoria muda
  onCategoryChange(category: string | null): void {
    this.categoryFilter$.next(category);  // Emite nova categoria, dispara busca
  }

  // Método para retry (busca novamente com a categoria atual)
  reload(): void {
    this.categoryFilter$.next(this.categoryFilter$.value);
  }
}
