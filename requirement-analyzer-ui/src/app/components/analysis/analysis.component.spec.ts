import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AnalysisComponent } from './analysis.component';
import { AnalysisService } from '../../services/analysis.service';
import { of, throwError } from 'rxjs';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;
  let mockAnalysisService: jasmine.SpyObj<AnalysisService>;

  beforeEach(async () => {
    mockAnalysisService = jasmine.createSpyObj('AnalysisService', ['analyzeRequirements']);

    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AnalysisService, useValue: mockAnalysisService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.analysisForm.get('requirements')?.value).toBe('');
    expect(component.analysisForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const requirementsControl = component.analysisForm.get('requirements');
    expect(requirementsControl?.errors?.['required']).toBeTruthy();

    requirementsControl?.setValue('Test requirement');
    expect(requirementsControl?.errors).toBeNull();
  });

  it('should call analyzeRequirements service on form submit', () => {
    const mockResponse = {
      overallScore: 90,
      warningCount: 1,
      units: { count: 1, items: [] },
      terms: { count: 1, items: [] },
      quality: { score: 90, issues: [] },
      similarity: { score: 0.9, matches: [] }
    };

    mockAnalysisService.analyzeRequirements.and.returnValue(of(mockResponse));

    component.analysisForm.patchValue({
      requirements: 'Test requirement',
      options: {
        analysisTypes: ['quality'],
        mode: 'standard'
      }
    });

    component.onSubmit();

    expect(mockAnalysisService.analyzeRequirements).toHaveBeenCalled();
    expect(component.result).toEqual(mockResponse);
    expect(component.error).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  it('should handle service errors', () => {
    const errorMessage = 'API Error';
    mockAnalysisService.analyzeRequirements.and.returnValue(throwError(() => new Error(errorMessage)));

    component.analysisForm.patchValue({
      requirements: 'Test requirement',
      options: {
        analysisTypes: ['quality'],
        mode: 'standard'
      }
    });

    component.onSubmit();

    expect(component.error).toBe(errorMessage);
    expect(component.result).toBeNull();
    expect(component.isLoading).toBeFalse();
  });

  it('should show loading state during analysis', () => {
    const mockResponse = {
      overallScore: 90,
      warningCount: 0
    };

    mockAnalysisService.analyzeRequirements.and.returnValue(of(mockResponse));

    component.analysisForm.patchValue({
      requirements: 'Test requirement',
      options: {
        analysisTypes: ['quality'],
        mode: 'standard'
      }
    });

    component.onSubmit();

    expect(component.isLoading).toBeFalse();
  });

  it('should reset form and results', () => {
    component.result = {
      overallScore: 90,
      warningCount: 0
    };
    component.error = 'Previous error';

    component.resetForm();

    expect(component.analysisForm.pristine).toBeTrue();
    expect(component.result).toBeNull();
    expect(component.error).toBeNull();
  });
}); 