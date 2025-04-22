import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, MessageSquare, Pill, ClipboardList } from "lucide-react";
import { PatientHeader } from "components/PatientHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Patient } from "../utils/mockData";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { createActivityStamp, getCurrentUserInitials } from "../utils/auth";
import { ActivityStamp } from "./ActivityStamp";
import { MedicationReconciliation } from "./MedicationReconciliation";

interface Props {
  patient: Patient;
  onClose: () => void;
}

// Helper function to calculate time elapsed
const calculateTimeElapsed = (arrivalTime: string) => {
  const arrival = new Date(arrivalTime);
  const now = new Date();
  const diffMs = now.getTime() - arrival.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const PatientDetail: React.FC<Props> = ({ patient, onClose }) => {
  const navigate = useNavigate();
  
  // Function to directly activate a specific tab or show medication reconciliation
  const activateTab = (tabValue: string) => {
    console.log(`Attempting to activate tab: ${tabValue}`);
    
    // Special handling for medications tab (now a standalone container)
    if (tabValue === 'medications') {
      console.log('Showing medication reconciliation container directly');
      showMedicationReconciliation();
      return true;
    }
    
    // Direct ID-based approach
    const tabButton = document.getElementById(`${tabValue}-tab`);
    if (tabButton) {
      (tabButton as HTMLElement).click();
      console.log(`✓ Activated ${tabValue} tab via direct ID`);
      return true;
    }
    
    // Try to find by attribute selector
    const tabsContainer = document.getElementById('patient-detail-tabs');
    if (tabsContainer) {
      // Find tabs inside the container
      const tabsByValue = tabsContainer.querySelectorAll(`[value="${tabValue}"]`);
      if (tabsByValue.length > 0) {
        (tabsByValue[0] as HTMLElement).click();
        console.log(`✓ Activated ${tabValue} tab via container+value selector`);
        return true;
      }
    }
    
    // Generic selector approach
    const allTabs = document.querySelectorAll('[role="tab"]');
    for (let i = 0; i < allTabs.length; i++) {
      const tab = allTabs[i] as HTMLElement;
      if (tab.getAttribute('value') === tabValue || tab.getAttribute('data-value') === tabValue || tab.textContent?.trim().toLowerCase() === tabValue.toLowerCase()) {
        tab.click();
        console.log(`✓ Activated ${tabValue} tab via role+text scanning`);
        return true;
      }
    }
    
    console.error(`✗ Could not find ${tabValue} tab`);
    return false;
  };
  
  // Function to show medication reconciliation container with enhanced error handling and direct DOM manipulation
  const showMedicationReconciliation = () => {
    console.log('🔍 Attempting to show medication reconciliation container...');
    
    // First, check if container exists, if not create it
    let medicationReconciliation = document.getElementById('medication-reconciliation-container');
    if (!medicationReconciliation) {
      console.log('⚠️ Medication reconciliation container not found, creating it...');
      medicationReconciliation = document.createElement('div');
      medicationReconciliation.id = 'medication-reconciliation-container';
      medicationReconciliation.className = 'mt-4 border rounded-md p-4 border-green-100 bg-white mb-6';
      
      // Find content area to insert container
      const contentArea = document.querySelector('.pb-12, .p-4, .px-4, .py-4');
      if (contentArea) {
        // Insert it at top of content area
        contentArea.prepend(medicationReconciliation);
        console.log('✅ Created and inserted container');
      } else {
        console.error('❌ Could not find content area to insert container');
        return false;
      }

      // Initialize the container with MedicationReconciliation component
      // Since we can't use React directly, we'll insert a placeholder and update it in useEffect
      medicationReconciliation.innerHTML = '<p>Loading medication reconciliation...</p>';
    }
    
    // Get tabs content
    const tabsContent = document.querySelector('.patient-detail-tabs-content');
    
    console.log('✅ Found container, showing it and hiding tabs content...');
    
    // Hide tabs content
    if (tabsContent) {
      (tabsContent as HTMLElement).style.display = 'none';
    }
    
    // Hide all tab panels
    document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
      (panel as HTMLElement).style.display = 'none';
    });
    
    // Show the standalone medication reconciliation container
    medicationReconciliation.style.display = 'block';
    
    // Force React to render MedicationReconciliation in the container
    if (medicationReconciliation.querySelector('h2')?.textContent !== 'Medication Reconciliation') {
      medicationReconciliation.innerHTML = `
        <div id="medication-reconciliation-mount-point">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Medication Reconciliation</h2>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-blue-600 mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Review the patient's home medications and reconcile them with current hospital orders.</span>
            </div>
          </div>
          <div class="mt-4 text-center">
            <p>Loading medications data...</p>
            <div class="mt-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          </div>
        </div>
      `;
    }
    
    // Add back button if it doesn't exist
    if (!document.getElementById('back-to-patient-view')) {
      const backButton = document.createElement('button');
      backButton.id = 'back-to-patient-view';
      backButton.className = 'mb-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm';
      backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Patient View';
      backButton.onclick = () => {
        // Hide reconciliation container
        medicationReconciliation.style.display = 'none';
        
        // Show tabs content
        if (tabsContent) {
          (tabsContent as HTMLElement).style.display = 'block';
        }
        
        // Show the current tab panel
        const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
        if (activeTab) {
          const tabId = activeTab.getAttribute('id');
          if (tabId) {
            const tabPanel = document.querySelector(`[role="tabpanel"][aria-labelledby="${tabId}"]`);
            if (tabPanel) {
              (tabPanel as HTMLElement).style.display = 'block';
            }
          }
        }
        
        // Remove back button
        backButton.remove();
      };
      medicationReconciliation.parentNode?.insertBefore(backButton, medicationReconciliation);
    }
    
    // Ensure medications container is properly rendered with actual data
    setTimeout(() => {
      const mountPoint = document.getElementById('medication-reconciliation-mount-point');
      if (mountPoint && mountPoint.innerHTML.includes('Loading medications data')) {
        // Force rerender of medication reconciliation
        console.log('🔄 Forcing reconciliation component update...');
        const medicationData = patient.homeMedications || [];
        const medsSummary = medicationData.map(med => 
          `<div class="mb-2 p-2 border rounded bg-white">
            <div class="font-medium">${med.name}</div>
            <div class="text-sm text-gray-500">${med.dosage} ${med.frequency}</div>
            <div class="mt-1">${med.reconciled ? 
              '<span class="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Reconciled</span>' : 
              '<span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">Pending</span>'}
            </div>
          </div>`
        ).join('');
        
        mountPoint.innerHTML = `
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Medication Reconciliation</h2>
            <div>
              <button class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Check Interactions
              </button>
              <button class="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Complete Reconciliation
              </button>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 text-blue-600 mr-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>Review the patient's home medications and reconcile them with current hospital orders.</span>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-lg font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2 text-purple-600"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3.5"></path><path d="M22 16c0 4-2.5 6-6 6s-6-2-6-6 2.5-6 6-6 6 2 6 6"></path><path d="M16 14v4"></path><path d="M18 16h-4"></path></svg>
                Home Medications
              </h3>
              <div class="border rounded overflow-hidden">
                ${medicationData.length ? medsSummary : '<div class="text-center p-4 text-gray-500">No home medications recorded</div>'}
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5 mr-2 text-blue-600"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3.5"></path><path d="M22 16c0 4-2.5 6-6 6s-6-2-6-6 2.5-6 6-6 6 2 6 6"></path><path d="M16 14v4"></path><path d="M18 16h-4"></path></svg>
                Hospital Medication Orders
              </h3>
              <div class="border rounded overflow-hidden p-4 text-center text-gray-500">
                ${patient.medicationOrders?.oral?.length ? 'Hospital medication orders available' : 'No medication orders'}
              </div>
            </div>
          </div>
          
          <div class="mt-6">
            <p class="text-sm text-gray-500 mb-2">Click "Reconcile" on individual medications to review and document decisions.</p>
            <p class="text-sm text-blue-500">For full functionality, please use the integrated component.</p>
          </div>
        `;
      }
    }, 100);
    
    return true;
  };
  return (
    <Sheet open={true} onOpenChange={onClose} side="right" className="w-screen">
      <SheetContent className="p-0 w-full max-w-none sm:max-w-none md:max-w-none lg:max-w-none xl:max-w-none 2xl:max-w-none overflow-y-auto" side="right" style={{ width: '100vw', maxWidth: '100vw' }}>
        {/* Persistent navigation bar */}
        <div className="w-full bg-gray-600 text-white border-b border-gray-500 px-4 py-1">
          {/* First row - Main information */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-gray-700 border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="h-8 items-center">
                <span className="text-sm text-gray-200">{patient.name} • MRN: {patient.mrn} • {patient.age} years, {patient.gender}</span>
              </div>
              <Button size="sm" variant="ghost" className="h-6 text-xs text-gray-200 hover:text-white hover:bg-gray-700">
                View Demographics
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 mr-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                  <span>Beds: 12/15</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                  <span>Holding: 3</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                  <span>ED</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Second row - Action buttons */}
          <div className="flex justify-between items-center py-1">
            <div className="flex space-x-2 items-center">
              <span className="font-semibold text-sm text-gray-300">Actions: </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  className="inline-flex items-center text-xs bg-green-600 text-white border-green-600 hover:bg-green-700 hover:text-white h-7"
                  onClick={() => {
                    // Get the reconciliation container and tabs content
                    const medicationReconciliation = document.getElementById('medication-reconciliation-container');
                    const tabsContent = document.querySelector('.patient-detail-tabs-content');
                    
                    if (medicationReconciliation) {
                      // Hide tabs content
                      if (tabsContent) {
                        (tabsContent as HTMLElement).style.display = 'none';
                      }
                      
                      // Hide all tab panels
                      document.querySelectorAll('[role="tabpanel"]').forEach(panel => {
                        (panel as HTMLElement).style.display = 'none';
                      });
                      
                      // Show the medication reconciliation container
                      medicationReconciliation.style.display = 'block';
                      
                      // Add back button if it doesn't exist
                      if (!document.getElementById('back-to-patient-view')) {
                        const backButton = document.createElement('button');
                        backButton.id = 'back-to-patient-view';
                        backButton.className = 'mb-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center text-sm';
                        backButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Back to Patient View';
                        backButton.onclick = () => {
                          // Hide reconciliation container
                          medicationReconciliation.style.display = 'none';
                          
                          // Show tabs content
                          if (tabsContent) {
                            (tabsContent as HTMLElement).style.display = 'block';
                          }
                          
                          // Show the current tab panel
                          const activeTab = document.querySelector('[role="tab"][aria-selected="true"]');
                          if (activeTab) {
                            const tabId = activeTab.getAttribute('id');
                            if (tabId) {
                              const tabPanel = document.querySelector(`[role="tabpanel"][aria-labelledby="${tabId}"]`);
                              if (tabPanel) {
                                (tabPanel as HTMLElement).style.display = 'block';
                              }
                            }
                          }
                          
                          backButton.remove();
                        };
                        medicationReconciliation.parentNode?.insertBefore(backButton, medicationReconciliation);
                      }
                    }
                  }}>
                  <Pill className="mr-1 h-3 w-3" />
                  Reconcile Medications
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="inline-flex items-center text-xs bg-gray-700/30 text-white border-gray-600 hover:bg-gray-700 hover:text-white h-7"
                  onClick={() => {}}>
                  <ClipboardList className="mr-1 h-3 w-3" />
                  Tasks
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          {/* Left navigation panel */}
          <div className="min-w-48 bg-slate-800 text-white" style={{ minHeight: 'calc(100vh - 180px)' }}>
            <nav className="p-2">
              {/* Documentation moved to the top of the navigation panel */}
              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-green-700 rounded cursor-pointer hover:bg-green-600"
                  onClick={() => {
                    const section = document.getElementById('patientDocSubmenu');
                    if (section) {
                      section.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="font-medium">Documentation</span>
                  <Menu className="h-4 w-4" />
                </div>
                <div id="patientDocSubmenu" className="ml-2 mt-1 space-y-1">
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700 bg-slate-700">Notes</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Forms</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Consents</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                  onClick={() => {
                    const section = document.getElementById('patientOrdersSubmenu');
                    if (section) {
                      section.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="font-medium">Orders</span>
                  <Menu className="h-4 w-4" />
                </div>
                <div id="patientOrdersSubmenu" className="hidden ml-2 mt-1 space-y-1">
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Active Orders</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Completed Orders</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Future Orders</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                  onClick={() => {
                    const section = document.getElementById('patientResultsSubmenu');
                    if (section) {
                      section.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="font-medium">Results</span>
                  <Menu className="h-4 w-4" />
                </div>
                <div id="patientResultsSubmenu" className="hidden ml-2 mt-1 space-y-1">
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Lab Results</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Imaging</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Procedures</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                  onClick={() => {
                    const section = document.getElementById('patientChartSubmenu');
                    if (section) {
                      section.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="font-medium">Patient Info</span>
                  <Menu className="h-4 w-4" />
                </div>
                <div id="patientChartSubmenu" className="hidden ml-2 mt-1 space-y-1">
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700" onClick={() => navigate(`/patient-charts?id=${patient.id}`)}>Full Patient Chart</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                  onClick={() => {
                    const section = document.getElementById('patientEncountersSubmenu');
                    if (section) {
                      section.classList.toggle('hidden');
                    }
                  }}
                >
                  <span className="font-medium">Encounters</span>
                  <Menu className="h-4 w-4" />
                </div>
                <div id="patientEncountersSubmenu" className="hidden ml-2 mt-1 space-y-1">
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Current</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Previous</div>
                  <div className="px-3 py-1 rounded cursor-pointer hover:bg-slate-700">Future</div>
                </div>
              </div>

              <div className="mb-3">
                <div 
                  className="flex items-center justify-between px-3 py-2 bg-green-700 rounded cursor-pointer hover:bg-green-600"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Medications button clicked in navigation panel');
                    // Toggle the direct reconciliation container
                    const medicationReconciliation = document.getElementById('medication-reconciliation-direct-render');
                    const button = document.querySelector('#medication-reconciliation-direct-container button');
                    
                    if (medicationReconciliation) {
                      // Show reconciliation
                      medicationReconciliation.style.display = 'block';
                      
                      // Update button text
                      if (button) button.textContent = 'Close Reconciliation';
                      
                      // Scroll to the reconciliation section
                      const container = document.getElementById('medication-reconciliation-direct-container');
                      if (container) container.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <div className="flex items-center">
                    <Pill className="mr-2 h-4 w-4 text-white" />
                    <span className="font-medium">Medications</span>
                    <span className="ml-2 text-xs bg-white text-green-700 px-1.5 py-0.5 rounded-full font-bold" id="medications-reconcile-badge">Reconcile</span>
                  </div>
                  <Menu className="h-4 w-4" />
                </div>
              </div>
            </nav>
          </div>
          
          <div className="flex-1">
    <PatientHeader
      patientName={patient.name}
      patientAge={patient.age}
      patientGender={patient.gender}
      patientMRN={patient.mrn}
      roomNumber={patient.room}
      allergies={patient.allergies || []}
      dnrStatus={patient.dnrStatus || false}
      hipaaContacts={patient.hipaaContacts || []}
      restrictedContacts={patient.restrictedContacts || []}
    />
    <Card className="w-full">
      <CardHeader className="bg-sky-50 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-sky-800">{patient.name}</CardTitle>
            <div className="mt-1 mb-2 inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">Current ED Visit Summary</div>
            <CardDescription className="text-slate-600">
              {patient.age} years, {patient.gender} • MRN: {patient.mrn} • Room: {patient.room}
            </CardDescription>
            <div className="flex mt-2 space-x-2">
              <ActivityStamp actionType="viewed" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        {/* Directly rendered Medication Reconciliation component */}
        <div id="medication-reconciliation-direct-container" className="mb-6 pb-4 border-b border-gray-200">
          <div className="p-3 mb-4 bg-green-100 border border-green-300 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <Pill className="h-5 w-5 text-green-700 mr-2" />
              <span className="font-medium">Medication Reconciliation Required</span>
            </div>
            <Button
              onClick={() => {
                const medicationReconciliation = document.getElementById('medication-reconciliation-direct-render');
                
                if (medicationReconciliation) {
                  // Toggle visibility
                  const isVisible = medicationReconciliation.style.display !== 'none';
                  
                  if (isVisible) {
                    // Hide reconciliation
                    medicationReconciliation.style.display = 'none';
                    
                    // Update button text
                    const button = document.querySelector('#medication-reconciliation-direct-container button');
                    if (button) button.textContent = 'Open Reconciliation';
                  } else {
                    // Show reconciliation
                    medicationReconciliation.style.display = 'block';
                    
                    // Update button text
                    const button = document.querySelector('#medication-reconciliation-direct-container button');
                    if (button) button.textContent = 'Close Reconciliation';
                  }
                }
              }}
              className="bg-green-700 text-white hover:bg-green-800"
            >
              Open Reconciliation
            </Button>
          </div>
          
          {/* Directly rendered medication reconciliation component */}
          <div id="medication-reconciliation-direct-render" style={{display: 'none'}}>
            <MedicationReconciliation patient={patient} onClose={() => {
              const container = document.getElementById('medication-reconciliation-direct-render');
              if (container) container.style.display = 'none';
              
              const button = document.querySelector('#medication-reconciliation-direct-container button');
              if (button) button.textContent = 'Open Reconciliation';
            }} />
          </div>
        </div>
        
        {/* Quick action buttons bar */}
        <div className="flex gap-2 mb-4 bg-sky-100 -mx-6 px-4 pt-2 border-b border-sky-200 pb-1 sticky top-0 z-10">
          <Button variant="ghost" size="sm" className="text-sky-700 hover:text-sky-900 hover:bg-sky-100">
            <span className="mr-1">📋</span> Orders
          </Button>
          {/* Direct Medication Reconciliation Button */}
          <Button 
            variant="default" 
            size="sm" 
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Medication reconciliation quick action button clicked');
              // Toggle the direct reconciliation container
              const medicationReconciliation = document.getElementById('medication-reconciliation-direct-render');
              const button = document.querySelector('#medication-reconciliation-direct-container button');
              
              if (medicationReconciliation) {
                // Show reconciliation
                medicationReconciliation.style.display = 'block';
                
                // Update button text
                if (button) button.textContent = 'Close Reconciliation';
                
                // Scroll to the reconciliation section
                const container = document.getElementById('medication-reconciliation-direct-container');
                if (container) container.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <Pill className="mr-1 h-4 w-4" /> Reconcile Medications
          </Button>
          <Button variant="ghost" size="sm" className="text-sky-700 hover:text-sky-900 hover:bg-sky-100">
            <span className="mr-1">🚪</span> Depart
          </Button>
          <Button variant="ghost" size="sm" className="text-sky-700 hover:text-sky-900 hover:bg-sky-100">
            <span className="mr-1">✉️</span> Message
          </Button>
          <div className="relative group">
            <Button variant="ghost" size="sm" className="text-sky-700 hover:text-sky-900 hover:bg-sky-100">
              <span className="mr-1">📑</span> Quick Documents
            </Button>
            <div className="absolute hidden group-hover:block w-48 bg-white border border-gray-200 shadow-lg rounded-md z-20">
              <div className="p-2 text-sm cursor-pointer hover:bg-gray-100">📝 Intake Form</div>
              <div className="p-2 text-sm cursor-pointer hover:bg-gray-100">🏢 Work Excuse</div>
              <div className="p-2 text-sm cursor-pointer hover:bg-gray-100">🩺 Physical Form</div>
              <div className="p-2 text-sm cursor-pointer hover:bg-gray-100">💊 Prescription</div>
            </div>
          </div>
          <div className="flex items-center ml-auto">
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Time in ED: {calculateTimeElapsed(patient.arrivalTime)}
            </span>
          </div>
        </div>
        
                  {/* Standalone medication reconciliation container */}
          <div id="medication-reconciliation-container" style={{ display: 'none' }} className="mt-4 border rounded-md p-4 border-green-100 bg-white mb-6">
            <MedicationReconciliation patient={patient} />
          </div>
          
          <Tabs defaultValue="clinical" className="mb-6 patient-detail-tabs-content" id="patient-detail-tabs">
          <TabsList className="grid w-full grid-cols-7 bg-sky-100/50 sticky top-12 z-10" id="patient-tabs-list">
            <TabsTrigger value="clinical" id="clinical-tab">Clinical View</TabsTrigger>
            <TabsTrigger value="provider" id="provider-tab">Provider Notes</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          {/* Clinical View Tab Content */}
          <TabsContent value="clinical" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-6 pb-12">
              {/* Allergies Section - Prominently at top */}
              <div className="bg-red-50 p-4 rounded border border-red-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-red-800">Allergies</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs text-red-700 border-red-200 hover:bg-red-100">Add Allergy</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                    <div>
                      <span className="font-medium">Penicillin</span>
                      <span className="text-xs text-gray-500 ml-2">Severe</span>
                    </div>
                    <span className="text-sm text-red-600">Anaphylaxis</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-red-200">
                    <div>
                      <span className="font-medium">Sulfa Drugs</span>
                      <span className="text-xs text-gray-500 ml-2">Moderate</span>
                    </div>
                    <span className="text-sm text-red-600">Rash</span>
                  </div>
                </div>
              </div>
              
              {/* Recent Notes Section */}
              <div className="bg-blue-50 p-4 rounded border border-blue-100 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-blue-800">Recent Notes</h3>
                  <Button variant="outline" size="sm" className="h-7 text-xs">View All</Button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">ED Visit Note</span>
                      <span className="text-xs text-gray-500">04/07/2025</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">Patient presented with chest pain, described as pressure-like, radiating to the left arm. Vitals stable. ECG showed normal sinus rhythm.</p>
                    <div className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">View full note</div>
                  </div>
                  <div className="p-3 bg-white rounded border border-blue-200">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">Office Visit</span>
                      <span className="text-xs text-gray-500">03/15/2025</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">Follow-up for hypertension. BP well-controlled on current medication regimen. Discussed lifestyle modifications.</p>
                    <div className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline">View full note</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div className="md:col-span-8 bg-sky-50 p-4 rounded border border-sky-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sky-800">Vital Signs</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs">New Reading</Button>
                      <Button variant="outline" size="sm" className="h-7 text-xs">Trend View</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-slate-700">BP</p>
                      <p className="text-sky-700">120/80 <span className="text-xs text-slate-500">mmHg</span></p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">HR</p>
                      <p className="text-sky-700">72 <span className="text-xs text-slate-500">bpm</span></p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">RR</p>
                      <p className="text-sky-700">16 <span className="text-xs text-slate-500">/min</span></p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">Temp</p>
                      <p className="text-sky-700">98.6 <span className="text-xs text-slate-500">°F</span></p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-700">SpO2</p>
                      <p className="text-sky-700">99 <span className="text-xs text-slate-500">%</span></p>
                      <p className="text-xs text-slate-500">10:30 AM</p>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-4 bg-green-50 p-4 rounded border border-green-100">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-green-800">Med Administration</h3>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Full MAR</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-1.5 bg-white rounded border border-green-200">
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">Acetaminophen 650mg</p>
                        <p className="text-xs text-slate-500">PO, q4h PRN pain</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Given 2h ago</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-white rounded border border-green-200">
                      <div className="flex-1">
                        <p className="font-medium text-slate-700">Lorazepam 1mg</p>
                        <p className="text-xs text-slate-500">IV, q6h PRN anxiety</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Due in 1h</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Current Encounter Summary with more clinical details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-800">Current Encounter Summary</h3>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Chief Complaint</p>
                        <p className="font-medium text-slate-700">{patient.chiefComplaint}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Arrival</p>
                        <p className="text-slate-700">{new Date(patient.arrivalTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Provider</p>
                        <p className="text-slate-700">{patient.assignedProvider || "UNASSIGNED"}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-slate-600">Status</p>
                        <div className="flex">
                          <StatusBadge status={patient.status} />
                          <span className="ml-2 text-sm text-slate-500">Time: {calculateTimeElapsed(patient.arrivalTime)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600">Priority</p>
                        <PriorityBadge priority={patient.priority} />
                      </div>
                      {patient.disposition && (
                        <div>
                          <p className="text-sm font-medium text-slate-600">Disposition</p>
                          <p className="text-slate-700">{patient.disposition}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Orders and Results Quick View */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4 border-sky-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sky-700">Active Orders</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="text-xs h-7">New Order</Button>
                      <Button variant="outline" size="sm" className="text-xs h-7">View All</Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center p-2 border-b border-dashed border-slate-100 hover:bg-sky-50 rounded transition-colors cursor-pointer">
                        <div>
                          <span className="font-medium">CBC with Differential</span>
                          <div className="text-xs text-slate-500">Lab - Ordered 1h ago</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                      </li>
                      <li className="flex justify-between items-center p-2 border-b border-dashed border-slate-100 hover:bg-sky-50 rounded transition-colors cursor-pointer">
                        <div>
                          <span className="font-medium">Chest X-Ray</span>
                          <div className="text-xs text-slate-500">Radiology - Ordered 2h ago</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-600 text-xs bg-amber-50 px-2 py-0.5 rounded-full">Ordered</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                      </li>
                      <li className="flex justify-between items-center p-2 border-b border-dashed border-slate-100 hover:bg-sky-50 rounded transition-colors cursor-pointer">
                        <div>
                          <span className="font-medium">Acetaminophen 650mg</span>
                          <div className="text-xs text-slate-500">Medication - PO q4h PRN</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">Administered</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="border rounded p-4 border-sky-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sky-700">Lab Results</h3>
                    <Button variant="outline" size="sm" className="text-xs h-7">View All</Button>
                  </div>
                  <div className="text-sm space-y-3">
                    <div className="p-2 border border-sky-100 rounded hover:bg-sky-50 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Comprehensive Metabolic Panel</p>
                          <p className="text-xs text-slate-500">Resulted: 04/08/2025 9:15 AM</p>
                        </div>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">1 Abnormal</span>
                      </div>
                      <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                        <div className="p-1">
                          <p className="font-medium">Sodium</p>
                          <p>139 mmol/L</p>
                        </div>
                        <div className="p-1">
                          <p className="font-medium">Potassium</p>
                          <p>4.1 mmol/L</p>
                        </div>
                        <div className="p-1">
                          <p className="font-medium">Chloride</p>
                          <p>102 mmol/L</p>
                        </div>
                        <div className="p-1 bg-yellow-50 rounded border border-yellow-100">
                          <p className="font-medium">Glucose</p>
                          <p className="text-yellow-800">142 mg/dL ↑</p>
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-blue-600 hover:underline">View complete results</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Clinical Protocols and History */}
              <div className="space-y-4">
                <div className="border rounded p-4 border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-800">Care Protocols & Pathways</h3>
                    <Button variant="outline" size="sm" className="text-xs h-7">New Assessment</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="border rounded-md p-3 flex items-center gap-2 hover:bg-red-50 cursor-pointer transition-colors">
                      <div className="h-6 w-6 bg-red-100 text-red-700 font-bold rounded flex items-center justify-center text-sm">S</div>
                      <div>
                        <p className="font-medium text-sm">Stroke Protocol</p>
                        <p className="text-xs text-slate-500">{patient.isStroke ? 'Active' : 'Not indicated'}</p>
                      </div>
                      <Button size="sm" variant={patient.isStroke ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                        {patient.isStroke ? 'View' : 'Assess'}
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 flex items-center gap-2 hover:bg-purple-50 cursor-pointer transition-colors">
                      <div className="h-6 w-6 bg-purple-100 text-purple-700 font-bold rounded flex items-center justify-center text-sm">SP</div>
                      <div>
                        <p className="font-medium text-sm">Sepsis Protocol</p>
                        <p className="text-xs text-slate-500">{patient.isSepsis ? 'Active' : 'Not indicated'}</p>
                      </div>
                      <Button size="sm" variant={patient.isSepsis ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                        {patient.isSepsis ? 'View' : 'Assess'}
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-3 flex items-center gap-2 hover:bg-yellow-50 cursor-pointer transition-colors">
                      <div className="h-6 w-6 bg-yellow-100 text-yellow-700 font-bold rounded flex items-center justify-center text-sm">F</div>
                      <div>
                        <p className="font-medium text-sm">Fall Risk</p>
                        <p className="text-xs text-slate-500">{patient.isFallRisk ? 'High Risk' : 'Low Risk'}</p>
                      </div>
                      <Button size="sm" variant={patient.isFallRisk ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                        {patient.isFallRisk ? 'Precautions' : 'Assess'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Medical History Section */}
                <div className="border rounded p-4 border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-800">Medical History</h3>
                    <Button variant="outline" size="sm" className="text-xs h-7">Edit</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Past Medical History</h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Hypertension</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Type 2 Diabetes</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Hyperlipidemia</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Osteoarthritis</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Surgical History</h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Appendectomy (2010)</span>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">Right Knee Replacement (2018)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Medications tab has been removed and replaced with standalone container above */}

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 mt-4 hidden">
          <div className="md:col-span-8 bg-sky-50 p-4 rounded border border-sky-100">
            <h3 className="font-medium text-sky-800 mb-3">Vital Signs</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              <div>
                <p className="font-semibold text-slate-700">BP</p>
                <p className="text-sky-700">120/80</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">HR</p>
                <p className="text-sky-700">72</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">RR</p>
                <p className="text-sky-700">16</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">Temp</p>
                <p className="text-sky-700">98.6°F</p>
              </div>
              <div>
                <p className="font-semibold text-slate-700">SpO2</p>
                <p className="text-sky-700">99%</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4 bg-amber-50 p-4 rounded border border-amber-100">
            <h3 className="font-medium text-amber-800 mb-3">Allergies</h3>
            <div className="text-sm">
              <p className="text-amber-700 font-medium">Penicillin - Hives</p>
              <p className="text-amber-700">NKDA</p>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Status</p>
              <StatusBadge status={patient.status} />
        <div className="ml-2">
          <span className="text-xs text-slate-500">Time since arrival: {calculateTimeElapsed(patient.arrivalTime)}</span>
        </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Priority</p>
              <PriorityBadge priority={patient.priority} />
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Provider</p>
              <p className="text-slate-700">{patient.assignedProvider || "UNASSIGNED"}</p>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Chief Complaint</p>
              <p className="text-slate-700">{patient.chiefComplaint}</p>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Arrival Time</p>
              <p className="text-slate-700">{new Date(patient.arrivalTime).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">Last Updated</p>
              <p className="text-slate-700">{new Date(patient.lastUpdated).toLocaleTimeString()}</p>
            </div>
          </div>
          {patient.disposition && (
            <div className="md:col-span-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-600">Disposition</p>
                <p className="text-slate-700">{patient.disposition}</p>
              </div>
            </div>
          )}
          {/* Removed room management/careArea since it can be managed from the board */}
        </div>

          <TabsContent value="provider" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Provider Notes</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Note
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Templates
                  </Button>
                </div>
              </div>
              
              {/* Active note editor */}
              <div className="border rounded p-4 border-sky-100 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-sky-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Current Note
                    <span className="ml-2 text-xs text-slate-500">(Last edited: 10:45 AM)</span>
                  </h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-3">
                    <div className="border-b pb-2">
                      <h5 className="font-medium mb-1 text-sky-800">Chief Complaint</h5>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded min-h-[60px] text-sm"
                        value={patient.chiefComplaint}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="border-b pb-2">
                      <h5 className="font-medium mb-1 text-sky-800">History of Present Illness</h5>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded min-h-[100px] text-sm"
                        value={`Patient presents with ${patient.chiefComplaint.toLowerCase()} that started this morning. Denies fever, chills, nausea, or vomiting. No similar episodes in the past.`}
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="border-b pb-2">
                      <h5 className="font-medium mb-1 text-sky-800">Past Medical History</h5>
                      <div className="flex space-x-2 mb-2">
                        <Button variant="outline" size="sm" className="text-xs h-7 rounded-full">
                          Hypertension +
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 rounded-full">
                          Diabetes +
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 rounded-full">
                          Asthma +
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 bg-slate-100">
                          + Add Condition
                        </Button>
                      </div>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded min-h-[60px] text-sm"
                        placeholder="Type or select from common conditions above"
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div className="border-b pb-2">
                      <h5 className="font-medium mb-1 text-sky-800">Assessment</h5>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded min-h-[80px] text-sm"
                        placeholder="Provider assessment..."
                        onChange={() => {}}
                      />
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-1 text-sky-800">Plan</h5>
                      <textarea 
                        className="w-full p-2 border border-slate-200 rounded min-h-[80px] text-sm"
                        placeholder="Treatment plan..."
                        onChange={() => {}}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4 space-x-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Save Draft
                  </Button>
                  <Button size="sm" className="h-8 text-xs bg-sky-600 hover:bg-sky-700">
                    Complete & Sign
                  </Button>
                </div>
              </div>
              
              <div className="border rounded p-4 border-sky-100 bg-sky-50">
                <h4 className="font-medium mb-3 text-sky-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Previous Notes
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white border border-slate-200 rounded hover:bg-sky-50 cursor-pointer">
                    <div>
                      <p className="font-medium text-sm">ED Visit Note</p>
                      <p className="text-xs text-slate-500">11/03/2024 - Dr. Johnson</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white border border-slate-200 rounded hover:bg-sky-50 cursor-pointer">
                    <div>
                      <p className="font-medium text-sm">Annual Physical</p>
                      <p className="text-xs text-slate-500">01/15/2024 - Dr. Wilson</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="nurse" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Nursing Documentation</h3>
                <Button variant="outline" size="sm">New Assessment</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4 border-sky-100">
                  <h4 className="font-medium mb-2 text-sky-700">Initial Assessment <span className="text-sm text-slate-500">(08:35 AM)</span></h4>
                  <div className="space-y-2">
                    <p><span className="font-medium">Triage Level:</span> {patient.acuity}/5</p>
                    <p><span className="font-medium">Initial Vitals:</span> BP 120/80, HR 72, RR 16, Temp 98.6°F, SpO2 99%</p>
                    <p><span className="font-medium">Pain Score:</span> 7/10</p>
                  </div>
                </div>
                <div className="border rounded p-4 border-sky-100">
                  <h4 className="font-medium mb-2 text-sky-700">Medication Administration</h4>
                  <p className="text-slate-500 italic">No medications administered</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="appointments" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Appointment Notes</h3>
                <Button variant="outline" size="sm">Add Note</Button>
              </div>
              <div className="border rounded p-4 border-sky-100">
                <h4 className="font-medium mb-2 text-sky-700">Current Visit</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Provider:</span> {patient.assignedProvider || "Unassigned"}</p>
                  <p><span className="font-medium">Visit Type:</span> Emergency</p>
                  <p><span className="font-medium">Notes:</span> Patient walked in with {patient.chiefComplaint.toLowerCase()}. Triaged as {patient.acuity}/5.</p>
                </div>
              </div>
              <div className="border rounded p-4 border-sky-100">
                <h4 className="font-medium mb-2 text-sky-700">Past Appointments</h4>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Provider</th>
                      <th className="text-left p-2">Department</th>
                      <th className="text-left p-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">01/15/2025</td>
                      <td className="p-2">Dr. Wilson</td>
                      <td className="p-2">Primary Care</td>
                      <td className="p-2">Annual Physical</td>
                    </tr>
                    <tr>
                      <td className="p-2">11/03/2024</td>
                      <td className="p-2">Dr. Johnson</td>
                      <td className="p-2">Emergency</td>
                      <td className="p-2">Headache</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="documents" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Documents</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Upload</Button>
                  <Button variant="outline" size="sm">Generate Form</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4 border-sky-100">
                  <h4 className="font-medium mb-2 text-sky-700">Clinical Forms</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-sky-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
                      <span className="text-sm">Snellen Eye Exam</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-sky-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
                      <span className="text-sm">Orthostatic Vital Signs</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-sky-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
                      <span className="text-sm">Consent for Treatment</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </Button>
                    </li>
                    <li className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-sky-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>
                      <span className="text-sm">Privacy Practices Acknowledgment</span>
                      <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </Button>
                    </li>
                  </ul>
                </div>
                <div className="border rounded p-4 border-sky-100">
                  <h4 className="font-medium mb-2 text-sky-700">Return to Work/School</h4>
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-2">Date</th>
                        <th className="text-left p-2">Document Type</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2">04/08/2025</td>
                        <td className="p-2">Return to Work Note</td>
                        <td className="p-2">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="encounter" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Patient Encounter</h3>
                <Button variant="outline" size="sm">Add Entry</Button>
              </div>
              <div className="border rounded p-4 border-sky-100">
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <p className="text-sm text-slate-500">08:35 AM - Nurse Jackson</p>
                    <p className="font-medium">Initial Triage</p>
                    <p>Patient presents with {patient.chiefComplaint.toLowerCase()}. Reports pain level of 7/10. Vitals within normal limits.</p>
                  </div>
                  <div className="border-b pb-3">
                    <p className="text-sm text-slate-500">09:10 AM - Dr. {patient.assignedProvider?.split(' ')[1] || 'Johnson'}</p>
                    <p className="font-medium">Initial Assessment</p>
                    <p>Patient examined. No acute distress. History obtained. Plan for diagnostic workup.</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">09:45 AM - Nurse Wilson</p>
                    <p className="font-medium">Medication Administration</p>
                    <p>Patient given Tylenol 650mg PO for pain. Pain score now 5/10.</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="orders" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-sky-800">Orders</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    New Order
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6m-6 7h6m-6 7h6M5 3h12a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Order Sets
                  </Button>
                </div>
              </div>
              
              {/* Order category tabs */}
              <div className="border-b border-slate-200">
                <div className="flex space-x-4">
                  <button className="px-4 py-2 text-sm font-medium text-sky-700 border-b-2 border-sky-500 -mb-px">
                    All Orders
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600">
                    Labs
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600">
                    Imaging
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600">
                    Medications
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-sky-600">
                    Procedures
                  </button>
                </div>
              </div>
              
              {/* Search and filter */}
              <div className="flex items-center justify-between py-2">
                <div className="relative w-64">
                  <input 
                    type="text" 
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500" 
                    placeholder="Search orders..."
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-500">Status:</span>
                  <select className="text-sm border border-slate-300 rounded-md p-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500">
                    <option>All</option>
                    <option>Active</option>
                    <option>Completed</option>
                    <option>Canceled</option>
                  </select>
                </div>
              </div>
              
              {/* Clinical Protocol Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="border rounded-md p-3 flex items-center gap-2">
                  <div className="h-6 w-6 bg-red-100 text-red-700 font-bold rounded flex items-center justify-center text-sm">S</div>
                  <div>
                    <p className="font-medium text-sm">Stroke Protocol</p>
                    <p className="text-xs text-slate-500">{patient.isStroke ? 'Active' : 'Not active'}</p>
                  </div>
                  <Button size="sm" variant={patient.isStroke ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                    {patient.isStroke ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
                
                <div className="border rounded-md p-3 flex items-center gap-2">
                  <div className="h-6 w-6 bg-purple-100 text-purple-700 font-bold rounded flex items-center justify-center text-sm">SP</div>
                  <div>
                    <p className="font-medium text-sm">Sepsis Protocol</p>
                    <p className="text-xs text-slate-500">{patient.isSepsis ? 'Active' : 'Not active'}</p>
                  </div>
                  <Button size="sm" variant={patient.isSepsis ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                    {patient.isSepsis ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
                
                <div className="border rounded-md p-3 flex items-center gap-2">
                  <div className="h-6 w-6 bg-yellow-100 text-yellow-700 font-bold rounded flex items-center justify-center text-sm">F</div>
                  <div>
                    <p className="font-medium text-sm">Fall Risk</p>
                    <p className="text-xs text-slate-500">{patient.isFallRisk ? 'Active' : 'Not active'}</p>
                  </div>
                  <Button size="sm" variant={patient.isFallRisk ? "outline" : "ghost"} className="ml-auto h-7 text-xs">
                    {patient.isFallRisk ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded p-4 border-sky-100 bg-white">
                <h4 className="font-medium mb-4 text-sky-700">Active Orders</h4>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2 font-medium text-slate-700">Time</th>
                      <th className="text-left p-2 font-medium text-slate-700">Order</th>
                      <th className="text-left p-2 font-medium text-slate-700">Status</th>
                      <th className="text-left p-2 font-medium text-slate-700">Provider</th>
                      <th className="text-left p-2 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">08:50 AM</td>
                      <td className="p-2 font-medium">CBC with Differential</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">Pending</span>
                      </td>
                      <td className="p-2 text-slate-600">Dr. {patient.assignedProvider?.split(' ')[1] || 'Johnson'}</td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">08:50 AM</td>
                      <td className="p-2 font-medium">Chest X-Ray</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Ordered</span>
                      </td>
                      <td className="p-2 text-slate-600">Dr. {patient.assignedProvider?.split(' ')[1] || 'Johnson'}</td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">08:32 AM</td>
                      <td className="p-2 font-medium">IV Fluid - Normal Saline</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">In Progress</span>
                      </td>
                      <td className="p-2 text-slate-600">Dr. {patient.assignedProvider?.split(' ')[1] || 'Johnson'}</td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-50" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-50" disabled>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Quick order section */}
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h4 className="font-medium mb-3 text-sky-700">Quick Orders</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start bg-sky-50 border-sky-200 hover:bg-sky-100 text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    ED Standard Labs
                  </Button>
                  <Button variant="outline" className="justify-start bg-sky-50 border-sky-200 hover:bg-sky-100 text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Cardiac Labs
                  </Button>
                  <Button variant="outline" className="justify-start bg-sky-50 border-sky-200 hover:bg-sky-100 text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Pain Medication
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Fluids & Electrolytes
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Consults
                  </Button>
                  <Button variant="outline" className="justify-start text-sm h-auto py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Imaging
                  </Button>
                </div>
              </div>
              
              {/* Medication Administration Record */}
              <div className="border rounded p-4 border-sky-100 bg-white mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium text-sky-700">Medication Administration Record</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Export
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 text-xs bg-sky-50 text-sky-700 hover:bg-sky-100">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 mr-1"><path d="M12 5v14M5 12h14"></path></svg>
                    Add Medication
                  </Button>
                </div>
                
                {/* Medication quick filters */}
                <div className="flex space-x-2 mb-4">
                  <button className="px-3 py-1 text-xs font-medium bg-sky-50 text-sky-700 rounded-full border border-sky-200">All</button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">Due Now</button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">PRN</button>
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">Administered</button>
                </div>
                
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left p-2 font-medium text-slate-700">Time</th>
                      <th className="text-left p-2 font-medium text-slate-700">Medication</th>
                      <th className="text-left p-2 font-medium text-slate-700">Dose</th>
                      <th className="text-left p-2 font-medium text-slate-700">Route</th>
                      <th className="text-left p-2 font-medium text-slate-700">Status</th>
                      <th className="text-left p-2 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">09:15 AM</td>
                      <td className="p-2 font-medium">Acetaminophen</td>
                      <td className="p-2">650mg</td>
                      <td className="p-2">PO</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Administered</span>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">08:30 AM</td>
                      <td className="p-2 font-medium">Morphine</td>
                      <td className="p-2">2mg</td>
                      <td className="p-2">IV</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs">Due</span>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 text-slate-600">09:30 AM</td>
                      <td className="p-2 font-medium">Ondansetron</td>
                      <td className="p-2">4mg</td>
                      <td className="p-2">IV</td>
                      <td className="p-2">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Scheduled</span>
                      </td>
                      <td className="p-2">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="results" className="border rounded-md p-4 mt-4 border-sky-100">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-sky-800">Results</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                    </svg>
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Results quick filters */}
              <div className="flex space-x-2 mb-4">
                <button className="px-3 py-1 text-xs font-medium bg-sky-50 text-sky-700 rounded-full border border-sky-200">All</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">Labs</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">Imaging</button>
                <button className="px-3 py-1 text-xs font-medium text-slate-600 rounded-full border border-slate-200 hover:bg-slate-50">Pending</button>
              </div>
              
              {patient.labsPending ? (
                <div className="border rounded p-4 border-sky-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-sky-700 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        CBC with Differential
                      </h4>
                      <p className="text-sm text-slate-600">Ordered at 08:50 AM</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">No lab results ordered.</p>
              )}
              
              {patient.imagingPending ? (
                <div className="border rounded p-4 border-sky-100 bg-white hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-sky-700 mb-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Chest X-Ray
                      </h4>
                      <p className="text-sm text-slate-600">Ordered at 08:50 AM</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">Pending</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-600">No imaging ordered.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-sky-100 pt-4">
        
        <div className="text-xs text-gray-500">
          All changes are automatically recorded with your initials ({getCurrentUserInitials()})
        </div>
        <div>
          <Button variant="outline" onClick={onClose} className="mr-2">Cancel</Button>
          <Button onClick={() => {
            // In a real application, this would save the changes to the database
            // For now, we'll just close the detail view
            onClose();
          }}>Save Changes</Button>
        </div>
      </CardFooter>
    </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
