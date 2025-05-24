'use client'

import React from 'react';
import { useChatStore } from '@/store/useChatStore';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

const ChatModal = () => {
  const isOpen = useChatStore((state) => state.isChatModalOpen);
  const toggleChatModal = useChatStore((state) => state.toggleChatModal);


  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleChatModal}
    >
      <div
        className="bg-[#F8F4F1] rounded-md max-w-xl max-h-[80vh] md:w-[480px] w-[90%] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >

        <ChatHeader/>

        <ChatMessage />

        <div className="">
          <ChatInput/>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
