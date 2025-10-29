import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../../services/post.services/post.services';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { switchMap, catchError, finalize, shareReplay, startWith, take, tap } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommentList } from '../../components/comment-list/comment-list';
import { PostAuthorSidebar } from '../../components/post-author-sidebar/post-author-sidebar';
import { PostCounter } from '../../components/post-counter/post-counter';

// Re-using the Post interface exported by PostService (imported above)

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CommentList, PostAuthorSidebar, PostCounter],
  template: `
		<div class="flex flex-col md:flex-row gap-8">
			<app-post-author-sidebar></app-post-author-sidebar>
			<section class="container mx-auto p-4">
				<button class="mb-4 text-sm text-gray-600" [routerLink]="['/blog']">← Voltar</button>

				<div *ngIf="loading$ | async" class="py-8 text-center">Carregando post...</div>
				<div *ngIf="(error$ | async) as err" class="py-8 text-center text-red-600">{{ err }}</div>

				<article *ngIf="(post$ | async) as post">
					<h1 class="text-4xl font-serif mb-2">{{ post.title }}</h1>
					<div class="post-meta text-sm text-gray-500 mb-4">
						<span>{{ post.author }}</span>
						<span class="mx-2">•</span>
						<span>{{ post.date }}</span>
						<span class="mx-2">•</span>
						<span>{{ post.readTime }}</span>
					</div>

					<img *ngIf="post.image" [src]="post.image" alt="Imagem do post" class="w-full rounded-md mb-6 object-cover" />

					<div class="prose max-w-none">
						<p [innerHTML]="sanitized$ | async" class="leading-8 text-[18px]"></p>
					</div>
				</article>

				<div *ngIf="!(post$ | async) && !(loading$ | async) && !(error$ | async)">
					<p>Post não encontrado.</p>
				</div>

				<div *ngIf="(error$ | async) as err" class="py-4">
					<button class="px-4 py-2 bg-gray-200 rounded" (click)="reload()">Tentar novamente</button>
				</div>
			</section>
			<app-post-counter></app-post-counter>
			<app-comment-list></app-comment-list>
		</div>
  `,
  styles: `
    h1 { font-family: 'DM Serif Display', serif; }
    .prose p { font-family: 'DM Sans', sans-serif; }
  `
})
export class PostDetailComponent implements OnInit {
	counter = 1;

  post$?: Observable<Post | undefined>;
  sanitized$?: Observable<SafeHtml | null>;
  loading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);
  private reload$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private postService: PostService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Observa os parâmetros da rota e usa switchMap para buscar o post correspondente.
    // Reactive fetch: triggered by reload$ and starts immediately via startWith
    this.post$ = this.reload$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.route.paramMap.pipe(
          take(1),
          switchMap((params) => {
            const id = params.get('id');
            if (!id) {
              this.loading$.next(false);
              this.error$.next('ID do post inválido');
              return of(undefined);
            }

            this.loading$.next(true);
            this.error$.next(null);
            return this.postService.getPost(id).pipe(
              catchError((err) => {
                console.error('Erro ao carregar post', err);
                this.error$.next('Falha ao carregar o post');
                return of(undefined);
              }),
              finalize(() => this.loading$.next(false)),
            );
          }),
        ),
      ),
      shareReplay(1),
    );

    // sanitized$ exposes SafeHtml for the template to bind to innerHTML safely
    this.sanitized$ = this.post$!.pipe(
      switchMap((p) => of(p ? this.sanitizer.bypassSecurityTrustHtml(p.content) : null)),
      shareReplay(1),
    );
  }

  reload(): void {
    this.reload$.next();
  }
}
