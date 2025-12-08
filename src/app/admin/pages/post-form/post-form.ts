import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService, Post, User, Category } from '../../../blog/services/post.services/post.services';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable } from 'rxjs';

/**
 * PostFormComponent
 * - Formulário para criar ou editar posts
 * - Detecta se é criação (sem ID na URL) ou edição (com ID)
 */
@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ isEditMode ? 'Editar' : 'Nova' }} Postagem</h2>
        <button 
          (click)="goBack()" 
          class="text-blue-600 hover:underline text-sm">
          ← Voltar para lista
        </button>
      </div>

      <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <!-- Título -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Título *
          </label>
          <input
            formControlName="title"
            type="text"
            id="title"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="postForm.get('title')?.invalid && postForm.get('title')?.touched"
            placeholder="Digite o título da postagem">
          <p *ngIf="postForm.get('title')?.invalid && postForm.get('title')?.touched" class="text-red-500 text-xs italic mt-1">
            Título é obrigatório (mínimo 3 caracteres)
          </p>
        </div>

        <!-- Resumo -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="excerpt">
            Resumo
          </label>
          <textarea
            formControlName="excerpt"
            id="excerpt"
            rows="2"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Breve descrição da postagem"></textarea>
        </div>

        <!-- Conteúdo -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="content">
            Conteúdo *
          </label>
          <textarea
            formControlName="content"
            id="content"
            rows="12"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono text-sm"
            [class.border-red-500]="postForm.get('content')?.invalid && postForm.get('content')?.touched"
            placeholder="Conteúdo em HTML. Ex: <h2>Título</h2><p>Parágrafo...</p>"></textarea>
          <p class="text-gray-600 text-xs mt-1">Você pode usar HTML para formatação</p>
          <p *ngIf="postForm.get('content')?.invalid && postForm.get('content')?.touched" class="text-red-500 text-xs italic mt-1">
            Conteúdo é obrigatório (mínimo 10 caracteres)
          </p>
        </div>

        <!-- Autor -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="authorId">
            Autor *
          </label>
          <select
            formControlName="authorId"
            id="authorId"
            class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="postForm.get('authorId')?.invalid && postForm.get('authorId')?.touched">
            <option value="">Selecione um autor</option>
            <option *ngFor="let user of users$ | async" [value]="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
          <p *ngIf="postForm.get('authorId')?.invalid && postForm.get('authorId')?.touched" class="text-red-500 text-xs italic mt-1">
            Autor é obrigatório
          </p>
        </div>

        <!-- Categorias (múltipla seleção) -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="categories">
            Categorias
          </label>
          <div class="space-y-2 border border-gray-300 rounded p-3">
            <label *ngFor="let cat of availableCategories" class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                [value]="cat.id"
                (change)="onCategoryChange($event, cat.id)"
                [checked]="selectedCategoryIds.includes(cat.id)"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              <span class="ml-3 text-gray-700">{{ cat.nome }}</span>
            </label>
          </div>
          <p class="text-gray-600 text-xs mt-1" *ngIf="selectedCategoryIds.length > 0">
            Selecionadas: {{ getSelectedCategoryNames() }}
          </p>
          <p class="text-gray-600 text-xs mt-1" *ngIf="selectedCategoryIds.length === 0">
            Nenhuma categoria selecionada
          </p>
        </div>

        <!-- Imagem URL -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
            URL da Imagem
          </label>
          <input
            formControlName="image"
            type="url"
            id="image"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://exemplo.com/imagem.jpg">
        </div>

        <!-- Tags -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="tags">
            Tags (separadas por vírgula)
          </label>
          <input
            formControlName="tagsInput"
            type="text"
            id="tags"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="narrativa, storytelling, personagens">
          <p class="text-gray-600 text-xs mt-1">Separe as tags com vírgula</p>
        </div>

        <!-- Publicado -->
        <div class="mb-6">
          <label class="flex items-center">
            <input
              formControlName="published"
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-600">
            <span class="ml-2 text-gray-700 font-bold">Publicar imediatamente</span>
          </label>
          <p class="text-gray-600 text-xs mt-1">Se desmarcado, será salvo como rascunho</p>
        </div>

        <!-- Mensagens de erro/sucesso -->
        <div *ngIf="errorMessage" class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <div *ngIf="successMessage" class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {{ successMessage }}
        </div>

        <!-- Botões -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            (click)="goBack()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Cancelar
          </button>
          <button
            type="submit"
            [disabled]="postForm.invalid || submitting"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed">
            {{ submitting ? 'Salvando...' : (isEditMode ? 'Atualizar' : 'Criar') }} Postagem
          </button>
        </div>
      </form>
    </div>
  `,
  styles: ``
})
export class PostFormComponent implements OnInit {
  postForm: FormGroup;
  isEditMode = false;
  postId: string | null = null;
  submitting = false;
  errorMessage = '';
  successMessage = '';
  users$?: Observable<User[]>;
  
  availableCategories: Category[] = [];
  selectedCategoryIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // Inicializa formulário com validações
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      excerpt: [''],
      content: ['', [Validators.required, Validators.minLength(10)]],
      authorId: ['', Validators.required],
      image: [''],
      tagsInput: [''],  // Campo auxiliar para input de tags
      published: [false]
    });
  }

  onCategoryChange(event: Event, categoryId: number): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      if (!this.selectedCategoryIds.includes(categoryId)) {
        this.selectedCategoryIds.push(categoryId);
      }
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId);
    }
  }

  getSelectedCategoryNames(): string {
    return this.availableCategories
      .filter(cat => this.selectedCategoryIds.includes(cat.id))
      .map(cat => cat.nome)
      .join(', ');
  }

  ngOnInit(): void {
    // Carrega lista de usuários
    this.users$ = this.postService.getAllUsers();

    // Carrega categorias do banco
    this.postService.getAllCategories().subscribe({
      next: (categories) => {
        this.availableCategories = categories;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
      }
    });

    // Verifica se está editando (URL tem ID) ou criando (URL = 'new')
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.postId = id;
        this.loadPost(id);
      }
    });
  }

  loadPost(id: string): void {
    this.postService.getPost(id).subscribe({
      next: (post) => {
        // Preenche formulário com dados do post
        this.postForm.patchValue({
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content,
          authorId: post.authorId || '',
          image: post.image || '',
          tagsInput: post.tags?.join(', ') || '',
          published: post.published
        });
        
        // Carrega IDs das categorias selecionadas
        this.selectedCategoryIds = post.categories?.map(cat => cat.id) || [];
      },
      error: (err) => {
        console.error('Erro ao carregar post', err);
        this.errorMessage = 'Erro ao carregar postagem.';
      }
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) return;

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Converte string de tags em array
    const tagsInput = this.postForm.value.tagsInput || '';
    const tags = tagsInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag.length > 0);

    // Prepara dados do post (remove tagsInput auxiliar)
    const postData: Partial<Post> = {
      title: this.postForm.value.title,
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      authorId: this.postForm.value.authorId, // ID do autor selecionado no dropdown
      categoryIds: this.selectedCategoryIds, // Array de IDs de categorias selecionadas
      image: this.postForm.value.image,
      tags: tags,
      published: this.postForm.value.published
    };

    // Remove campos vazios
    Object.keys(postData).forEach(key => {
      if (postData[key as keyof Post] === '' || postData[key as keyof Post] === null) {
        delete postData[key as keyof Post];
      }
    });

    // Chama serviço de criar ou atualizar
    const request$ = this.isEditMode && this.postId
      ? this.postService.updatePost(this.postId, postData)
      : this.postService.createPost(postData);

    request$.subscribe({
      next: (post) => {
        this.successMessage = `Postagem ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`;
        this.submitting = false;
        
        // Redireciona após 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/admin/posts']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erro ao salvar post', err);
        this.errorMessage = `Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} postagem.`;
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/posts']);
  }
}
