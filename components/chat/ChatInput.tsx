'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ChevronRight } from 'lucide-react'
import axios from 'axios'
import { baseURL } from '@/config/config'
import { useAreaStore } from '@/store/useAreaStore'
import { useChatStore } from '@/store/useChatStore'

interface DailyStat {
  date: string
  opens?: number
  orders?: number
}

interface Stats {
  pinCode: string
}

interface LockedData {
  pinCode: string
}

interface Locality {
  name: string
  wiki_name: string
  pinCode: number
  isServed: boolean
  activeFrom?: string
  stats?: Stats            // present when isServed === true
  lockedData?: LockedData  // present when isServed === false
}

const ChatInput = () => {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const [mentionMode, setMentionMode] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  const activePinCode = useAreaStore(s => s.activePindCode)
  const addChatMessage = useChatStore(s => s.addChatMessage)
  const updateStream = useChatStore(s => s.updateStreamingMessage)
  const chatHistory = useChatStore(s => s.chatHistory)
  const setIsError = useChatStore(s => s.setIsError)
  const chatSummary = useChatStore(s => s.chatSummary)

  const [areasData, setAreasData] = useState<Locality[]>([])

  useEffect(() => {
    const getAllAreas = async () => {
      try {
        const { data, status, statusText } =
          await axios.get(`${baseURL}/api/areas/all-data-combined`)

        if (status !== 200) {
          console.error('Failed to fetch areas:', statusText)
          return
        }

        setAreasData([...(data.servedAreas || []), ...(data.lockedAreas || [])])
      } catch (err) {
        console.error('Error fetching areas:', err)
      }
    }
    getAllAreas()
  }, [])

  const extractMentions = (text: string) => {
    const mentionPattern = /@([\w\s]+?)\/([\w\s]+)/g
    const matches = [...text.matchAll(mentionPattern)]

    return matches.map(([, locality, prop]) => ({
      locality: locality.trim(),
      property: prop.trim(),
    }))
  }



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setMessage(val)




    const atIndex = val.lastIndexOf('@')
    if (atIndex !== -1) {
      setMentionQuery(val.slice(atIndex + 1))
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
    addChatMessage({ writer: 'user', message, timestamp: new Date().toISOString() })
    setMessage('')
    setLoading(true)



    try {
      const selectedLocalities = extractMentions(message)

      const res = await fetch(`${baseURL}/api/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          pinCode: activePinCode,
          chatHistory: chatHistory.slice(-10),
          chatSummary: chatSummary.summary || '',
          selectedLocalities: JSON.stringify({
            selectedLocalities
          }),
        }),
      })

      if (!res.body || res.status !== 200) {
        console.error('Streaming failed – status', res.status)
        setIsError(true)
        updateStream('[Error fetching response]')
        return
      }

      addChatMessage({ writer: 'assistant', message: '', timestamp: new Date().toISOString() })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunk = decoder.decode(value)
        chunk
          .split('\n')
          .filter(line => line.trim().startsWith('data: '))
          .map(line => line.replace(/^data: /, ''))
          .forEach(line => {
            if (line !== '[DONE]') updateStream(line)
          })
      }
    } catch (err) {
      console.error('Streaming failed:', err)
      setIsError(true)
      updateStream('[Error fetching response]')
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
          placeholder="Type your message…"
          disabled={loading}
          className="w-full"
        />
        <Button variant="outline" type="submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send'}
        </Button>
      </form>

      {mentionMode && !selectedLocality && (
        <div className="absolute bottom-14 left-2 w-56 max-h-52 overflow-y-auto bg-white shadow-md rounded-md text-sm z-10">
          {areasData
            .filter(a => a.name.toLowerCase().includes(mentionQuery.toLowerCase()))
            .map(area => (
              <div
                key={area.pinCode}
                onClick={() => setSelectedLocality(area)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span>@{area.name}</span>
                <ChevronRight size={14} />
              </div>
            ))}
        </div>
      )}

      {mentionMode && selectedLocality && (
        <div className="absolute bottom-14 left-2 w-72 max-h-60 overflow-y-auto bg-white shadow-md border rounded-md z-20">
          <div className="p-2 bg-gray-50 border-b text-xs font-medium flex justify-between items-center sticky top-0">
            <button onClick={() => setSelectedLocality(null)} className="cursor-pointer">
              ← Back
            </button>
            <span>{selectedLocality.name}</span>
          </div>

          {selectedLocality.stats &&
            Object.entries(selectedLocality.stats).map(([key, value]) => {
              const display =
                Array.isArray(value)
                  ? `[${value.length} entries]`
                  : typeof value === 'number'
                    ? value.toLocaleString()
                    : String(value)
              return (
                <div
                  key={key}
                  onClick={() => insertMention(selectedLocality.name, key)}
                  className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
                >
                  <span className="text-xs">{key}</span>
                  <span className="text-gray-500 text-xs">{display}</span>
                </div>
              )
            })}

          {selectedLocality.lockedData &&
            Object.entries(selectedLocality.lockedData).map(([key, value]) => (
              <div
                key={key}
                onClick={() => insertMention(selectedLocality.name, key)}
                className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
              >
                <span className="text-xs">{key}</span>
                <span className="text-gray-500 text-xs">{String(value)}</span>
              </div>
            ))}

          {['Average Salaries', 'Average Rent Price'].map(label => (
            <div
              key={label}
              onClick={() => insertMention(selectedLocality.name, label.replace(/\s+/g, ''))}
              className="px-3 py-1.5 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
            >
              <span className="text-xs">{label}</span>
              <span className="text-gray-500 text-xs">—</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChatInput
