using System.Collections.Generic;

namespace RequirementAnalyzer.API.Models
{
    public class AnalyzeRequirementsResponseV3
    {
        public Units units { get; set; }
        public Terms terms { get; set; }
        public Quality quality { get; set; }
        public List<Similarity> similarity { get; set; }
        public double overallScore { get; set; }
        public long warningCount { get; set; }
    }

    public class Units
    {
        public List<FoundUnit> foundUnits { get; set; }
    }

    public class FoundUnit
    {
        public Unit unit { get; set; }
        public List<RequirementUnitMatch> requirementUnitMatches { get; set; }
    }

    public class Unit
    {
        public string id { get; set; }
        public string name { get; set; }
        public string quantityType { get; set; }
        public List<string> abbreviations { get; set; }
        public bool enabled { get; set; }
        public List<UnitSystem> unitSystems { get; set; }
    }

    public class UnitSystem
    {
        public long id { get; set; }
        public string name { get; set; }
    }

    public class RequirementUnitMatch
    {
        public string requirementId { get; set; }
        public List<UnitMatch> unitMatches { get; set; }
    }

    public class UnitMatch
    {
        public string unit { get; set; }
        public AnalyzedSpan span { get; set; }
    }

    public class Terms
    {
        public List<FoundTerm> foundTerms { get; set; }
        public List<TermsFoundGlossaryTerm> foundGlossaryTerms { get; set; }
    }

    public class FoundTerm
    {
        public string lemma { get; set; }
        public List<PhraseInstance> phraseInstances { get; set; }
        public List<SimilarTerm> similarTerms { get; set; }
    }

    public class PhraseInstance
    {
        public string requirementId { get; set; }
        public AnalyzedSpan span { get; set; }
    }

    public class SimilarTerm
    {
        public string lemma { get; set; }
        public double similarityScore { get; set; }
    }

    public class TermsFoundGlossaryTerm
    {
        public string id { get; set; }
        public string phrase { get; set; }
        public string definition { get; set; }
    }

    public class Quality
    {
        public Summary summary { get; set; }
        public Dictionary<string, Requirement> requirements { get; set; }
    }

    public class Summary
    {
        public double overallScore { get; set; }
        public string overallScoreDisplay { get; set; }
        public long warningCount { get; set; }
        public long alertCount { get; set; }
    }

    public class Requirement
    {
        public string fullText { get; set; }
        public string analyzedText { get; set; }
        public List<AnalyzedSpan> analyzedSpans { get; set; }
        public string displayId { get; set; }
        public long score { get; set; }
        public List<Problem> problems { get; set; }
        public List<RequirementFoundGlossaryTerm> foundGlossaryTerms { get; set; }
        public TemplateAnalysis templateAnalysis { get; set; }
    }

    public class Problem
    {
        public string type { get; set; }
        public List<TriggerWord> triggerWords { get; set; }
    }

    public class TriggerWord
    {
        public string word { get; set; }
        public AnalyzedSpan span { get; set; }
    }

    public class RequirementFoundGlossaryTerm
    {
        public string id { get; set; }
        public AnalyzedSpan span { get; set; }
    }

    public class TemplateAnalysis
    {
        public string templateName { get; set; }
        public string templateType { get; set; }
        public string templateDescription { get; set; }
        public IdentifiedSections identifiedSections { get; set; }
        public List<string> sectionOrder { get; set; }
        public List<TemplateAnalysisProblem> problems { get; set; }
        public List<string> requiredSections { get; set; }
    }

    public class IdentifiedSections
    {
        public List<AnalyzedSpan> imperative { get; set; }
        public List<AnalyzedSpan> systemResponse { get; set; }
        public List<AnalyzedSpan> system { get; set; }
    }

    public class TemplateAnalysisProblem
    {
        public string comment { get; set; }
        public string text { get; set; }
        public AnalyzedSpan span { get; set; }
    }

    public class Similarity
    {
        public string firstRequirementId { get; set; }
        public string secondRequirementId { get; set; }
        public double similarityScore { get; set; }
    }

    public class AnalyzedSpan
    {
        public long start { get; set; }
        public long end { get; set; }
    }
} 