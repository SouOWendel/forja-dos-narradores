import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail';
import { PostService, Post } from '../../services/post.services/post.services';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';

describe('PostDetailComponent', () => {
  let fixture: ComponentFixture<PostDetailComponent>;
  let component: PostDetailComponent;

  const mockPost: Post = { id: '1', title: 'T1', author: 'A', date: 'D', content: 'C' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailComponent, RouterTestingModule.withRoutes([])],
      providers: [
  { provide: PostService, useValue: { getPost: (id: string) => of(mockPost) } },
  { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '1' })) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display post title', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('T1');
  });
});
