import type { NextPage } from 'next';
import Sidebar from '@/app/components/interview/side_bar';
import MainContent from '@/app/components/interview/main_content';
import Interviewer from '@/app/components/interview/interviewer';
import { SessionProvider } from '@/app/utils/session_provider';

const Home: NextPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex">
      <SessionProvider>
        <MainContent />
        <Interviewer />
      </SessionProvider>
      </div>
    </div>
  );
};

export default Home;
