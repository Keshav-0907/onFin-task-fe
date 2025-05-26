import useServedAreas from '@/hooks/useServedAreas';
import { useAreaStore } from '@/store/useAreaStore';
import { useChatStore } from '@/store/useChatStore'

import { Bot, RotateCw, Trash2, X } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast';

const ChatHeader = () => {
  const { areas } = useServedAreas()

  const toggleChatModal = useChatStore((state) => state.toggleChatModal);
  const chatSummary = useChatStore((state) => state.chatSummary);
  const isSummarising = useChatStore((state) => state.isSummarising);
  const activePinCode = useAreaStore((state) => state.activePindCode);
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode)
  const isError = useChatStore((state) => state.isError)
  const setIsError = useChatStore((state) => state.setIsError)
    const chatHistory = useChatStore((state) => state.chatHistory)
  

  const activeAreaName = areas.find(
    (area) => Number(area.pinCode) === activePinCode
  )?.name

  const clearHistory = () => {
    useChatStore.setState({ chatHistory: [], chatSummary: { summary: '' } });
    setActivePinCode(null);
    setIsError(false);
    toast.success('Chat history cleared successfully');
  };

  return (

    <div className='flex justify-between w-full items-center p-2 border-b border-gray-300'>
      <div className='flex items-center gap-2'>
        <div className='text-sm font-semibold'> AI Powered Chat </div>
        {(isSummarising || chatSummary.summary) && (
          <div className="text-xs text-green-700 flex items-center gap-1 z-20 ">
            {
              isSummarising ? <RotateCw size={12} className='animate-spin' /> : <Bot size={14} />
            }
            {isSummarising ? "Summarising..." : "Summarised"}
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {activeAreaName && (
          <div className='text-xs text-gray-500 bg-amber-100 border border-amber-600 px-2 py-0.5 rounded-lg flex items-center gap-1'>
            {activeAreaName}
          </div>
        )}
        {
          chatHistory.length > 0 && (
            <div
              onClick={clearHistory}
              className='flex items-center border p-1 border-red-500 rounded-sm gap-1 text-xs cursor-pointer text-red-600 hover:bg-red-800 hover:text-white transition-colors duration-200'
            >
              <Trash2 size={12} />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ChatHeader