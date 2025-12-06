import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PostListComponent } from './post-list';
import { PostService, Post } from '../../services/post.services/post.services';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('PostListComponent', () => {
  let fixture: ComponentFixture<PostListComponent>;
  let component: PostListComponent;

  const mockPosts: Post[] = [
    { id: '1', title: 'T1', author: 'A', date: 'D', content: 'C' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostListComponent, RouterTestingModule],
      providers: [
        { provide: PostService, useValue: { getPosts: () => of(mockPosts) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render posts from service', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('T1');
  });
});
