'use client'

import { useAreaStore } from '@/store/useAreaStore'
import { useChatStore } from '@/store/useChatStore'
import useServedAreas from '@/hooks/useServedAreas'
import { X, Bot, User, RotateCw, Trash, Trash2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import { baseURL } from '@/config/config'
import { toast } from 'react-hot-toast'
import { formatResponseText } from '@/lib/helperFunctions'

const ChatMessage = () => {
  const { areas } = useServedAreas()
  const activePinCode = useAreaStore((state) => state.activePindCode)
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode)
  const chatHistory = useChatStore((state) => state.chatHistory)
  const setChatSummary = useChatStore((state) => state.setChatSummary)
  const chatSummary = useChatStore((state) => state.chatSummary)
  const setIsSummarising = useChatStore((state) => state.setIsSummarising)
  const isSummarising = useChatStore((state) => state.isSummarising)
  const isError = useChatStore((state) => state.isError)
  const setIsError = useChatStore((state) => state.setIsError)

  const activeAreaName = areas.find(
    (area) => Number(area.pinCode) === activePinCode
  )?.name

  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  useEffect(() => {
    // if (chatHistory.length > 10 && chatHistory.length % 5 === 0 && !isSummarising && !chatSummary.summary) {
    if (chatHistory.length > 4 && chatHistory.length % 5 === 0 && !isSummarising) {
      const getSummary = async () => {
        try {
          setIsSummarising(true);

          const historyToSummarise = chatHistory.slice(0, chatHistory.length - 5);
          // const recentHistory = chatHistory.slice(-10);

          const res = await axios.post(`${baseURL}/api/chat/summarise`, {
            chatHistory: historyToSummarise.length > 5 ? historyToSummarise : chatHistory,
          });

          if (res.status === 200) {
            setChatSummary(res.data.summary);
            // useChatStore.setState({ chatHistory: recentHistory });
          } else {
            console.error('Error summarising chat history', res);
            setIsError(true);
          }
        } catch (err) {
          console.error("Summarisation failed", err);
          setIsError(true);
        } finally {
          setIsSummarising(false);
        }
      };

      getSummary();
    }
  }, [chatHistory.length]);

  const clearHistory = () => {
    useChatStore.setState({ chatHistory: [], chatSummary: { summary: '' } });
    setActivePinCode(null);
    setIsError(false);
    toast.success('Chat history cleared successfully');
  };

  return (
    <div className='flex flex-col overflow-y-auto w-full'>
      <div
        ref={scrollRef}
        className='overflow-y-auto space-y-3 p-2 pt-2 h-full relative'
      >
        {chatHistory.length === 0 && !chatSummary.summary && (
          <div className="text-center text-gray-600 mt-12 px-4 space-y-2">
            <h3 className="text-base font-semibold">Start a Conversation</h3>
            <p className="text-sm">
              🤖 Ask me anything about the localities. I&apos;m here to help!
            </p>
          </div>
        )}

        {/* {chatSummary.summary && (
          <div className='bg-gray-100 text-black rounded-lg px-3 py-2 text-sm shadow border border-green-400'>
            <div className='text-xs text-gray-500'>Summary of Older Chats</div>
            <div className='whitespace-pre-wrap'>
              {chatSummary.summary}
            </div>
          </div>

        )} */}

        <div className='p-2 flex flex-col gap-2'>
          {chatHistory.map((chat, index) => {
            const isUser = chat.writer === 'user'

            return (
              <div
                key={index}
                className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'
                  }`}
              >
                {!isUser && (
                  <div className='bg-gray-300 rounded-full p-1'>
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow ${isUser
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-gray-100 text-black rounded-tl-none'
                    }`}
                >
                  <div className='whitespace-pre-wrap text-sm'>
                    {chat.writer == 'assistant' ? (
                      formatResponseText(chat.message || '')
                    ) : (
                      chat.message || (
                        <span className='italic text-gray-400'>...</span>
                      )
                    )}
                  </div>
                  <div className='text-[10px] mt-1 text-right opacity-60'>
                    {chat.timestamp
                      ? new Date(chat.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                      : ''}
                  </div>
                </div>

                {isUser && (
                  <div className='bg-blue-500 text-white rounded-full p-1'>
                    <User size={18} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {
        isError && (
          <div className="flex items-center justify-center">
            <button
              onClick={() => window.location.reload()}
              className="my-4 inline-flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium text-red-600 border border-red-400 rounded-full hover:bg-red-50 transition-colors duration-200"
            >
              <RotateCw size={16} className="stroke-[1.5]" />
              Retry
            </button>
          </div>
        )
      }

    </div>
  )
}

export default ChatMessage
