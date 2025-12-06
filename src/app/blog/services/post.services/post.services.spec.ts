import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService, Post } from './post.services';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch posts from assets', (done) => {
    const mockPosts: Post[] = [
      { id: '1', title: 'x', author: 'a', date: 'd', content: 'c' }
    ];

    service.getPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
      done();
    });

    const req = httpMock.expectOne('assets/posts.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should find a post by id', (done) => {
    const mockPosts: Post[] = [
      { id: '1', title: 'x', author: 'a', date: 'd', content: 'c' },
      { id: '2', title: 'y', author: 'b', date: 'd', content: 'c' }
    ];

    service.getPost('2').subscribe((post) => {
      expect(post).toEqual(mockPosts[1]);
      done();
    });

    const req = httpMock.expectOne('assets/posts.json');
    req.flush(mockPosts);
  });
});
