'use client'
import { Plus } from 'lucide-react'
import React from 'react'
import { useChatStore } from '@/store/useChatStore'

const FloatingChatIcon = () => {
    const toggleChatModal = useChatStore((state) => state.toggleChatModal)

    const handleToggleChatModal = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleChatModal()
    }
    
    return (
        <div onClick={handleToggleChatModal} className='bg-black text-white rounded-full p-3 z-[1001] fixed bottom-4 left-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer'>
            <Plus />
        </div>
    )
}

export default FloatingChatIcon