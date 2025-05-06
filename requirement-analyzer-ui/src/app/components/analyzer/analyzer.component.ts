import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalysisService } from '../../services/analysis.service';
import { Requirement, AnalyzeRequirementsResponse, AnalysisHistoryItem, ConfigurationSummary } from '../../models/requirement.model';

@Component({
  selector: 'app-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main-layout">
      <div class="content-layout">
        <!-- Left: History (100% height) -->
        <div class="history-pane">
          <div class="history-header">
            <h2>Analysis History</h2>
          </div>
          <div class="history-list">
            <div *ngFor="let item of analysisHistory; let i = index" 
                 class="history-item" 
                 [class.selected]="selectedHistoryIndex === i"
                 (click)="selectHistory(i)">
              <div class="history-id">{{ item.id | slice:0:8 }}...</div>
              <div class="history-time">{{ item.timestamp | date:'short' }}</div>
              <div class="history-reqs">
                <span *ngFor="let req of item.requirements">{{ req.displayId }}</span>
              </div>
              <div class="history-score">Score: {{ item.overallScore }}</div>
              <div class="history-warnings">Warnings: {{ item.warningCount }}</div>
            </div>
          </div>
        </div>
        <!-- Right: Overview/Details (50vh, absolutely positioned) -->
        <div class="results-pane-wrapper">
          <div class="results-pane" *ngIf="selectedHistoryItem">
            <div class="score-section">
              <div class="overall-score">
                <h3>Overall Score</h3>
                <div class="score-gauge">
                  <div class="score-bar" [style.width.%]="selectedHistoryItem.overallScore * 20"></div>
                </div>
                <span class="score-value">{{ selectedHistoryItem.overallScore }}</span>
              </div>
              <div class="warning-count">
                <h3>Warnings</h3>
                <span class="warning-badge">{{ selectedHistoryItem.warningCount }}</span>
              </div>
            </div>
            <div class="requirements-section">
              <h3>Requirements</h3>
              <ul>
                <li *ngFor="let req of selectedHistoryItem.requirements">
                  <b>{{ req.displayId }}</b>: {{ req.text }}
                </li>
              </ul>
            </div>
            <!-- You can add more details here as needed -->
          </div>
          <div class="new-analysis-form">
            <h2>New Analysis</h2>
            <div class="requirements-list">
              <div *ngFor="let req of requirements; let i = index" class="requirement-item">
                <div class="requirement-header">
                  <input [(ngModel)]="req.displayId" placeholder="Display ID" class="display-id-input">
                  <button (click)="removeRequirement(i)" class="remove-button">Remove</button>
                </div>
                <textarea [(ngModel)]="req.text" placeholder="Requirement text..." class="requirement-text"></textarea>
              </div>
            </div>
            <button (click)="addRequirement()" class="add-button">Add Requirement</button>
            <div class="options-section">
              <h3>Options</h3>
              <div class="option-group">
                <label>Analysis Types:</label>
                <div *ngFor="let type of availableAnalysisTypes">
                  <input #cb type="checkbox"
                         [checked]="options.analysisTypes.includes(type)"
                         (change)="onAnalysisTypeChangeExclusive(type, cb.checked)"
                         name="analysisTypes"> {{ type }}
                </div>
              </div>
              <div class="option-group">
                <label>Mode:</label>
                <select [(ngModel)]="options.mode">
                  <option *ngFor="let mode of availableModes" [value]="mode">{{ mode }}</option>
                </select>
              </div>
              <div class="option-group">
                <label>Configuration:</label>
                <ng-container *ngIf="configLoading">
                  <span>Loading configurations...</span>
                </ng-container>
                <ng-container *ngIf="!configLoading && configError">
                  <span class="config-error">{{ configError }}</span>
                </ng-container>
                <ng-container *ngIf="!configLoading && !configError">
                  <select [(ngModel)]="options.configurationId">
                    <option *ngFor="let config of configurationList" [value]="config.configurationId">
                      {{ config.configurationName }}
                    </option>
                    <option *ngIf="configurationList.length === 0" disabled>No configurations available</option>
                  </select>
                </ng-container>
              </div>
              <div class="option-group">
                <label>Report Sections:</label>
                <div *ngFor="let section of availableReportSections">
                  <input #cb type="checkbox"
                         [checked]="options.report.sections.includes(section)"
                         (change)="onReportSectionChange(section, cb.checked)"
                         name="reportSections"> {{ section }}
                </div>
              </div>
            </div>
            <button (click)="analyzeRequirements()" [disabled]="!canAnalyze()" class="analyze-button">Analyze Requirements</button>
          </div>
        </div>
      </div>
      <!-- Bottom: New Analysis Form (full width) -->
      
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 40px);
      width: 100%;
    }
    .content-layout {
      display: flex;
      flex-direction: row;
      flex: 1 1 auto;
      gap: 1rem;
      min-height: 0;
      position: relative;
      height: 100%;
    }
    .history-pane {
      flex: 0 0 340px;
      max-width: 340px;
      min-width: 260px;
      background: #fafbfc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      height: 90vh;
    }
    .history-header {
      margin-bottom: 1rem;
    }
    .history-list {
      flex: 1 1 auto;
      height: 100vh;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .history-item {
      padding: 0.75rem;
      border-radius: 6px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      cursor: pointer;
      border: 2px solid transparent;
      transition: border 0.2s;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .history-item.selected {
      border: 2px solid #2196F3;
      background: #e3f2fd;
    }
    .history-id {
      font-size: 0.85rem;
      color: #888;
    }
    .history-time {
      font-size: 0.85rem;
      color: #aaa;
    }
    .history-reqs {
      font-size: 0.95rem;
      color: #333;
      display: flex;
      gap: 0.5rem;
    }
    .history-score, .history-warnings {
      font-size: 0.9rem;
      color: #555;
    }
    .results-pane-wrapper {
      flex: 1 1 auto;
      position: relative;
      min-width: 0;
      height: 100%;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      display: flex;
      flex-direction: column;
    }
    .results-pane {
      top: 0;
      left: 0;
      right: 0;
      height: 50vh;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      overflow-y: auto;
      min-width: 0;
      width: 95%;
      z-index: 2;
    }
    .score-section {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .score-gauge {
      width: 200px;
      height: 20px;
      background-color: #eee;
      border-radius: 10px;
      overflow: hidden;
    }
    .score-bar {
      height: 100%;
      background-color: #4CAF50;
      transition: width 0.3s ease;
    }
    .warning-badge {
      background-color: #f44336;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-weight: bold;
    }
    .requirements-section {
      margin-top: 1.5rem;
    }
    .new-analysis-form {
      margin-top: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      padding: 1.5rem 1rem;
      width: 100%;
      max-width: 900px;
      align-self: center;
      max-height: 45vh;
      overflow-y: auto;
    }
    .requirements-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .requirement-item {
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 0.5rem;
      background: #f9f9f9;
    }
    .requirement-header {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .display-id-input {
      flex: 1;
      padding: 0.25rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .requirement-text {
      width: 95%;
      min-height: 30px;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
    }
    .add-button, .remove-button, .analyze-button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      margin-right: 0.5rem;
    }
    .add-button {
      background-color: #4CAF50;
      color: white;
    }
    .remove-button {
      background-color: #f44336;
      color: white;
    }
    .analyze-button {
      background-color: #2196F3;
      color: white;
      margin-top: 0.5rem;
    }
    .analyze-button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .options-section { margin-top: 1.5rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; }
    .option-group { margin-bottom: 1rem; }
    .option-group label { font-weight: 500; margin-right: 0.5rem; }
    .option-group input[type='text'], .option-group select { margin-left: 0.5rem; padding: 0.25rem 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
    .option-group input[type='checkbox'] { margin-right: 0.5rem; }
    @media (max-width: 900px) {
      .main-layout {
        height: auto;
      }
      .content-layout {
        flex-direction: column;
      }
      .history-pane, .results-pane, .new-analysis-form {
        max-width: 100%;
        min-width: 0;
      }
      .results-pane {
        position: static;
        height: auto;
      }
    }
    .config-error { color: #f44336; font-weight: 500; margin-left: 1rem; }
  `]
})
export class AnalyzerComponent implements OnInit {
  requirements: Requirement[] = [{ displayId: '', text: '' }];
  analysisHistory: AnalysisHistoryItem[] = [];
  selectedHistoryIndex: number = 0;
  selectedHistoryItem: AnalysisHistoryItem | null = null;

  // Option values
  availableAnalysisTypes = ['All', 'Default'];
  availableModes = ['Utf8'];
  availableReportSections = ['Requirement', 'Similarity', 'RequirementScore'];

  options = {
    analysisTypes: ['All'],
    mode: 'Utf8',
    configurationId: '',
    report: { sections: ['Requirement', 'Similarity', 'RequirementScore'] }
  };

  configurationList: ConfigurationSummary[] = [];
  configLoading = true;
  configError = '';

  constructor(private analysisService: AnalysisService) {}

  ngOnInit() {
    this.fetchHistory();
    this.analysisService.getConfigurationSummary().subscribe({
      next: (configs) => {
        this.configurationList = configs;
        this.configLoading = false;
        if (configs.length && !this.options.configurationId) {
          this.options.configurationId = configs[0].configurationId;
        }
      },
      error: (err) => {
        this.configError = 'Failed to load configurations.';
        this.configLoading = false;
        console.error('Failed to fetch configuration summary', err);
      }
    });
  }

  addRequirement() {
    this.requirements.push({ displayId: '', text: '' });
  }

  removeRequirement(index: number) {
    this.requirements.splice(index, 1);
  }

  canAnalyze(): boolean {
    return this.requirements.length > 0 &&
      this.requirements.every(req => req.displayId.trim() !== '' && req.text.trim() !== '');
  }

  analyzeRequirements() {
    if (!this.canAnalyze()) return;
    const request = {
      requirements: this.requirements,
      options: this.options
    };
    this.analysisService.analyzeRequirements(request).subscribe({
      next: () => {
        this.fetchHistory();
        this.requirements = [{ displayId: '', text: '' }];
      },
      error: (err) => {
        console.error('Analysis failed:', err);
      }
    });
  }

  fetchHistory() {
    this.analysisService.getAnalysisHistory().subscribe({
      next: (history) => {
        this.analysisHistory = history;
        this.selectedHistoryIndex = 0;
        this.selectedHistoryItem = this.analysisHistory[0] || null;
      },
      error: (err) => {
        console.error('Failed to fetch history', err);
      }
    });
  }

  selectHistory(index: number) {
    this.selectedHistoryIndex = index;
    this.selectedHistoryItem = this.analysisHistory[index];
  }

  onAnalysisTypeChangeExclusive(type: string, checked: boolean) {
    if (type === 'All') {
      if (checked) {
        this.options.analysisTypes = ['All'];
      } else {
        this.options.analysisTypes = [];
      }
    } else {
      // Remove 'All' if any other is checked
      this.options.analysisTypes = this.options.analysisTypes.filter(t => t !== 'All');
      if (checked) {
        if (!this.options.analysisTypes.includes(type)) {
          this.options.analysisTypes.push(type);
        }
      } else {
        this.options.analysisTypes = this.options.analysisTypes.filter(t => t !== type);
      }
    }
  }

  onReportSectionChange(section: string, checked: boolean) {
    if (checked) {
      if (!this.options.report.sections.includes(section)) {
        this.options.report.sections.push(section);
      }
    } else {
      this.options.report.sections = this.options.report.sections.filter(s => s !== section);
    }
  }
} 