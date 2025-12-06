import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string; // Título/cargo do usuário (ex: "Desenvolvedor & Community Expert")

  @Column({ type: 'varchar', length: 255 })
  password: string; // Será hasheada com bcrypt

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePhoto: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relação: um usuário pode ter muitos posts
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
