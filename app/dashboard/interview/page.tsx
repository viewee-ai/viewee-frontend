'use client';
import { useSearchParams } from 'next/navigation';
import Sidebar from '@/app/components/interview/side_bar';
import MainContent from '@/app/components/interview/main_content';
import Interviewer from '@/app/components/interview/interviewer';
import { SessionProvider } from '@/app/utils/session_provider';
import { AppProvider } from '@/app/utils/AppContext';

const InterviewPage = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col md:flex-row">
        <SessionProvider>
          <AppProvider>
            <MainContent title={title || 'Two Sum'} />
            <Interviewer />
          </AppProvider>
        </SessionProvider>
      </div>
    </div>
  );
};

export default InterviewPage;