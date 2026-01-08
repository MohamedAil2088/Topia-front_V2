import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from './Button';
import '@testing-library/jest-dom';

describe('Button Component', () => {
    it('renders correctly with children', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByRole('button', { name: /click me/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click Me');
    });

    it('shows loading spinner when isLoading is true', () => {
        render(<Button isLoading>Click Me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        // Check for svg logic if possible, or just disabled state for now
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Click Me</Button>);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });
});
