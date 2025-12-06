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

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPublished(): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { published: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Increment view count
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async findByCategory(category: string): Promise<Post[]> {
    return await this.postsRepository.find({
      where: { category, published: true },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    Object.assign(post, updatePostDto);
    
    return await this.postsRepository.save(post);
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
