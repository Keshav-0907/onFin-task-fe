'use client'
import { useAreaStore } from '@/store/useAreaStore';
import React from 'react'

const ChatMessage = () => {
    const activePinCode = useAreaStore((state) => state.activePindCode);

    return (
        <div className='min-h-80 p-2'>
            {activePinCode}
        </div>
    )
}

export default ChatMessage