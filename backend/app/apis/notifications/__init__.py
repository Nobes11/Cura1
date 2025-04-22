from fastapi import APIRouter, HTTPException, Body, BackgroundTasks
import databutton as db
import re
import requests
import time
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class SMSNotificationRequest(BaseModel):
    message: str
    recipient_type: str = "admin"  # For now only "admin" is supported
    test_mode: bool = False  # If true, this is a test notification

class SMSNotificationResponse(BaseModel):
    success: bool
    message: str

# Store recent notifications to prevent duplicates in quick succession
recent_notifications = {}

def log_notification(message: str, phone: str = None):
    """Log notification to a storage file for audit purposes"""
    try:
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] TO: {phone or 'ADMIN'} - {message}\n"
        
        # Get existing logs
        try:
            logs = db.storage.text.get("notification_logs", default="")
        except:
            logs = ""
            
        # Append new log and save
        logs = log_entry + logs  # Newest at the top
        db.storage.text.put("notification_logs", logs)
    except Exception as e:
        print(f"Error logging notification: {str(e)}")

def send_sms_in_background(message: str, phone: str):
    """Background task to send SMS"""
    try:
        # In a real implementation, we would call an SMS API here like Twilio
        # For now, we're simulating with a log entry
        print(f"[ADMIN SMS NOTIFICATION TO {phone}]: {message}")
        
        # Add a short delay to simulate API call
        time.sleep(1)
        
        # Log the notification
        log_notification(message, phone)
    except Exception as e:
        print(f"Background SMS sending failed: {str(e)}")

@router.post("/notifications/sms")
def send_sms_notification(
    request: SMSNotificationRequest, 
    background_tasks: BackgroundTasks
) -> SMSNotificationResponse:
    """
    Send an SMS notification, currently only to the admin.
    
    In a production environment, this would integrate with a real SMS service like Twilio.
    For this implementation, we'll simulate the SMS by logging the message.
    """
    try:
        # Get admin phone number from secrets
        try:
            admin_phone = db.secrets.get("ADMIN_PHONE_NUMBER")
        except:
            admin_phone = None
        
        # Check for duplicate notifications within 60 seconds (except for test mode)
        if not request.test_mode:
            message_key = f"{request.recipient_type}:{request.message}"
            current_time = time.time()
            
            if message_key in recent_notifications:
                last_time = recent_notifications[message_key]
                if current_time - last_time < 60:  # 60 seconds throttle
                    return SMSNotificationResponse(
                        success=True,
                        message="Duplicate notification suppressed (sent within last minute)"
                    )
            
            # Update recent notifications record
            recent_notifications[message_key] = current_time
        
        if not admin_phone:
            # For development, just log the message
            print(f"[ADMIN SMS NOTIFICATION (no phone)]: {request.message}")
            log_notification(request.message)
            return SMSNotificationResponse(
                success=True,
                message="SMS notification would be sent to admin (simulated - no phone number available)"
            )
        
        # Schedule SMS sending in background
        background_tasks.add_task(send_sms_in_background, request.message, admin_phone)
        
        return SMSNotificationResponse(
            success=True,
            message=f"SMS notification scheduled to be sent to admin"
        )
        
    except Exception as e:
        print(f"Error sending SMS notification: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send SMS notification: {str(e)}")

@router.get("/notifications/logs")
def get_notification_logs() -> dict:
    """
    Retrieve the notification logs
    """
    try:
        logs = db.storage.text.get("notification_logs", default="No notifications logged yet.")
        return {"logs": logs}
    except Exception as e:
        print(f"Error retrieving notification logs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve notification logs: {str(e)}")
