import { create } from 'zustand'

interface AreaStore {
    activePindCode: number | null
    setActivePinCode: (code: number | null) => void
}

export const useAreaStore = create<AreaStore>((set) => ({
    activePindCode: null,
    setActivePinCode: (code) => set({ activePindCode: code })
}))
