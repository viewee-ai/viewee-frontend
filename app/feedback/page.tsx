"use client";

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';

interface FeedbackPageProps {
    userId: string;
    problemId: string;
  }
  
  const FeedbackPage: React.FC<FeedbackPageProps> = ({ userId, problemId }) => {
    const [codeScore, setCodeScore] = useState<number | null>(null);
    const [strengths, setStrengths] = useState<string | null>(null);
    const [improvements, setImprovements] = useState<string | null>(null);
    const [solutionCode, setSolutionCode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
  
    useEffect(() => {
      const fetchFeedback = async () => {
        try {
          setLoading(true);
          // Placeholder for API call to get feedback data from backend
          const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId,
              problemId,
            }),
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          const { code, strengthsText, improvementsText, solutionCodeText } = data;
          setCodeScore(code);
          setStrengths(strengthsText);
          setImprovements(improvementsText);
          setSolutionCode(solutionCodeText);
        } catch (error) {
          console.error('Error fetching feedback:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchFeedback();
    }, [userId, problemId]);
  
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spinner />
        </div>
      );
    }
  
    return (
      <div style={{ padding: '2rem' }}>
        <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Code Score: {codeScore !== null ? codeScore : 'N/A'}/10</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1, marginRight: '1rem' }}>
              <h5>What You Excel In</h5>
              <p>{strengths ? strengths : 'No strengths available.'}</p>
            </div>
            <div style={{ flex: 1, marginLeft: '1rem' }}>
              <h5>What Could Be Improved</h5>
              <p>{improvements ? improvements : 'No improvement suggestions available.'}</p>
            </div>
          </div>
        </Card>
  
        <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h5 style={{ marginBottom: '1rem' }}>Solution Code</h5>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '5px' }}>
            {solutionCode ? solutionCode : 'No solution code available.'}
          </pre>
        </Card>
  
        <Button onClick={() => window.location.reload()}>
          Retry Problem
        </Button>
        <Button onClick={() => router.push('/app/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  };
  
  export default FeedbackPage;