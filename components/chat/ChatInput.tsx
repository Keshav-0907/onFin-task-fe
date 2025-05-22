'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const ChatInput = () => {
  
  const [message, setMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    console.log('Message sent', message)
  }
  return (
    <div className='p-2 border-t flex flex-col gap-1'>
      <div className='flex gap-2'>
        <Input onChange={(e)=>setMessage(e.target.value)} value={message} type='text' placeholder='Type your message...' className='w-full' />
        <Button variant='outline' onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  )
}

export default ChatInput