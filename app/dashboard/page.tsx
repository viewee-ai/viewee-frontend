'use client'
import React from 'react';
import { TopNav } from '@/app/components/topNav';
import { withAuth } from '@/app/utils/withAuth';
import { Toaster } from "@/app/components/ui/toaster";

function DashboardHome() {
  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <Toaster />
      <div className="flex flex-1 justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
          <p className="mb-4">Select an option from the sidebar to get started.</p>
          <div className="flex justify-center space-x-4">
            <a href="/dashboard/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Create Flashcard
            </a>
            <a href="/dashboard/chat" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              View Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardHome);
