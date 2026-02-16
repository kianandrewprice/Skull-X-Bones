# Contributing to Skull x Bones

Thank you for your interest in contributing to the Skull x Bones Ecosystem! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the existing issues to avoid duplicates
2. Use the latest version of the code
3. Collect relevant information (logs, screenshots, etc.)

When creating a bug report, include:
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Relevant logs or error messages

### Suggesting Features

Feature requests are welcome! Please:
1. Check if the feature has already been requested
2. Provide a clear use case
3. Explain how it benefits users
4. Consider implementation complexity

### Pull Requests

#### Before Submitting

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   npm run lint
   npm run test
   npm run build
   ```

5. **Commit your changes**:
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     ```
     feat: add song war voting system
     fix: resolve authentication token refresh issue
     docs: update API documentation for marketplace
     test: add unit tests for music service
     ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**

#### PR Guidelines

- Provide a clear title and description
- Reference related issues (e.g., "Fixes #123")
- Include screenshots for UI changes
- Ensure all tests pass
- Keep PRs focused on a single feature/fix
- Respond to review feedback promptly

## Development Setup

### Prerequisites
- Node.js 18+ or 20+
- PostgreSQL 14+
- Redis 6+
- Git

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kianandrewprice/Skull-X-Bones.git
   cd Skull-X-Bones
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Define interfaces for all data structures
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Naming Conventions

- **Files**: camelCase for services, PascalCase for models
  - Services: `musicService.ts`
  - Models: `User.ts`
  - Routes: `music.routes.ts`

- **Variables**: camelCase
  ```typescript
  const songTitle = 'My Song';
  ```

- **Constants**: UPPER_SNAKE_CASE
  ```typescript
  const MAX_UPLOAD_SIZE = 10485760;
  ```

- **Classes**: PascalCase
  ```typescript
  class MusicService { }
  ```

- **Interfaces**: PascalCase with descriptive names
  ```typescript
  interface Song { }
  interface UserProfile { }
  ```

### Code Organization

```typescript
// 1. Imports (grouped by external, internal, types)
import express from 'express';
import { MusicService } from '../services/music';
import { Song } from '../models';

// 2. Constants
const DEFAULT_PAGE_SIZE = 20;

// 3. Type definitions
interface QueryParams {
  limit?: number;
  offset?: number;
}

// 4. Main code
export class SomeClass {
  // ...
}
```

### Error Handling

Always use typed errors:
```typescript
import { AppError } from '../middleware/errorHandler';

throw new AppError('Resource not found', 404);
```

### Async/Await

Prefer async/await over promises:
```typescript
// Good
async function fetchData() {
  try {
    const data = await service.getData();
    return data;
  } catch (error) {
    logger.error('Failed to fetch data', error);
    throw error;
  }
}

// Avoid
function fetchData() {
  return service.getData()
    .then(data => data)
    .catch(error => {
      logger.error('Failed to fetch data', error);
      throw error;
    });
}
```

## Testing

### Unit Tests

Write unit tests for all service methods:
```typescript
describe('MusicService', () => {
  describe('createSong', () => {
    it('should create a new song', async () => {
      const service = new MusicService();
      const song = await service.createSong(userId, songData);
      expect(song.id).toBeDefined();
      expect(song.title).toBe(songData.title);
    });

    it('should throw error for invalid data', async () => {
      const service = new MusicService();
      await expect(
        service.createSong(userId, invalidData)
      ).rejects.toThrow();
    });
  });
});
```

### Integration Tests

Test API endpoints:
```typescript
describe('POST /api/v1/music/songs', () => {
  it('should create a song', async () => {
    const response = await request(app)
      .post('/api/v1/music/songs')
      .set('Authorization', `Bearer ${token}`)
      .send(songData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### Test Coverage

- Aim for >80% code coverage
- Test both success and error cases
- Test edge cases and boundary conditions
- Mock external dependencies

## Documentation

### Code Documentation

Add JSDoc comments for public APIs:
```typescript
/**
 * Creates a new song in the system
 * @param artistId - The ID of the artist creating the song
 * @param data - Song data including title, duration, genre
 * @returns Created song object
 * @throws {AppError} If artist is not verified
 */
async createSong(artistId: string, data: Partial<Song>): Promise<Song> {
  // ...
}
```

### API Documentation

Update API docs when adding/modifying endpoints:
- Add endpoint description
- Document request/response formats
- Include example requests and responses
- Note authentication requirements

### README Updates

Update README.md when:
- Adding new features
- Changing installation steps
- Modifying configuration options
- Adding new dependencies

## Project Structure

```
skull-x-bones/
├── src/
│   ├── api/              # Route handlers
│   ├── services/         # Business logic
│   │   ├── music/
│   │   ├── esports/
│   │   ├── marketplace/
│   │   ├── ticketing/
│   │   ├── streaming/
│   │   └── forums/
│   ├── models/           # Data models
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── config/           # Configuration
├── docs/                 # Documentation
├── tests/                # Test files
├── scripts/              # Utility scripts
└── infrastructure/       # Deployment configs
```

## Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review code quality and design
3. **Testing**: Changes are tested in staging environment
4. **Approval**: At least one maintainer approval required
5. **Merge**: Squash and merge to main branch

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Community

- **Discord**: Join our developer community
- **GitHub Discussions**: Ask questions and share ideas
- **Twitter**: Follow @SkullXBonesEco for updates

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Questions?

If you have questions about contributing:
- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Contact maintainers

Thank you for contributing to Skull x Bones! 🎵🎮🛒

---

**Maintainers**: UBZ Entertainment Team
**Last Updated**: February 16, 2026
