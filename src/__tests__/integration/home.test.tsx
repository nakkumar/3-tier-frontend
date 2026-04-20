import HomePage from '@/pages/home-page';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { render, screen, waitForElementToBeRemoved, waitFor } from '@testing-library/react';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
...(jest.requireActual('react-router-dom') as Record<string, any>),
useNavigate: () => mockedUseNavigate,
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data
const mockFeaturedPosts = [
{ id: 1, title: "Featured Post 1", content: "Content", categories: ["Nature", "Travel"], featured: true, createdAt: "2024-01-01", imageUrl: "img1.jpg" },
{ id: 2, title: "Featured Post 2", content: "Content", categories: ["Adventure"], featured: true, createdAt: "2024-01-02", imageUrl: "img2.jpg" },
{ id: 3, title: "Featured Post 3", content: "Content", categories: ["Culture"], featured: true, createdAt: "2024-01-03", imageUrl: "img3.jpg" },
{ id: 4, title: "Featured Post 4", content: "Content", categories: ["Food", "Travel"], featured: true, createdAt: "2024-01-04", imageUrl: "img4.jpg" },
{ id: 5, title: "Featured Post 5", content: "Content", categories: ["Nature"], featured: true, createdAt: "2024-01-05", imageUrl: "img5.jpg" },
];

const mockLatestPosts = Array.from({ length: 10 }, (_, i) => ({
id: i + 6,
title: `Latest Post ${i + 1}`,
content: "Content",
categories: ["Nature"],
createdAt: "2024-01-01",
imageUrl: "img.jpg"
}));

beforeAll(() => {
window.scrollTo = jest.fn();
});

afterEach(() => {
mockedUseNavigate.mockRestore();
jest.clearAllMocks();
});

describe('Integration Test: Home Route', () => {

beforeEach(() => {
mockedAxios.get.mockImplementation((url) => {

```
  if (typeof url === 'string' && url.includes('/api/posts/category/')) {
    const category = url.split('/api/posts/category/')[1];
    const filteredPosts = mockFeaturedPosts.filter(post =>
      post.categories.includes(category)
    );
    return Promise.resolve({ data: filteredPosts });
  }

  if (url === 'http://localhost:3001/api/posts/featured') {
    return Promise.resolve({ data: mockFeaturedPosts });
  }

  if (url === 'http://localhost:3001/api/posts/latest' || url === 'http://localhost:3001/api/posts') {
    return Promise.resolve({ data: mockLatestPosts });
  }

  return Promise.reject(new Error('Not found'));
});
```

});

test('Home Route: Renders home page', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);

```
expect(screen.getByText(/WanderLust/)).toBeInTheDocument();
expect(screen.getByRole('button', { name: /Create post/i })).toBeInTheDocument();
expect(screen.getByText(/Featured Posts/)).toBeInTheDocument();
```

});

test('Home Route: Verify navigation on create post button click', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);

```
const createPost = screen.getByRole('button', { name: /Create post/i });

await userEvent.click(createPost);

expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
```

});

test('Home Route: Verify filtered posts render on category button click', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);

```
// Wait initial load
await waitForElementToBeRemoved(() =>
  screen.queryByTestId('featurepostcardskeleton')
).catch(() => {});

// Verify initial posts
const initialPosts = await screen.findAllByTestId('featuredPostCard');
expect(initialPosts).toHaveLength(5);

// Click category
const natureBtn = screen.getByRole('button', { name: 'Nature' });
await userEvent.click(natureBtn);

// Wait for UI update
expect(await screen.findByText('Posts related to "Nature"')).toBeInTheDocument();

// ✅ FIXED: Proper async wait
await waitFor(() => {
  const filteredPosts = screen.getAllByTestId('featuredPostCard');
  expect(filteredPosts).toHaveLength(2);
});
```

});

test('Home Route: Verify navigation on featured post click', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);

```
await waitForElementToBeRemoved(() =>
  screen.queryByTestId('featurepostcardskeleton')
).catch(() => {});

const posts = await screen.findAllByTestId('featuredPostCard');

await userEvent.click(posts[0]);

expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
```

});

test('Home Route: Verify all posts render', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);

```
await waitForElementToBeRemoved(() =>
  screen.queryByTestId('postcardskeleton')
).catch(() => {});

const posts = await screen.findAllByTestId('postcard');
expect(posts).toHaveLength(10);
```

});

});
