'use client'

import { useAreaStore } from '@/store/useAreaStore'
import { useChatStore } from '@/store/useChatStore'
import useServedAreas from '@/hooks/useServedAreas'
import { X, Bot, User } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

const ChatMessage = () => {
  const { areas } = useServedAreas()
  const activePinCode = useAreaStore((state) => state.activePindCode)
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode)
  const chatHistory = useChatStore((state) => state.chatHistory)

  const activeAreaName = areas.find(
    (area) => Number(area.pinCode) === activePinCode
  )?.name

  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatHistory])

  console.log('chatHistory', chatHistory)

  return (
    <div className='flex flex-col max-h-[65vh] relative h-full overflow-y-auto'>
      <div
        ref={scrollRef}
        className='flex-1 overflow-y-auto space-y-3 p-4 pb-16'
      >
        {chatHistory.map((chat, index) => {
          const isUser = chat.writer === 'user'

          return (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className='bg-gray-300 rounded-full p-1'>
                  <Bot size={18} />
                </div>
              )}

              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow ${
                  isUser
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-black rounded-bl-none'
                }`}
              >
                <div className='whitespace-pre-wrap'>
                  {chat.message || (
                    <span className='italic text-gray-400'>...</span>
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

      {activePinCode && (
        <div className='absolute bottom-0 w-full flex gap-2 bg-slate-100 py-1 px-2 text-sm items-center z-10'>
          <div>Active Area:</div>
          <div className='text-sm bg-yellow-500 px-2 rounded-full w-fit text-white flex items-center gap-1'>
            {activeAreaName}
            <div
              className='cursor-pointer bg-white text-yellow-500 rounded-full p-[2px]'
              onClick={() => setActivePinCode(null)}
            >
              <X size={12} strokeWidth={2} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatMessage
