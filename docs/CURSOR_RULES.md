# Cursor Rules

## Code Style and Formatting

1. **Naming Conventions**
   - Use PascalCase for React components
   - Use camelCase for variables and functions
   - Use UPPER_SNAKE_CASE for constants
   - Use kebab-case for file names

2. **File Structure**
   - One component per file
   - Group related components in feature directories
   - Keep utility functions in separate utils directory

3. **Component Organization**
   - Imports
   - Type definitions
   - Component definition
   - Styles (if using CSS-in-JS)
   - Export statement

4. **Code Formatting**
   - Use 2 spaces for indentation
   - Maximum line length: 100 characters
   - Use semicolons
   - Use single quotes for strings

## Best Practices

1. **TypeScript**
   - Use explicit type annotations
   - Avoid `any` type
   - Use interfaces for object types
   - Use type for union types

2. **React**
   - Use functional components
   - Use hooks for state management
   - Implement proper error boundaries
   - Use React.memo for performance optimization

3. **State Management**
   - Use React Context for global state
   - Keep component state minimal
   - Use proper state initialization

4. **Testing**
   - Write unit tests for utilities
   - Write integration tests for components
   - Maintain good test coverage

## Git Workflow

1. **Branching**
   - main: production-ready code
   - develop: integration branch
   - feature/*: new features
   - bugfix/*: bug fixes
   - release/*: release preparation

2. **Commit Messages**
   - Use conventional commits format
   - Include ticket number if applicable
   - Keep commits atomic and focused

3. **Pull Requests**
   - Include description of changes
   - Reference related issues
   - Request review from team members
   - Ensure CI passes before merging