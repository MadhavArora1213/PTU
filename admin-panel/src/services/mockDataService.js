// Mock data service for development mode when backend is not available
export class MockDataService {
  constructor() {
    this.mockDelay = 500; // Simulate network delay
  }

  async delay(ms = this.mockDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAdminStats() {
    await this.delay();
    return {
      users: 1250,
      activeUsers: 875,
      totalProgress: 15600,
      totalQuizzes: 3420,
      averageScore: 78,
      completionRate: 85,
      totalReports: 145,
      timestamp: new Date().toISOString(),
      dataSource: 'mock'
    };
  }

  async getAnalytics() {
    await this.delay();
    return {
      totalUsers: 1250,
      tutorials: {
        total: 24,
        completed: 18640,
        averageRating: 4.6
      },
      simulations: {
        total: 12,
        played: 8920,
        averageScore: 72
      },
      quizzes: {
        total: 18,
        attempts: 12450,
        passRate: 78
      },
      engagement: {
        dailyActiveUsers: 320,
        weeklyActiveUsers: 1120,
        monthlyActiveUsers: 1250,
        averageSessionTime: 12.5
      }
    };
  }

  async getLeaderboard(type = 'overall', limit = 10) {
    await this.delay();
    const mockUsers = [
      { id: 1, name: 'Rajesh Kumar', points: 2450, level: 'Expert', streak: 15 },
      { id: 2, name: 'Priya Sharma', points: 2320, level: 'Advanced', streak: 12 },
      { id: 3, name: 'Amit Singh', points: 2180, level: 'Advanced', streak: 8 },
      { id: 4, name: 'Sneha Patel', points: 2050, level: 'Intermediate', streak: 10 },
      { id: 5, name: 'Vikram Gupta', points: 1920, level: 'Intermediate', streak: 6 },
      { id: 6, name: 'Kavita Mehta', points: 1850, level: 'Intermediate', streak: 9 },
      { id: 7, name: 'Rohit Jain', points: 1720, level: 'Beginner', streak: 4 },
      { id: 8, name: 'Anjali Verma', points: 1680, level: 'Beginner', streak: 7 },
      { id: 9, name: 'Suresh Rao', points: 1540, level: 'Beginner', streak: 5 },
      { id: 10, name: 'Meera Nair', points: 1420, level: 'Beginner', streak: 3 }
    ];
    return mockUsers.slice(0, limit);
  }

  async getTutorials(page = 1, limit = 10) {
    await this.delay();
    const mockTutorials = [
      {
        id: 1,
        title: 'Banking Security Basics',
        description: 'Learn fundamental banking security practices',
        language: 'en',
        difficulty: 'beginner',
        status: 'published',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z'
      },
      {
        id: 2,
        title: 'Identifying Phishing Scams',
        description: 'How to recognize and avoid phishing attempts',
        language: 'en',
        difficulty: 'intermediate',
        status: 'published',
        created_at: '2024-01-18T11:00:00Z',
        updated_at: '2024-01-25T16:45:00Z'
      },
      {
        id: 3,
        title: 'Investment Fraud Prevention',
        description: 'Protect yourself from investment scams',
        language: 'en',
        difficulty: 'advanced',
        status: 'published',
        created_at: '2024-01-20T09:30:00Z',
        updated_at: '2024-01-28T13:20:00Z'
      }
    ];
    
    return {
      data: mockTutorials,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockTutorials.length / limit),
        totalItems: mockTutorials.length,
        limit: limit
      }
    };
  }

  async getQuizzes(page = 1, limit = 10) {
    await this.delay();
    const mockQuizzes = [
      {
        id: 1,
        title: 'Banking Security Quiz',
        description: 'Test your knowledge of banking security',
        language: 'en',
        difficulty: 'beginner',
        questions: [
          {
            question: 'What should you do if you receive a suspicious banking email?',
            options: ['Click the link', 'Reply with your details', 'Delete it', 'Contact your bank'],
            correct_answer: 3
          }
        ],
        status: 'published',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z'
      },
      {
        id: 2,
        title: 'Phishing Detection Quiz',
        description: 'Learn to identify phishing attempts',
        language: 'en',
        difficulty: 'intermediate',
        questions: [
          {
            question: 'Which of these is a common phishing indicator?',
            options: ['Urgent language', 'Official logos', 'Correct grammar', 'HTTPS links'],
            correct_answer: 0
          }
        ],
        status: 'published',
        created_at: '2024-01-18T11:00:00Z',
        updated_at: '2024-01-25T16:45:00Z'
      }
    ];
    
    return {
      data: mockQuizzes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockQuizzes.length / limit),
        totalItems: mockQuizzes.length,
        limit: limit
      }
    };
  }

  async getUsers(page = 1, limit = 10, search = '') {
    await this.delay();
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        user_type: 'regular',
        language: 'en',
        created_at: '2024-01-10T08:00:00Z',
        email_verified: true,
        total_points: 1250,
        quiz_attempts: 5
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1234567891',
        user_type: 'premium',
        language: 'en',
        created_at: '2024-01-12T10:30:00Z',
        email_verified: true,
        total_points: 2100,
        quiz_attempts: 8
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+1234567892',
        user_type: 'regular',
        language: 'hi',
        created_at: '2024-01-15T14:20:00Z',
        email_verified: false,
        total_points: 850,
        quiz_attempts: 3
      }
    ];

    let filteredUsers = mockUsers;
    if (search) {
      filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    return {
      success: true,
      data: filteredUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalItems: filteredUsers.length,
        limit: limit
      }
    };
  }

  async createTutorial(tutorialData) {
    await this.delay();
    return {
      success: true,
      data: {
        id: Date.now(),
        ...tutorialData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Tutorial created successfully'
    };
  }

  async updateTutorial(id, tutorialData) {
    await this.delay();
    return {
      success: true,
      data: {
        id: id,
        ...tutorialData,
        updated_at: new Date().toISOString()
      },
      message: 'Tutorial updated successfully'
    };
  }

  async deleteTutorial(id) {
    await this.delay();
    return {
      success: true,
      message: 'Tutorial deleted successfully'
    };
  }

  async createQuiz(quizData) {
    await this.delay();
    return {
      success: true,
      data: {
        id: Date.now(),
        ...quizData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: 'Quiz created successfully'
    };
  }

  async updateQuiz(id, quizData) {
    await this.delay();
    return {
      success: true,
      data: {
        id: id,
        ...quizData,
        updated_at: new Date().toISOString()
      },
      message: 'Quiz updated successfully'
    };
  }

  async deleteQuiz(id) {
    await this.delay();
    return {
      success: true,
      message: 'Quiz deleted successfully'
    };
  }

  async exportAnalytics(format = 'json') {
    await this.delay();
    const analyticsData = await this.getAnalytics();
    
    if (format === 'csv') {
      return 'CSV export data would be here';
    }
    
    return {
      success: true,
      data: {
        ...analyticsData,
        exportedAt: new Date().toISOString()
      }
    };
  }
}

export const mockDataService = new MockDataService();