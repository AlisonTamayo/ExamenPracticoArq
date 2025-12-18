/**
 * Domain Entity: User
 * Represents a user in the system with business rules and validation
 * This is part of the Domain Layer (innermost layer in Clean Architecture)
 */

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date
  ) {
    this.validateEmail(email);
    this.validateName(name);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }
  }

  /**
   * Creates a new User instance with updated name
   * Entities in Clean Architecture are immutable
   */
  public updateName(newName: string): User {
    return new User(this.id, newName, this.email, this.createdAt);
  }

  /**
   * Business logic: Check if user is recently created (within last 24 hours)
   */
  public isNewUser(): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return this.createdAt > oneDayAgo;
  }

  /**
   * Convert entity to plain object for serialization
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      isNew: this.isNewUser()
    };
  }
}
