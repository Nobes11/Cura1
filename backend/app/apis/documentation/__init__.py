from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Dict, Optional, Any, Union
import databutton as db
import json
import re
from datetime import datetime

router = APIRouter()

# Helpers
def sanitize_storage_key(key: str) -> str:
    """Sanitize storage key to only allow alphanumeric and ._- symbols"""
    return re.sub(r'[^a-zA-Z0-9._-]', '', key)

# Enum for template types
class TemplateType(str, Enum):
    REVIEW_OF_SYSTEMS = "reviewOfSystems"
    CHIEF_COMPLAINT = "chiefComplaint"
    PHYSICAL_EXAM = "physicalExam"
    ASSESSMENT_PLAN = "assessmentPlan"

# Base template model
class BaseTemplate(BaseModel):
    id: str
    name: str
    type: TemplateType
    description: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

# Models for template components
class Finding(BaseModel):
    id: str
    name: str
    normal: bool = True
    value: Optional[str] = None

class Section(BaseModel):
    id: str
    name: str
    findings: List[Finding]

# Specific template types
class ROSTemplate(BaseTemplate):
    type: TemplateType = TemplateType.REVIEW_OF_SYSTEMS
    sections: List[Section]

class ChiefComplaintTemplate(BaseTemplate):
    type: TemplateType = TemplateType.CHIEF_COMPLAINT
    fields: List[Dict[str, Any]]

class PhysicalExamTemplate(BaseTemplate):
    type: TemplateType = TemplateType.PHYSICAL_EXAM
    sections: List[Section]

class AssessmentPlanTemplate(BaseTemplate):
    type: TemplateType = TemplateType.ASSESSMENT_PLAN
    assessment_fields: List[Dict[str, Any]]
    plan_fields: List[Dict[str, Any]]

# Documentation instance models
class DocumentationCreate(BaseModel):
    patient_id: str
    encounter_id: str
    template_id: str
    template_type: TemplateType
    content: Dict[str, Any]
    created_by: str

class Documentation(DocumentationCreate):
    id: str = Field(default_factory=lambda: f"doc-{datetime.now().timestamp()}-{hash(datetime.now().isoformat()) % 10000}")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_by: Optional[str] = None

# Storage keys
TEMPLATE_STORAGE_KEY = "documentation_templates"
DOCUMENTATION_STORAGE_KEY = "documentation_instances"

# Template management
@router.get("/api/documentation/templates")
def get_templates(template_type: Optional[TemplateType] = None):
    """Get all templates or filter by type"""
    try:
        # Load templates from storage or return empty list
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        
        # Filter by type if specified
        if template_type:
            templates = [t for t in templates if t.get("type") == template_type]
            
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load templates: {str(e)}")

@router.get("/api/documentation/templates/{template_id}")
def get_template(template_id: str):
    """Get a specific template by ID"""
    try:
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        for template in templates:
            if template.get("id") == template_id:
                return template
        
        raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to get template: {str(e)}")

@router.post("/api/documentation/templates")
def create_template(template: Union[ROSTemplate, ChiefComplaintTemplate, PhysicalExamTemplate, AssessmentPlanTemplate]):
    """Create a new template"""
    try:
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        
        # Check if template with same ID already exists
        for existing in templates:
            if existing.get("id") == template.id:
                raise HTTPException(status_code=400, detail=f"Template with ID {template.id} already exists")
        
        # Add new template
        templates.append(template.dict())
        db.storage.json.put(TEMPLATE_STORAGE_KEY, templates)
        
        return {"message": "Template created successfully", "template": template}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to create template: {str(e)}")

@router.put("/api/documentation/templates/{template_id}")
def update_template(template_id: str, template: Union[ROSTemplate, ChiefComplaintTemplate, PhysicalExamTemplate, AssessmentPlanTemplate]):
    """Update an existing template"""
    try:
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        
        # Find and update the template
        template_found = False
        for i, existing in enumerate(templates):
            if existing.get("id") == template_id:
                # Update the template
                template_dict = template.dict()
                template_dict["updated_at"] = datetime.now().isoformat()
                templates[i] = template_dict
                template_found = True
                break
        
        if not template_found:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found")
        
        db.storage.json.put(TEMPLATE_STORAGE_KEY, templates)
        
        return {"message": "Template updated successfully", "template": template}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update template: {str(e)}")

@router.delete("/api/documentation/templates/{template_id}")
def delete_template(template_id: str):
    """Delete a template"""
    try:
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        
        # Find and remove the template
        initial_count = len(templates)
        templates = [t for t in templates if t.get("id") != template_id]
        
        if len(templates) == initial_count:
            raise HTTPException(status_code=404, detail=f"Template with ID {template_id} not found")
        
        db.storage.json.put(TEMPLATE_STORAGE_KEY, templates)
        
        return {"message": "Template deleted successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to delete template: {str(e)}")

