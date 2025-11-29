/**
 * Handler: Add Note to Budget
 * 
 */

import { AddNoteToBudgetCommand, AddNoteToBudgetResult } from './add-note.command';

/**
 * Generic Command Handler Interface
 * 
 * Defines the contract that all command handlers must implement.
 */
export interface ICommandHandler<TCommand> {
  /**
   * @param 
   * @returns 
   */
  execute(command: TCommand): Promise<void>;
}

/**
 * Repository interface for budget notes
 */
export interface IBudgetNotesRepository {
  addNote(budgetId: string, content: string, authorId: string, timestamp: Date): Promise<string>;
  getNotesByBudgetId(budgetId: string): Promise<any[]>;
}

/**
 * Toolkit provided by the framework
 */
export interface HandlerToolkit {
  getRepository<T>(repositoryName: string): T;
  logger: {
    log(message: string): void;
    error(message: string, error?: any): void;
  };
}

/**
 * Base class for Function Handlers
 */
export abstract class FunctionHandler<TCommand, TResult> {
  /**
   * @param 
   * @param 
   */
  abstract execute(
    command: TCommand, 
    toolkit: HandlerToolkit
  ): Promise<TResult>;
}

/**
 * AddNoteToBudgetHandler
 * 
 */
export class AddNoteToBudgetHandler 
  extends FunctionHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult> {

  /**
   * 
   * 
   * @param 
   * @param 
   * @returns 
   */
  async execute(
    command: AddNoteToBudgetCommand, 
    toolkit: HandlerToolkit
  ): Promise<AddNoteToBudgetResult> {
    
    try {
      toolkit.logger.log(
        `Executing AddNoteToBudgetCommand for budget: ${command.budgetId}`
      );

      const repository = toolkit.getRepository<IBudgetNotesRepository>(
        'BudgetNotesRepository'
      );

      const noteId = await repository.addNote(
        command.budgetId,
        command.noteContent,
        command.authorId,
        command.timestamp
      );

      toolkit.logger.log(
        `Successfully added note ${noteId} to budget ${command.budgetId}`
      );

      return {
        success: true,
        noteId: noteId
      };

    } catch (error) {
      toolkit.logger.error(
        `Failed to add note to budget ${command.budgetId}`,
        error
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}