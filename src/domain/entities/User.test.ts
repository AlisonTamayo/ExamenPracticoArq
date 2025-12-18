/**
 * Unit Tests for User Entity
 */

import { User } from './User';

describe('User Entity', () => {
  describe('Constructor and Validation', () => {
    it('should create a valid user', () => {
      const user = new User('123', 'John Doe', 'john@example.com', new Date());
      
      expect(user.id).toBe('123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new User('123', 'John Doe', 'invalid-email', new Date());
      }).toThrow('Invalid email format');
    });

    it('should throw error for short name', () => {
      expect(() => {
        new User('123', 'J', 'john@example.com', new Date());
      }).toThrow('Name must be at least 2 characters long');
    });

    it('should throw error for empty name', () => {
      expect(() => {
        new User('123', '', 'john@example.com', new Date());
      }).toThrow('Name must be at least 2 characters long');
    });
  });

  describe('updateName', () => {
    it('should return new user instance with updated name', () => {
      const originalUser = new User('123', 'John Doe', 'john@example.com', new Date());
      const updatedUser = originalUser.updateName('Jane Doe');

      expect(updatedUser.name).toBe('Jane Doe');
      expect(updatedUser.id).toBe(originalUser.id);
      expect(updatedUser.email).toBe(originalUser.email);
      expect(originalUser.name).toBe('John Doe'); // Original should be unchanged
    });

    it('should validate the new name', () => {
      const user = new User('123', 'John Doe', 'john@example.com', new Date());
      
      expect(() => {
        user.updateName('J');
      }).toThrow('Name must be at least 2 characters long');
    });
  });

  describe('isNewUser', () => {
    it('should return true for recently created user', () => {
      const now = new Date();
      const user = new User('123', 'John Doe', 'john@example.com', now);
      
      expect(user.isNewUser()).toBe(true);
    });

    it('should return false for old user', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const user = new User('123', 'John Doe', 'john@example.com', twoDaysAgo);
      
      expect(user.isNewUser()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize user to JSON format', () => {
      const date = new Date('2024-01-01T00:00:00.000Z');
      const user = new User('123', 'John Doe', 'john@example.com', date);
      const json = user.toJSON();

      expect(json).toEqual({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
        isNew: false
      });
    });
  });
});
