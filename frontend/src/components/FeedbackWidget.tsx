import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuthStore } from '../utils/authStore';

interface FeedbackWidgetProps {
  className?: string;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>('issue');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { user } = useAuthStore();
  
  // Track mouse position for corner hover detection
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const threshold = 50; // pixels from corner to activate
      const rightEdge = window.innerWidth - e.clientX <= threshold;
      const bottomEdge = window.innerHeight - e.clientY <= threshold;
      
      // Only show when in bottom-right corner
      setIsHovering(rightEdge && bottomEdge);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, this would send to backend or Firestore
      console.log('Submitting feedback:', {
        type: feedbackType,
        text: feedbackText,
        userId: user?.uid,
        username: user?.username,
        timestamp: new Date().toISOString()
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Thank you for your feedback!');
      setFeedbackText('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {!isOpen ? (
        <Button
          variant="default"
          className={`rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition-opacity duration-300 ${(isHovering || isOpen) ? 'opacity-100' : 'opacity-0'}`}
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      ) : (
        <Card className="w-80 shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-md">Share Your Feedback</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="feedback-type" className="text-sm font-medium">
                  Feedback Type
                </label>
                <Select value={feedbackType} onValueChange={setFeedbackType}>
                  <SelectTrigger id="feedback-type">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="issue">Report an Issue</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="improvement">Suggestion for Improvement</SelectItem>
                    <SelectItem value="praise">Positive Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label htmlFor="feedback-text" className="text-sm font-medium">
                  Your Feedback
                </label>
                <Textarea
                  id="feedback-text"
                  placeholder="Please describe your feedback in detail..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleSubmit} disabled={isSubmitting || !feedbackText.trim()}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};
