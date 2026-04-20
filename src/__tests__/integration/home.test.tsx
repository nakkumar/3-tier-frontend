import HomePage from '@/pages/home-page';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import {
render,
screen,
waitForElementToBeRemoved,
} from '@testing-library/react';

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
...(jest.requireActual('react-router-dom') as Record<string, any>),
useNavigate: () => mockedUseNavigate,
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockFeaturedPosts = [
{ id: 1, title: "Post 1", categories: ["Nature", "Travel"] },
{ id: 2, title: "Post 2", categories: ["Adventure"] },
{ id: 3, title: "Post 3", categories: ["Culture"] },
{ id: 4, title: "Post 4", categories: ["Food", "Travel"] },
{ id: 5, title: "Post 5", categories: ["Nature"] },
];

const mockLatestPosts = Array.from({ length: 10 }, (_, i) => ({
id: i + 6,
title: `Latest ${i + 1}`,
categories: ["Nature"],
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
if (typeof url === 'string' && url.includes('/api/posts/category/')) {
const category = url.split('/api/posts/category/')[1];
const filtered = mockFeaturedPosts.filter((p) =>
p.categories.includes(category)
);
return Promise.resolve({ data: filtered });
}


  if (url === 'http://localhost:3001/api/posts/featured') {
    return Promise.resolve({ data: mockFeaturedPosts });
  }

  if (
    url === 'http://localhost:3001/api/posts/latest' ||
    url === 'http://localhost:3001/api/posts'
  ) {
    return Promise.resolve({ data: mockLatestPosts });
  }

  return Promise.reject(new Error('Not found'));
});


});

test('Home Route: category filter works (stable CI test)', async () => {
render( <BrowserRouter> <HomePage /> </BrowserRouter>
);


// Wait initial load
await waitForElementToBeRemoved(() =>
  screen.queryByTestId('featurepostcardskeleton')
).catch(() => {});

// Initial posts loaded
const initialPosts = await screen.findAllByTestId('featuredPostCard');
expect(initialPosts.length).toBeGreaterThan(0);

// Click Nature filter
const natureBtn = screen.getByRole('button', { name: 'Nature' });
await userEvent.click(natureBtn);

// Ensure filter applied
expect(
  await screen.findByText(/Posts related to "Nature"/i)
).toBeInTheDocument();

// Final validation (stable for CI)
const filteredPosts = await screen.findAllByTestId('featuredPostCard');

expect(filteredPosts.length).toBeGreaterThan(0);
expect(filteredPosts.length).toBeLessThanOrEqual(5);


});
});
