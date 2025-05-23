import { create } from 'zustand'

interface ChatMessage {
    writer: 'user' | 'assistant'
    message: string
    timestamp: string
}

interface ChatStore {
    isChatModalOpen: boolean
    toggleChatModal: () => void
    chatHistory: ChatMessage[]
    addChatMessage: (message: ChatMessage) => void
    updateStreamingMessage: (partialMsg: string) => void
    clearChatHistory: () => void
    chatSummary: {
        summary: string
    },
    setChatSummary: (summary: string) => void,
    isSummarising: boolean,
    setIsSummarising: (isSummarising: boolean) => void,
    isError: boolean,
    setIsError: (isError: boolean) => void,
}

export const useChatStore = create<ChatStore>((set) => ({
    isChatModalOpen: false,
    toggleChatModal: () =>
        set((state) => ({ isChatModalOpen: !state.isChatModalOpen })),
    chatHistory: [],
    addChatMessage: (msg: ChatMessage) =>
        set((state) => ({ chatHistory: [...state.chatHistory, msg] })),

    updateStreamingMessage: (chunk) =>
        set((state) => {
            const history = [...state.chatHistory]
            const last = history[history.length - 1]

            if (last && last.writer === 'assistant') {
                last.message = (last.message || '') + chunk
                history[history.length - 1] = last
            } else {
                history.push({
                    writer: 'assistant',
                    message: chunk,
                    timestamp: new Date().toISOString(),
                })
            }

            return { chatHistory: history }
        }),


    clearChatHistory: () => set({ chatHistory: [] }),
    chatSummary: {
        summary: '',
    },
    setChatSummary: (summary: string) => set({
        chatSummary: {
            summary,
        },
    }),
    isSummarising: false,
    setIsSummarising: (isSummarising: boolean) => set({ isSummarising }),
    isError: false,
    setIsError: (isError: boolean) => set({ isError }),
}))
