import { Routes } from '@angular/router';
import { AnalyzerComponent } from './components/analyzer/analyzer.component';

export const routes: Routes = [
  { path: '', component: AnalyzerComponent },
  { path: '**', redirectTo: '' }
];
