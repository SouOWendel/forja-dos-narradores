import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    private readonly categoriesService: CategoriesService,
  ) {}

  private cleanPost(post: Post): Post {
    if (post.author) {
      delete post.author.password;
    }
    return post;
  }

  private cleanPosts(posts: Post[]): Post[] {
    return posts.map(post => this.cleanPost(post));
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { categoryIds, ...postData } = createPostDto;
    
    const post = this.postsRepository.create(postData);
    
    // Atribui categorias se fornecidas
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoriesService.findAll();
      post.categories = categories.filter(cat => categoryIds.includes(cat.id));
    }
    
    const saved = await this.postsRepository.save(post);
    return this.cleanPost(saved);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
    return this.cleanPosts(posts);
  }

  async findPublished(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
    });
    return this.cleanPosts(posts);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return this.cleanPost(post);
  }

  async findByCategory(categorySlug: string): Promise<Post[]> {
    // Busca categoria pelo slug
    const category = await this.categoriesService.findBySlug(categorySlug);
    
    // Busca posts que têm essa categoria
    const posts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.categories', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.published = :published', { published: true })
      .andWhere('category.id = :categoryId', { categoryId: category.id })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    
    return this.cleanPosts(posts);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const { categoryIds, ...postData } = updatePostDto;
    
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    Object.assign(post, postData);
    
    // Atualiza categorias se fornecidas
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoriesService.findAll();
        post.categories = categories.filter(cat => categoryIds.includes(cat.id));
      } else {
        post.categories = [];
      }
    }
    
    const updated = await this.postsRepository.save(post);
    return this.cleanPost(updated);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postsRepository.remove(post);
  }

  async incrementViews(id: string): Promise<Post> {
    const post = await this.findOne(id);
    post.viewCount += 1;
    return await this.postsRepository.save(post);
  }
}
