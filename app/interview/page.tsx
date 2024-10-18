import type { NextPage } from 'next';
import Sidebar from '@/app/components/interview/side_bar';
import MainContent from '@/app/components/interview/main_content';
import Profile from '@/app/components/interview/interviewer';

const Home: NextPage = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 flex">
        <MainContent />
        <Profile />
      </div>
    </div>
  );
};

export default Home;
