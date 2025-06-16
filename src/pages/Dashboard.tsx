
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to Progress page as that's now the main dashboard
    navigate('/progress');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-6 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Dashboard...</h1>
        <Button onClick={() => navigate('/progress')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
