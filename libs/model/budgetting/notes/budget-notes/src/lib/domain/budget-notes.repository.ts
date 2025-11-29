/**
 * Budget Notes Repository Interface
 * 
 */

export interface BudgetNote {
  id: string;
  budgetId: string;
  content: string;
  authorId: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IBudgetNotesRepository {
  /**
   * @param 
   * @param 
   * @param 
   * @param 
   * @returns 
   */
  addNote(
    budgetId: string, 
    content: string, 
    authorId: string, 
    timestamp: Date
  ): Promise<string>;

  /**
   * Retrieves all notes for a specific budget
   * @param 
   * @returns 
   */
  getNotesByBudgetId(budgetId: string): Promise<BudgetNote[]>;

  /**
   * Retrieves a specific note by ID
   * @param
   * @returns 
   */
  getNoteById(noteId: string): Promise<BudgetNote | null>;

  /**
   * Updates an existing note
   * @param 
   * @param 
   * @returns 
   */
  updateNote(noteId: string, content: string): Promise<boolean>;

  /**
   * Deletes a note
   * @param 
   * @returns
   */
  deleteNote(noteId: string): Promise<boolean>;
}