# Documentation management
@router.post("/api/documentation")
def create_documentation(doc: DocumentationCreate):
    """Create a new documentation instance"""
    try:
        documentation = Documentation(**doc.dict())
        documentations = db.storage.json.get(DOCUMENTATION_STORAGE_KEY, default=[])
        
        # Add new documentation
        documentations.append(documentation.dict())
        db.storage.json.put(DOCUMENTATION_STORAGE_KEY, documentations)
        
        return {"message": "Documentation created successfully", "documentation": documentation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create documentation: {str(e)}")

@router.get("/api/documentation/patient/{patient_id}")
def get_patient_documentations(patient_id: str):
    """Get all documentations for a patient"""
    try:
        documentations = db.storage.json.get(DOCUMENTATION_STORAGE_KEY, default=[])
        
        # Filter by patient_id
        patient_docs = [d for d in documentations if d.get("patient_id") == patient_id]
        
        return {"documentations": patient_docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get patient documentations: {str(e)}")

@router.get("/api/documentation/encounter/{encounter_id}")
def get_encounter_documentations(encounter_id: str):
    """Get all documentations for an encounter"""
    try:
        documentations = db.storage.json.get(DOCUMENTATION_STORAGE_KEY, default=[])
        
        # Filter by encounter_id
        encounter_docs = [d for d in documentations if d.get("encounter_id") == encounter_id]
        
        return {"documentations": encounter_docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get encounter documentations: {str(e)}")

@router.get("/api/documentation/{documentation_id}")
def get_documentation(documentation_id: str):
    """Get a specific documentation by ID"""
    try:
        documentations = db.storage.json.get(DOCUMENTATION_STORAGE_KEY, default=[])
        
        # Find the documentation
        for doc in documentations:
            if doc.get("id") == documentation_id:
                return doc
        
        raise HTTPException(status_code=404, detail=f"Documentation with ID {documentation_id} not found")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to get documentation: {str(e)}")

@router.put("/api/documentation/{documentation_id}")
def update_documentation(documentation_id: str, content: Dict[str, Any], updated_by: str):
    """Update a documentation's content"""
    try:
        documentations = db.storage.json.get(DOCUMENTATION_STORAGE_KEY, default=[])
        
        # Find and update the documentation
        doc_found = False
        for i, doc in enumerate(documentations):
            if doc.get("id") == documentation_id:
                doc["content"] = content
                doc["updated_at"] = datetime.now().isoformat()
                doc["updated_by"] = updated_by
                doc_found = True
                break
        
        if not doc_found:
            raise HTTPException(status_code=404, detail=f"Documentation with ID {documentation_id} not found")
        
        db.storage.json.put(DOCUMENTATION_STORAGE_KEY, documentations)
        
        return {"message": "Documentation updated successfully"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Failed to update documentation: {str(e)}")

# Seed initial data if none exists
@router.post("/api/documentation/seed")
def seed_initial_templates():
    """Seed initial templates if none exist"""
    try:
        templates = db.storage.json.get(TEMPLATE_STORAGE_KEY, default=[])
        
        if not templates:
            # Standard ROS template
            ros_template = ROSTemplate(
                id="ros-template-1",
                name="Standard Review of Systems",
                type=TemplateType.REVIEW_OF_SYSTEMS,
                description="Comprehensive review of all major body systems",
                sections=[
                    Section(
                        id="constitutional",
                        name="Constitutional",
                        findings=[
                            Finding(id="fever", name="Fever", normal=True),
                            Finding(id="chills", name="Chills", normal=True),
                            Finding(id="fatigue", name="Fatigue", normal=True),
                            Finding(id="malaise", name="Malaise", normal=True),
                            Finding(id="weight-loss", name="Weight Loss", normal=True),
                            Finding(id="weight-gain", name="Weight Gain", normal=True)
                        ]
                    ),
                    Section(
                        id="heent",
                        name="HEENT",
                        findings=[
                            Finding(id="headache", name="Headache", normal=True),
                            Finding(id="vision-changes", name="Vision Changes", normal=True),
                            Finding(id="hearing-loss", name="Hearing Loss", normal=True),
                            Finding(id="ear-pain", name="Ear Pain", normal=True),
                            Finding(id="tinnitus", name="Tinnitus", normal=True),
                            Finding(id="nasal-congestion", name="Nasal Congestion", normal=True),
                            Finding(id="sore-throat", name="Sore Throat", normal=True)
                        ]
                    ),
                    Section(
                        id="cardiovascular",
                        name="Cardiovascular",
                        findings=[
                            Finding(id="chest-pain", name="Chest Pain", normal=True),
                            Finding(id="palpitations", name="Palpitations", normal=True),
                            Finding(id="edema", name="Edema", normal=True),
                            Finding(id="orthopnea", name="Orthopnea", normal=True),
                            Finding(id="pnd", name="PND", normal=True)
                        ]
                    ),
                    Section(
                        id="respiratory",
                        name="Respiratory",
                        findings=[
                            Finding(id="shortness-of-breath", name="Shortness of Breath", normal=True),
                            Finding(id="cough", name="Cough", normal=True),
                            Finding(id="wheezing", name="Wheezing", normal=True),
                            Finding(id="hemoptysis", name="Hemoptysis", normal=True)
                        ]
                    )
                ]
            )
            
            # Future: Add more default templates
            
            # Save templates
            templates = [ros_template.dict()]
            db.storage.json.put(TEMPLATE_STORAGE_KEY, templates)
            
            return {"message": "Initial templates seeded successfully", "count": len(templates)}
        
        return {"message": "Templates already exist, skipping seed", "count": len(templates)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed templates: {str(e)}")
