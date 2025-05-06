import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AnalysisService } from './analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AnalysisService]
    });
    service = TestBed.inject(AnalysisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call analyzeRequirements and return data', () => {
    const mockRequest = {
      requirements: [{ displayId: 'REQ-1', text: 'Sample requirement' }],
      options: {
        analysisTypes: ['quality', 'similarity'],
        mode: 'standard',
        configurationId: 'config-1',
        report: { format: 'pdf', includeDetails: true, sections: ['summary', 'details'] }
      }
    };
    const mockResponse = {
      overallScore: 90,
      warningCount: 1,
      units: { count: 1, items: [{ id: 'unit-1', name: 'Unit 1' }] },
      terms: { count: 1, items: [{ id: 'term-1', name: 'Term 1' }] },
      quality: { score: 90, issues: [{ id: 'issue-1', description: 'Issue 1' }] },
      similarity: { score: 0.9, matches: [{ id: 'match-1', description: 'Match 1' }] }
    };

    service.analyzeRequirements(mockRequest).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/v1/analysis');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
}); 