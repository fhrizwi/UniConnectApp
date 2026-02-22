// Mock API for UniConnect App
// This simulates a backend API with proper functionality

// Mock data storage
let mockPosts = [
  {
    id: 'mock-1',
    userId: 'u1',
    authorName: 'Aarav Mehta',
    role: 'student',
    title: 'Excited for Tech Fest 2026!',
    content: 'Just registered for all the workshops. Who else is joining the AI/ML track? Let\'s form a team!',
    imageUrl: 'https://picsum.photos/seed/techfest2026/900/600',
    likes: 45,
    likedBy: ['u2', 'u3', 'u5'],
    comments: [
      { id: 'c1', userId: 'u2', authorName: 'Dr. Nisha Rao', text: 'Great choice! See you at the ML workshop.', createdAt: Date.now() - 3600000 }
    ],
    createdAt: Date.now() - 3000000, // 50 minutes ago
    fromApi: false,
    hashtags: ['TechFest', 'AI', 'Workshop']
  },
  {
    id: 'mock-2',
    userId: 'u3',
    authorName: 'Sana Khan',
    role: 'alumni',
    title: 'Referral Opportunity at Google',
    content: 'We have openings for SDE positions. DM me your resume if you meet the criteria: 3+ years experience, strong DSA, system design knowledge.',
    imageUrl: 'https://picsum.photos/seed/google-referral/900/600',
    likes: 89,
    likedBy: ['u1', 'u4', 'u5'],
    comments: [],
    createdAt: Date.now() - 7200000, // 2 hours ago
    fromApi: false,
    hashtags: ['Placement2026', 'Google', 'Referral']
  },
  {
    id: 'mock-3',
    userId: 'u2',
    authorName: 'Dr. Nisha Rao',
    role: 'faculty',
    title: 'Research Opportunity in Quantum Computing',
    content: 'Looking for motivated students for a summer research project. Prior experience with linear algebra and Python preferred.',
    imageUrl: 'https://picsum.photos/seed/quantum-research/900/600',
    likes: 34,
    likedBy: ['u1'],
    comments: [
      { id: 'c2', userId: 'u1', authorName: 'Aarav Mehta', text: 'Very interested! When can we discuss this?', createdAt: Date.now() - 1800000 }
    ],
    createdAt: Date.now() - 10800000, // 3 hours ago
    fromApi: false,
    hashtags: ['Research', 'Quantum', 'Summer']
  },
  {
    id: 'mock-4',
    userId: 'u4',
    authorName: 'Robotics Club',
    role: 'club',
    title: 'Weekly Robotics Workshop',
    content: 'This Saturday we\'ll be working on line-following robots. Beginners welcome! Bring your laptops.',
    imageUrl: 'https://picsum.photos/seed/robotics-workshop/900/600',
    likes: 28,
    likedBy: ['u1', 'u5'],
    comments: [],
    createdAt: Date.now() - 14400000, // 4 hours ago
    fromApi: false,
    hashtags: ['Robotics', 'Workshop', 'Club']
  },
  {
    id: 'mock-5',
    userId: 'u5',
    authorName: 'Ishita Verma',
    role: 'student',
    title: 'Study Group for Data Structures',
    content: 'Forming a study group for mid-term prep. We meet every Tuesday and Thursday in the library. Join us!',
    imageUrl: 'https://picsum.photos/seed/ds-study-group/900/600',
    likes: 56,
    likedBy: ['u1', 'u2'],
    comments: [
      { id: 'c3', userId: 'u1', authorName: 'Aarav Mehta', text: 'Count me in! What time?', createdAt: Date.now() - 900000 }
    ],
    createdAt: Date.now() - 18000000, // 5 hours ago
    fromApi: false,
    hashtags: ['StudyGroup', 'DSA', 'Exam']
  }
];

let nextPostId = 6;
let nextCommentId = 4;

// Mock API functions
export const mockAPI = {
  // Get all posts, sorted by latest first
  getPosts: async (limit = 20) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Sort by createdAt descending (latest first)
    const sortedPosts = [...mockPosts].sort((a, b) => b.createdAt - a.createdAt);
    return sortedPosts.slice(0, limit);
  },

  // Create a new post
  createPost: async (postData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPost = {
      id: `mock-${nextPostId++}`,
      ...postData,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: Date.now(),
      fromApi: false
    };
    
    // Add to beginning of array (latest first)
    mockPosts.unshift(newPost);
    return newPost;
  },

  // Toggle like on a post
  toggleLike: async (postId, userId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    const isLiked = post.likedBy.includes(userId);
    
    if (isLiked) {
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }
    
    return { liked: !isLiked, likes: post.likes };
  },

  // Add comment to a post
  addComment: async (postId, commentData) => {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const post = mockPosts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');
    
    const newComment = {
      id: `c-${nextCommentId++}`,
      ...commentData,
      createdAt: Date.now()
    };
    
    post.comments.push(newComment);
    return newComment;
  },

  // Get posts by user
  getPostsByUser: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userPosts = mockPosts
      .filter(post => post.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
    
    return userPosts;
  },

  // Search posts by content or hashtags
  searchPosts: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const searchTerm = query.toLowerCase();
    const filteredPosts = mockPosts
      .filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.hashtags?.some(tag => tag.toLowerCase().includes(searchTerm))
      )
      .sort((a, b) => b.createdAt - a.createdAt);
    
    return filteredPosts;
  },

  // Get trending hashtags
  getTrendingHashtags: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const hashtagCounts = {};
    mockPosts.forEach(post => {
      if (post.hashtags) {
        post.hashtags.forEach(tag => {
          hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(hashtagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
};

// Export the mock data for direct access if needed
export { mockPosts };
