'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAreaStore } from '@/store/useAreaStore'
import { useChatStore } from '@/store/useChatStore'
import { baseURL } from '@/config/config'
import axios from 'axios'
import { ChevronRight } from 'lucide-react'

interface DailyStat {
  date: string;
  opens?: number;
  orders?: number;
}

interface Stats {
  pinCode: string;
  totalOrders: number;
  avgOrderValue: number;
  aovChange: number;
  appOpens: number;
  appOpensHistory: DailyStat[];
  uniqueCustomers: number;
  avgDeliveryTime: number;
  deliveryDelay: number;
  dailyOrders: DailyStat[];
}

interface Locality {
  name: string;
  wiki_name: string;
  pinCode: number;
  isServed: boolean;
  activeFrom: string;
  stats: Stats;
}


const ChatInput = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [mentionMode, setMentionMode] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const activePinCode = useAreaStore((state) => state.activePindCode)
  const addChatMessage = useChatStore((state) => state.addChatMessage)
  const updateStreamingMessage = useChatStore((state) => state.updateStreamingMessage)
  const chatHistory = useChatStore((state) => state.chatHistory)
  const setIsError = useChatStore((state) => state.setIsError)
  const [servedAreasData, setServedAreasData] = useState<Locality[]>([])
  const chatSummary = useChatStore((state) => state.chatSummary)

  useEffect(() => {
    const getAllAreas = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/areas/servedArea-with-data`)
        if (res.status === 200) {
          setServedAreasData(res.data.allServedAreas)
        } else {
          console.error('Failed to fetch areas:', res.statusText)
        }
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    }
    getAllAreas()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setMessage(val)

    const atIndex = val.lastIndexOf('@')
    if (atIndex !== -1) {
      const query = val.slice(atIndex + 1)
      setMentionQuery(query)
      setMentionMode(true)
    } else {
      setMentionMode(false)
      setMentionQuery('')
      setSelectedLocality(null)
    }
  }

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

    console.log({
      msg: 'data for chat completion',
      message,
      chatHistory: chatHistory.slice(-10),
      pinCode: activePinCode,
      chatSummary: chatSummary.summary || '',
    })

    try {
      const res = await fetch(`${baseURL}/api/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          pinCode: activePinCode,
          chatHistory: chatHistory.slice(-10),
          chatSummary: chatSummary.summary || '',
        }),
      })

      if (!res.body) {
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

  const insertMention = (localityName: string, statKey: string) => {
    const atIndex = message.lastIndexOf('@')
    const newMsg = message.slice(0, atIndex) + `@${localityName}/${statKey} `
    setMessage(newMsg)
    setMentionMode(false)
    setSelectedLocality(null)
    inputRef.current?.focus()
  }


  return (
    <div className="p-2 border-t flex flex-col gap-1 relative">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          ref={inputRef}
          autoFocus
          onChange={handleInputChange}
          value={message}
          type="text"
          placeholder="Type your message..."
          className="w-full"
          disabled={loading}
        />
        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </form>

      {mentionMode && !selectedLocality && (
        <div className="absolute bottom-14 left-2 w-48 text-sm rounded-md shadow-md bg-white z-10 max-h-52 overflow-y-auto">
          {servedAreasData
            .filter(area =>
              area.name.toLowerCase().includes(mentionQuery.toLowerCase())
            )
            .map(area => (
              <div
                key={area.pinCode}
                onClick={() => setSelectedLocality(area)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs flex justify-between items-center"
              >
                <span>@{area.name}</span>
                <span> <ChevronRight size={14} /> </span>
              </div>
            ))}
        </div>
      )}

      {mentionMode && selectedLocality && (
        <div className="absolute bottom-14 left-2 w-72 border rounded-md shadow-md bg-white z-20 max-h-60 overflow-y-auto">
          <div className="p-2 font-semibold border-b bg-gray-50 text-sm flex items-center justify-between sticky top-0">
            <button
              onClick={() => setSelectedLocality(null)}
              className="text-xs font-normal cursor-pointer"
            >
              ← Back
            </button>
            <span className="text-gray-700 text-xs font-medium">Data for {selectedLocality.name}</span>
          </div>

          {Object.entries(selectedLocality.stats).map(([key, value]) => {
            const isArray = Array.isArray(value);
            const isObject = !isArray && typeof value === 'object' && value !== null;

            // For both primitive values and arrays (e.g., dailyOrders), allow mention insertion
            const display = isArray
              ? `[${value.length} entries]`
              : typeof value === 'number'
                ? value.toLocaleString()
                : String(value);

            return (
              <div
                key={key}
                onClick={() => insertMention(selectedLocality.name, key)}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
              >
                <span className="text-xs">{key}</span>
                <span className="text-gray-500 text-xs">{display}</span>
              </div>
            );
          })}



        </div>
      )}
    </div>
  )
}

export default ChatInput
