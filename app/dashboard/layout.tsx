// /app/dashboard/layout.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { TopNav } from '@/app/components/topNav';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Toaster } from "@/app/components/ui/toaster";
import { useAuth } from '@clerk/nextjs';
import { withAuth } from '@/app/utils/withAuth';
import { useRouter } from 'next/navigation';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const { userId } = useAuth();
  const router = useRouter();

  /**
   * Fetch all conversationId from MongoDB, which are used to render the list of conversations.
   * 
   */
  const fetchAllConversations = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/getAllChat?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('All Conversations received:', data);
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  /**
   * Creating new chat in MongoDB and returns a new conversationId. Which is then used to pass down as props to the chat page.
   */
  const handleNewChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) return;
    
    try {
      const response = await fetch('/api/newChat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'userID': userId,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        console.log('API Response:', data);
  
        const newConversationId = data.newConversationId;
        if (newConversationId) {
          setConversationId(newConversationId);
          console.log('New chat created:', newConversationId);
  
          // Navigate to the chat page with the new conversationId
          handleConversationClick(newConversationId);
        } else {
          console.error('No conversation ID returned from API');
        }
      } else {
        console.error('Failed to create new chat');
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    console.log('Conversation clicked:', conversationId);
    router.push(`/dashboard/chat?id=${conversationId}`);
  };

  const handleCreateFlashcardClick = () => {
    router.push(`/dashboard/create?userId=${userId}`);
  };

  const handledefaultDashboardClick = () => {
    router.push(`/dashboard/flashcards`);
  };

  return (
    <div className="flex flex-col h-screen">
      <TopNav />
      <Toaster />
      <div className="flex flex-1 overflow-hidden pt-16">
        <nav className="w-1/7 h-[calc(100vh-4rem)] bg-white border border-slate-200 text-slate-900 fixed left-0 top-16 pt-4 ">
          <ul className="flex flex-col space-y-4 p-4 ml-5">
            {/* Route to default /dashboard page for decks */}
            <li className="hover:bg-gray-200 p-2 rounded flex items-center">
              <button
                onClick={handledefaultDashboardClick}
                className="flex items-center w-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z"
                    clipRule="evenodd"
                  />
                </svg>
                Flashcards
              </button>
            </li>

            {/* On click handler to navigate to new chat page */}
            <li className="hover:bg-gray-200 p-2 rounded flex items-center">
              <button
                onClick={handleCreateFlashcardClick}
                className="flex items-center w-full"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    d="M12 3V21M3 12H21"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                Create Flashcard
              </button>
            </li>
            {/*  */}
            <li className="hover:bg-gray-200 p-2 rounded flex items-center">
                <button
                  onClick={handleNewChat}
                  className="flex items-center w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Chat
                </button>
            </li>

            <li className="hover:bg-gray-200 p-2 rounded flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton
                  onClick={fetchAllConversations}
                  className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Conversations
                  <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                </MenuButton>
                <MenuItems
                  className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  style={{ left: '-3px', transform: 'translateX(2px)' }}
                >
                  {conversations.length > 0 ? (
                    conversations.map((convo) => (
                      <MenuItem key={convo.conversationId}>
                        {({ active }: { active: boolean }) => (
                          <a
                            href="#"
                            onClick={() => handleConversationClick(convo.conversationId)}
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            Conversation {convo.conversationId}
                          </a>
                        )}
                      </MenuItem>
                    ))
                  ) : (
                    <div className="py-1 px-4 text-sm text-gray-700">
                      No Conversations Available
                    </div>
                  )}
                </MenuItems>
              </Menu>
            </li>
          </ul>
        </nav>

        <div className="flex-1 p-4 overflow-auto ml-[16.67%]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DashboardLayout);
