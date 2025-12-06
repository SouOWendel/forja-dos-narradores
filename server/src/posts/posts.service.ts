import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
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
    const post = this.postsRepository.create(createPostDto);
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

  async findByCategory(category: string): Promise<Post[]> {
    // Busca posts que contenham a categoria no array categories
    const posts = await this.postsRepository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
    });
    
    // Filtra posts que têm a categoria especificada
    const filtered = posts.filter(post => 
      post.categories && post.categories.includes(category)
    );
    return this.cleanPosts(filtered);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    Object.assign(post, updatePostDto);
    
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
