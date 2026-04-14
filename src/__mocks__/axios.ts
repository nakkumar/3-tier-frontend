// src/__mocks__/axios.ts
const mockAxios = {
  get: jest.fn().mockResolvedValue({
    data: [
      // Your mock post data here
      {
        id: 1,
        title: "Test Post 1",
        content: "Content 1",
        category: "Nature",
        featured: true,
        // ... other fields
      },
      // Add more mock posts
    ]
  })
};

export default mockAxios;