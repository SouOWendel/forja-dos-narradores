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
  imports: [CommonModule, RouterModule, PostCardComponent, Categories, PaginationComponent],
  template: `
    <section class="container mx-auto p-4">
      <app-categories></app-categories>
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

      <app-pagination></app-pagination>
    </section>
  `,
  styles: ``
})
export class PostListComponent {
  posts$: Observable<Post[]> = of([]);
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  private reload$ = new Subject<void>();

  constructor(private postService: PostService) {
    // Reactive fetch triggered on reload$.startWith() so the template's async pipe can subscribe
    // without conditional gating. shareReplay(1) caches the result during the component lifecycle.
    this.posts$ = this.reload$.pipe(
      startWith(void 0),
      tap(() => {
        this.loading$.next(true);
        this.error$.next(null);
      }),
      switchMap(() =>
        this.postService.getPosts().pipe(
          catchError((err) => {
            console.error('Erro ao carregar posts', err);
            this.error$.next('Falha ao carregar posts. Tente novamente.');
            return of([] as Post[]);
          }),
          finalize(() => this.loading$.next(false)),
        ),
      ),
      shareReplay(1),
    );

    // No manual subscribe needed: template async pipe will subscribe immediately because posts$ starts
    // with startWith and does not depend on loading$ to be false.
  }

  // Exposed method for retry button
  reload(): void {
    this.reload$.next();
  }
}
