import { create } from 'zustand'

interface ChatStore {
    isChatModalOpen: boolean
    toggleChatModal: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
    isChatModalOpen: false,
    toggleChatModal: () => set((state) => ({ isChatModalOpen: !state.isChatModalOpen })),
}))