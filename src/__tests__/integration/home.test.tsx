import HomePage from '@/pages/home-page';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, any>),
  useNavigate: () => mockedUseNavigate,
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data with proper structure including categories
const mockFeaturedPosts = [
  {
    id: 1,
    title: "Featured Post 1",
    content: "Content for featured post 1",
    categories: ["Nature", "Travel"],
    featured: true,
    createdAt: "2024-01-01",
    imageUrl: "test-image-1.jpg"
  },
  {
    id: 2,
    title: "Featured Post 2",
    content: "Content for featured post 2",
    categories: ["Adventure"],
    featured: true,
    createdAt: "2024-01-02",
    imageUrl: "test-image-2.jpg"
  },
  {
    id: 3,
    title: "Featured Post 3",
    content: "Content for featured post 3",
    categories: ["Culture"],
    featured: true,
    createdAt: "2024-01-03",
    imageUrl: "test-image-3.jpg"
  },
  {
    id: 4,
    title: "Featured Post 4",
    content: "Content for featured post 4",
    categories: ["Food", "Travel"],
    featured: true,
    createdAt: "2024-01-04",
    imageUrl: "test-image-4.jpg"
  },
  {
    id: 5,
    title: "Featured Post 5",
    content: "Content for featured post 5",
    categories: ["Nature"],
    featured: true,
    createdAt: "2024-01-05",
    imageUrl: "test-image-5.jpg"
  },
];

const mockLatestPosts = [
  {
    id: 6,
    title: "Latest Post 1",
    content: "Content for latest post 1",
    categories: ["Travel"],
    createdAt: "2024-01-06",
    imageUrl: "test-image-6.jpg"
  },
  {
    id: 7,
    title: "Latest Post 2",
    content: "Content for latest post 2",
    categories: ["Adventure"],
    createdAt: "2024-01-07",
    imageUrl: "test-image-7.jpg"
  },
  {
    id: 8,
    title: "Latest Post 3",
    content: "Content for latest post 3",
    categories: ["Nature"],
    createdAt: "2024-01-08",
    imageUrl: "test-image-8.jpg"
  },
  {
    id: 9,
    title: "Latest Post 4",
    content: "Content for latest post 4",
    categories: ["Culture"],
    createdAt: "2024-01-09",
    imageUrl: "test-image-9.jpg"
  },
  {
    id: 10,
    title: "Latest Post 5",
    content: "Content for latest post 5",
    categories: ["Food"],
    createdAt: "2024-01-10",
    imageUrl: "test-image-10.jpg"
  },
  {
    id: 11,
    title: "Latest Post 6",
    content: "Content for latest post 6",
    categories: ["Travel", "Adventure"],
    createdAt: "2024-01-11",
    imageUrl: "test-image-11.jpg"
  },
  {
    id: 12,
    title: "Latest Post 7",
    content: "Content for latest post 7",
    categories: ["Nature"],
    createdAt: "2024-01-12",
    imageUrl: "test-image-12.jpg"
  },
  {
    id: 13,
    title: "Latest Post 8",
    content: "Content for latest post 8",
    categories: ["Culture"],
    createdAt: "2024-01-13",
    imageUrl: "test-image-13.jpg"
  },
  {
    id: 14,
    title: "Latest Post 9",
    content: "Content for latest post 9",
    categories: ["Food", "Travel"],
    createdAt: "2024-01-14",
    imageUrl: "test-image-14.jpg"
  },
  {
    id: 15,
    title: "Latest Post 10",
    content: "Content for latest post 10",
    categories: ["Adventure"],
    createdAt: "2024-01-15",
    imageUrl: "test-image-15.jpg"
  },
];

// Mock window.scrollTo
beforeAll(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  mockedUseNavigate.mockRestore();
  jest.clearAllMocks();
});

describe('Integration Test: Home Route', () => {
  beforeEach(() => {
    // Setup mock API responses
    mockedAxios.get.mockImplementation((url) => {
      // Handle category filter
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
      if (url === 'http://localhost:3001/api/posts/latest') {
        return Promise.resolve({ data: mockLatestPosts });
      }
      if (url === 'http://localhost:3001/api/posts') {
        return Promise.resolve({ data: mockLatestPosts });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('Home Route: Renders home page', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    //ACT

    //ASSERT
    expect(screen.getByText(/WanderLust/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /Create post/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Featured Posts/)).toBeInTheDocument();
    expect(screen.getAllByTestId('featurepostcardskeleton')).toHaveLength(5);
    expect(screen.getAllByTestId('latestpostcardskeleton')).toHaveLength(5);
    expect(screen.getByText(/All Posts/)).toBeInTheDocument();
    expect(screen.getAllByTestId('postcardskeleton')).toHaveLength(8);
  });

  test('Home Route: Verify navigation on create post button click', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    const createPost = screen.getByRole('button', {
      name: /Create post/i,
    });

    //ASSERT
    expect(mockedUseNavigate).toHaveBeenCalledTimes(0);

    //ACT
    await userEvent.click(createPost);

    //ASSERT
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });

  test('Home Route: Verify filtered posts render on category button click', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    // Wait for initial load to complete
    await waitForElementToBeRemoved(() => 
      screen.queryByTestId('featurepostcardskeleton')
    ).catch(() => {});

    // Verify initial featured posts are loaded
    const initialFeaturedPosts = await screen.findAllByTestId('featuredPostCard');
    expect(initialFeaturedPosts).toHaveLength(5);
    
    // Find and click Nature category button
    const natureCategoryPill = screen.getByRole('button', {
      name: 'Nature',
    });
    expect(natureCategoryPill).toBeInTheDocument();
    
    //ACT - Click on Nature category
    await userEvent.click(natureCategoryPill);
    
    // Wait for loading to complete after category filter
    await waitForElementToBeRemoved(() => 
      screen.queryByTestId('featurepostcardskeleton')
    ).catch(() => {});
    
    //ASSERT
    expect(await screen.findByText('Posts related to "Nature"')).toBeInTheDocument();
    
    // Wait for filtered posts to load
    const filteredPosts = await screen.findAllByTestId('featuredPostCard');
    // Should only show posts with Nature category (posts 1 and 5 have Nature)
    expect(filteredPosts.length).toBe(2);
  });

  test('Home Route: Verify navigation on post card click under Featured Posts section', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for skeleton to disappear
    await waitForElementToBeRemoved(() => 
      screen.queryByTestId('featurepostcardskeleton')
    ).catch(() => {});
    
    //ACT
    //ASSERT
    const featuredPostCard = await screen.findAllByTestId('featuredPostCard');
    expect(featuredPostCard).toHaveLength(5);
    await userEvent.click(featuredPostCard[0]);
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });

  test('Home Route: Verify render of post card under All Post section', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for skeletons to disappear
    await waitForElementToBeRemoved(() => 
      screen.queryByTestId('postcardskeleton')
    ).catch(() => {});
    
    //ACT
    //ASSERT
    expect(await screen.findAllByTestId('postcard')).toHaveLength(10);
  });

  test('Home Route: Verify navigation on post card click under All Posts section', async () => {
    //ARRANGE
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    // Wait for skeletons to disappear
    await waitForElementToBeRemoved(() => 
      screen.queryByTestId('postcardskeleton')
    ).catch(() => {});
    
    //ACT
    //ASSERT
    const allPostCard = await screen.findAllByTestId('postcard');
    expect(allPostCard).toHaveLength(10);
    
    const img = allPostCard[0].getElementsByTagName('img')[0];
    await userEvent.click(img);
    expect(mockedUseNavigate).toHaveBeenCalledTimes(1);
  });
});
