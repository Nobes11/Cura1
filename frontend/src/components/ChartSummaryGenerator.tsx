import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Brain, Download, Copy, Share } from "lucide-react";
import { toast } from "sonner";

interface ChartSummaryGeneratorProps {
  patientId: string;
  patientName: string;
  onGenerateSuccess?: (summary: string) => void;
}

export function ChartSummaryGenerator({ patientId, patientName, onGenerateSuccess }: ChartSummaryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<Date | null>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate summary
    try {
      // In a real implementation, this would be an API call to the backend
      // const response = await brain.generate_chart_summary({ patientId });
      // const data = await response.json();
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock generated summary
      const mockSummary = `# Chart Summary for ${patientName}

## Reason for Visit
Chest pain, shortness of breath, and fatigue for 2 days.

## Key Vitals
- Temperature: 99.1°F
- Heart Rate: 86 bpm
- Blood Pressure: 128/84 mmHg
- Oxygen Saturation: 96%
- Pain Level: 3/10

## Key Lab Results
- Troponin I: 0.04 ng/mL (Slightly elevated)
- Glucose: 130 mg/dL (Elevated)
- WBC: 7.8 K/uL (Normal)

## Active Medications
- Acetaminophen 500mg Q6H PRN
- Ondansetron 4mg Q8H PRN

## Assessment
Patient presenting with atypical chest pain with minimal troponin elevation. Requires further cardiac workup. Has history of hypertension and type 2 diabetes with elevated glucose in this visit.

## Recommendations
1. Serial troponin measurements
2. Cardiology consult
3. Monitor glucose levels`;
      
      setGeneratedSummary(mockSummary);
      setGenerationTime(new Date());
      onGenerateSuccess?.(mockSummary);
      toast.success("Chart summary generated successfully");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Failed to generate chart summary");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedSummary) {
      navigator.clipboard.writeText(generatedSummary);
      toast.success("Summary copied to clipboard");
    }
  };

  const handleDownload = () => {
    if (generatedSummary) {
      const element = document.createElement("a");
      const file = new Blob([generatedSummary], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${patientName.replace(/ /g, "_")}_Chart_Summary_${new Date().toISOString().split("T")[0]}.md`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Summary downloaded");
    }
  };

  const handleShare = () => {
    toast.info("Preparing to share the summary...");
    // In a real implementation, this would open a dialog to share the summary with other providers
    alert("This would open a dialog to share the summary with other providers");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <span>AI Chart Summary</span>
          </div>
          {generationTime && (
            <Badge variant="outline" className="text-xs">
              Generated {generationTime.toLocaleTimeString()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!generatedSummary ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-slate-500 mb-4 text-center max-w-md">
              Generate a comprehensive AI summary of this patient's chart, including reason for visit, key vitals, labs, and medications.
            </p>
            <Button
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Summarize Chart
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload}>
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare}>
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
            <div className="border rounded-md p-4 prose prose-slate max-w-none">
              {generatedSummary.split("\n").map((line, index) => {
                if (line.startsWith("# ")) {
                  return <h1 key={index} className="text-xl font-bold mt-0 mb-4">{line.replace("# ", "")}</h1>;
                } else if (line.startsWith("## ")) {
                  return <h2 key={index} className="text-lg font-semibold mt-4 mb-2">{line.replace("## ", "")}</h2>;
                } else if (line.startsWith("- ")) {
                  return <li key={index} className="ml-4">{line.replace("- ", "")}</li>;
                } else if (line === "") {
                  return <br key={index} />;
                } else {
                  return <p key={index} className="my-2">{line}</p>;
                }
              })}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                variant="outline"
                className="text-sm"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>Regenerate Summary</>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
