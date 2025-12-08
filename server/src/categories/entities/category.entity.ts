import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  slug: string;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
