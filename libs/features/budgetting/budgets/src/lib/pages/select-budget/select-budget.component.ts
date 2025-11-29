import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { MatDialog } from '@angular/material/dialog';

import { cloneDeep as ___cloneDeep, flatMap as __flatMap } from 'lodash';

import { combineLatest, map } from 'rxjs';

import { Logger } from '@iote/bricks-angular';

import { Budget, BudgetRecord, BudgetStatus, OrgBudgetsOverview } from '@app/model/finance/planning/budgets';

import { BudgetsStore, OrgBudgetsStore } from '@app/state/finance/budgetting/budgets';

import { CreateBudgetModalComponent } from '../../components/create-budget-modal/create-budget-modal.component';

@Component({
  selector: 'app-select-budget',
  templateUrl: './select-budget.component.html',
  styleUrls: ['./select-budget.component.scss', 
              '../../components/budget-view-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectBudgetPageComponent
{
  
  private _orgBudgets$$ = inject(OrgBudgetsStore);
  private _budgets$$ = inject(BudgetsStore);
  private _dialog = inject(MatDialog);
  private _logger = inject(Logger);

  // Convert Observables to Signals
  overview = toSignal(this._orgBudgets$$.get(), {
    initialValue: null as OrgBudgetsOverview | null
  });

  sharedBudgets = toSignal(this._budgets$$.get(), {
    initialValue: [] as any[]
  });

  allBudgets = toSignal(
    combineLatest([this._orgBudgets$$.get(), this._budgets$$.get()])
      .pipe(
        map(([overview, budgets]) => ({
          overview: __flatMap(overview), 
          budgets: __flatMap(budgets)
        })),
        map((overview) => {
          const trBudgets = overview.budgets.map((budget: any) => {
            budget['endYear'] = budget.startYear + budget.duration - 1;
            return budget;
          });
          return { overview: overview.overview, budgets: trBudgets };
        })
      ),
    { initialValue: { overview: [] as BudgetRecord[], budgets: [] as any[] } }
  );

  
  showFilter = signal(false);

  
  hasBudgets = computed(() => {
    const budgets = this.allBudgets();
    return budgets && budgets.budgets.length > 0;
  });

  budgetCount = computed(() => {
    const budgets = this.allBudgets();
    return budgets ? budgets.budgets.length : 0;
  });

  constructor() {
   
    effect(() => {
      const budgets = this.allBudgets();
      if (budgets && budgets.budgets.length > 0) {
        this._logger.log(() => `Loaded ${budgets.budgets.length} budgets`);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   
  }

  fieldsFilter(value: any) {
    
  }

  toggleFilter(value: boolean) {
    this.showFilter.set(value);
  }

  openDialog(parent: Budget | false): void {
    const dialog = this._dialog.open(CreateBudgetModalComponent, {
      height: 'fit-content',
      width: '600px',
      data: parent != null ? parent : false
    });

    dialog.afterClosed().subscribe(() => {
     
    });
  }
  
  canPromote(record: BudgetRecord) {
    return (record.budget as any).canBeActivated;
  }

  setActive(record: BudgetRecord) {
    const toSave = ___cloneDeep(record.budget);
    
    delete (toSave as any).canBeActivated;
    delete (toSave as any).access;
    
    toSave.status = BudgetStatus.InUse;
    (record as any).updating = true;
    
    this._budgets$$.update(toSave).subscribe(() => {
      (record as any).updating = false;
      this._logger.log(() => `Updated Budget with id ${toSave.id}. Set as an active budget for this org.`);
    });
  }
}