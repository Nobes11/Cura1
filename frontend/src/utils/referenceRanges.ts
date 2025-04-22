// Reference ranges for lab values and vitals

export interface ReferenceRange {
  name: string;
  min: number;
  max: number;
  unit: string;
}

export const vitalReferenceRanges: Record<string, ReferenceRange> = {
  systolic: {
    name: "Systolic BP",
    min: 90,
    max: 120,
    unit: "mmHg"
  },
  diastolic: {
    name: "Diastolic BP",
    min: 60,
    max: 80,
    unit: "mmHg"
  },
  heartRate: {
    name: "Heart Rate",
    min: 60,
    max: 100,
    unit: "bpm"
  },
  respiratoryRate: {
    name: "Respiratory Rate",
    min: 12,
    max: 20,
    unit: "rpm"
  },
  temperature: {
    name: "Temperature",
    min: 97,
    max: 99,
    unit: "°F"
  },
  oxygenSaturation: {
    name: "Oxygen Saturation",
    min: 95,
    max: 100,
    unit: "%"
  }
};

export const labReferenceRanges: Record<string, ReferenceRange> = {
  wbc: {
    name: "WBC",
    min: 4.5,
    max: 11.0,
    unit: "K/uL"
  },
  hgb: {
    name: "Hemoglobin",
    min: 13.5,
    max: 17.5,
    unit: "g/dL"
  },
  hct: {
    name: "Hematocrit",
    min: 41,
    max: 50,
    unit: "%"
  },
  plt: {
    name: "Platelets",
    min: 150,
    max: 450,
    unit: "K/uL"
  },
  sodium: {
    name: "Sodium",
    min: 135,
    max: 145,
    unit: "mEq/L"
  },
  potassium: {
    name: "Potassium",
    min: 3.5,
    max: 5.0,
    unit: "mEq/L"
  },
  bun: {
    name: "BUN",
    min: 7,
    max: 20,
    unit: "mg/dL"
  },
  creatinine: {
    name: "Creatinine",
    min: 0.6,
    max: 1.2,
    unit: "mg/dL"
  },
  glucose: {
    name: "Glucose",
    min: 70,
    max: 100,
    unit: "mg/dL"
  }
};

// Check if a value is outside the reference range
export const isAbnormal = (key: string, value: number, isLabValue: boolean = false): boolean => {
  const ranges = isLabValue ? labReferenceRanges : vitalReferenceRanges;
  
  if (!ranges[key]) return false;
  
  return value < ranges[key].min || value > ranges[key].max;
};

// Get the display class based on value comparison to reference range
export const getDisplayClass = (key: string, value: number, isLabValue: boolean = false): string => {
  if (!isAbnormal(key, value, isLabValue)) return "text-slate-700";
  
  // For critical values (significantly outside range)
  const ranges = isLabValue ? labReferenceRanges : vitalReferenceRanges;
  
  if (ranges[key]) {
    const range = ranges[key];
    const criticalLow = range.min - (range.min * 0.15); // 15% below min
    const criticalHigh = range.max + (range.max * 0.15); // 15% above max
    
    if (value <= criticalLow || value >= criticalHigh) {
      return "text-red-600 font-bold";
    }
    
    // For abnormal but not critical values
    return "text-amber-600 font-medium";
  }
  
  return "text-slate-700";
};

// Format a reference range for display
export const formatReferenceRange = (key: string, isLabValue: boolean = false): string => {
  const ranges = isLabValue ? labReferenceRanges : vitalReferenceRanges;
  
  if (!ranges[key]) return "";
  
  return `${ranges[key].min}-${ranges[key].max} ${ranges[key].unit}`;
};
