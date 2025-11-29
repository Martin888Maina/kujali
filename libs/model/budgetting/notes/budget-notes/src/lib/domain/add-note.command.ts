/**
 * Command: Add Note to Budget
 * 
 * Represents the intention to add a note to a specific budget.
 * This follows the CQRS Command pattern where commands encapsulate
 * all data needed to perform a state-changing operation.
 */

export interface AddNoteToBudgetResult {
  success: boolean;
  noteId?: string;
  error?: string;
}

export class AddNoteToBudgetCommand {
  constructor(
    public readonly budgetId: string,
    public readonly noteContent: string,
    public readonly authorId: string,
    public readonly timestamp: Date = new Date()
  ) {
    this.validate();
  }

  /**
   * Validates the command data before execution
   * Throws an error if validation fails
   */
  private validate(): void {
    if (!this.budgetId || this.budgetId.trim() === '') {
      throw new Error('Budget ID is required');
    }

    if (!this.noteContent || this.noteContent.trim() === '') {
      throw new Error('Note content cannot be empty');
    }

    if (this.noteContent.length > 5000) {
      throw new Error('Note content exceeds maximum length of 5000 characters');
    }

    if (!this.authorId || this.authorId.trim() === '') {
      throw new Error('Author ID is required');
    }

    if (!(this.timestamp instanceof Date) || isNaN(this.timestamp.getTime())) {
      throw new Error('Invalid timestamp');
    }
  }

  /**
   * Returns a plain object representation of the command
   * Useful for serialization and logging
   */
  toJSON() {
    return {
      budgetId: this.budgetId,
      noteContent: this.noteContent,
      authorId: this.authorId,
      timestamp: this.timestamp.toISOString()
    };
  }
}
