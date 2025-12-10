# Copilot Instructions for ha-lightherapy

This repository contains a Home Assistant custom integration for light therapy.

## Project Overview

This is a Home Assistant custom integration that controls the mood in the room by controlling the lights with color schemes.

## Development Guidelines

### Code Style and Standards

- Follow Python PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Write clear, descriptive docstrings for all classes and functions
- Keep code modular and maintainable
- Use meaningful variable and function names

### Home Assistant Integration Best Practices

- Follow Home Assistant's integration development guidelines
- Ensure proper async/await usage for I/O operations
- Implement proper error handling and logging
- Use Home Assistant's entity platform patterns
- Ensure integration is compatible with the latest Home Assistant version
- Follow Home Assistant's config flow patterns for configuration

### Testing

- Write unit tests for all new functionality
- Ensure existing tests pass before submitting changes
- Test integration with actual Home Assistant installation when possible
- Consider edge cases and error conditions

### Documentation

- Update README.md with any new features or configuration options
- Document all configuration parameters
- Include examples in documentation
- Keep changelog updated with notable changes

### Git Workflow

- Use meaningful commit messages
- Keep commits focused and atomic
- Reference issue numbers in commit messages when applicable
- Create feature branches for new work

## File Structure

- Integration code should follow Home Assistant's standard directory structure
- Configuration files belong in the root or appropriate config directories
- Tests should be in a dedicated tests directory
- Documentation should be kept up to date

## Common Tasks

### Adding New Features

1. Plan the feature and consider its impact on existing functionality
2. Implement the feature following Home Assistant patterns
3. Add appropriate tests
4. Update documentation
5. Test thoroughly before submitting

### Bug Fixes

1. Understand and reproduce the bug
2. Write a test that fails due to the bug (if applicable)
3. Fix the bug with minimal changes
4. Ensure all tests pass
5. Update documentation if the fix changes behavior

### Code Reviews

- Look for adherence to Home Assistant best practices
- Check for proper error handling
- Verify test coverage
- Ensure documentation is updated
- Check for potential performance issues

## Additional Notes

- This is a custom Home Assistant integration, not a core integration
- Users will install this as a custom component
- Consider backward compatibility when making changes
- Be mindful of Home Assistant version compatibility
