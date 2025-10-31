# Contributing to Agni-AI

Thank you for your interest in contributing to Agni-AI! We welcome contributions from developers of all skill levels. This document provides guidelines and instructions for contributing to the project.

## 📋 Code of Conduct

Please be respectful and professional in all interactions. We are committed to providing a welcoming and inclusive environment for all contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Agni-AI.git
   cd Agni-AI
   ```
3. **Create a new branch** for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 💻 Development Setup

### Backend Development

```bash
cd backend
bun install
bun run index.ts
```

Ensure:
- Ollama is running locally
- The `gpt-oss:120b-cloud` model is available in Ollama
- The backend server starts on `http://0.0.0.0:3000`

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at the URL shown in your terminal.

## 📝 Making Changes

### Code Style Guidelines

1. **TypeScript**: Use TypeScript for all new code
   - Enable strict mode in `tsconfig.json`
   - Use meaningful variable and function names
   - Add type annotations for function parameters and return values

2. **Formatting**:
   - Use 2 spaces for indentation
   - Use semicolons at the end of statements
   - Follow existing code patterns in the repository

3. **Comments**:
   - Add comments for complex logic
   - Document function purposes and parameters
   - Keep comments concise and up-to-date

### Backend Modifications

- Keep the Hono server lean and performant
- Test all API endpoints thoroughly
- Update `systemprompt.md` if AI behavior changes
- Document new tools in the Tools System section of README.md
- Ensure CORS and security headers are properly configured

### Frontend Modifications

- Use Astro best practices and component patterns
- Keep components modular and reusable
- Ensure responsive design for all screen sizes
- Test cross-browser compatibility

### System Prompt Changes

If modifying `backend/systemprompt.md`:
- Maintain consistency with the AI's core identity
- Clearly document any behavioral changes
- Update the README if prompt changes affect functionality

### Tools System

When adding new tools:
1. Create the tool file in `backend/tools/` with proper TypeScript types
2. Export the tool as a `Tool` type
3. Document the tool's purpose and parameters
4. Update the README.md "Tools System" section
5. Test tool execution in the chat endpoint

## 🧪 Testing

- Test all changes locally before submitting
- Verify backend endpoints work correctly with sample requests
- Test frontend components in different browsers
- Ensure no console errors or warnings

## 📤 Submitting Changes

1. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new feature description"
   git commit -m "fix: resolve issue with X"
   ```

2. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Reference any related issues
   - Describe the changes you made
   - Explain why these changes are needed

### Pull Request Template

```
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] System prompt improvement
- [ ] Tool addition

## Related Issues
Closes #(issue number)

## Testing
- [ ] Tested locally on backend
- [ ] Tested locally on frontend
- [ ] No new warnings/errors

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Comments added for complex logic
- [ ] Documentation updated if needed
```

## 🐛 Reporting Issues

If you find a bug or have a suggestion:

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear, descriptive title
   - Step-by-step reproduction (for bugs)
   - Expected vs actual behavior
   - Your environment details (OS, Node/Bun version, etc.)

## 📚 Documentation

- Update README.md if you add new features or change functionality
- Add inline comments for complex code
- Document new API endpoints with request/response examples
- Keep this CONTRIBUTING.md updated

## 🔄 Commit Message Convention

Use the following format for commit messages:

- `feat: add new feature` - New features
- `fix: resolve bug X` - Bug fixes
- `docs: update README` - Documentation changes
- `refactor: improve X` - Code refactoring
- `test: add test for X` - Test additions
- `chore: update dependencies` - Maintenance tasks

## ✅ Review Process

1. A maintainer will review your PR
2. Changes may be requested
3. Once approved, your PR will be merged
4. Your contribution will be credited

## 🙏 Thank You

We appreciate your contributions! Every improvement, whether it's code, documentation, or bug reports, helps make Agni-AI better.

---

For questions or need help, feel free to open an issue or contact the maintainers.

Happy coding! 🔥
