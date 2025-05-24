'use client'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAreaStore } from '@/store/useAreaStore'
import { useChatStore } from '@/store/useChatStore'

const ChatInput = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const activePinCode = useAreaStore((state) => state.activePindCode)
  const addChatMessage = useChatStore((state) => state.addChatMessage)
  const updateStreamingMessage = useChatStore((state) => state.updateStreamingMessage)
  const chatHistory = useChatStore((state) => state.chatHistory)
  const setIsError = useChatStore((state) => state.setIsError)


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsError(false)
    const userTimestamp = new Date().toISOString()

    addChatMessage({
      writer: 'user',
      message,
      timestamp: userTimestamp,
    })

    setMessage('')
    setLoading(true)

    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          pinCode: activePinCode,
          chatHistory,
        }),
      })

      if(res.body === null) {
        console.error('Response body is null')
        setIsError(true)
        updateStreamingMessage('[Error fetching response]')
        return
      }

      if (res.status !== 200) {
        const errorMessage = await res.text()
        console.error('Error response:', errorMessage)
        setIsError(true)
        updateStreamingMessage('[Error fetching response]')
        return
      }

      addChatMessage({
        writer: 'assistant',
        message: '',
        timestamp: new Date().toISOString(),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading

        const chunk = decoder.decode(value)
        const lines = chunk
          .split('\n')
          .filter(line => line.trim().startsWith('data: '))
          .map(line => line.replace(/^data: /, ''))

        for (const line of lines) {
          if (line === '[DONE]') return
          updateStreamingMessage(line)
        }
      }
    } catch (err) {
      console.error('Streaming failed:', err)
      setIsError(true)
      updateStreamingMessage('[Error fetching response]')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='p-2 border-t flex flex-col gap-1'>
      <form onSubmit={handleSendMessage} className='flex gap-2'>
        <Input
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          type='text'
          placeholder='Type your message...'
          className='w-full'
          disabled={loading}
        />
        <Button variant='outline' type='submit' disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}

export default ChatInput
