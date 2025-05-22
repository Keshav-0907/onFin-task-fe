import { create } from 'zustand'

interface AreaStore {
    activePindCode: number | null
    setActivePinCode: (code: string | null) => void
}

export const useAreaStore = create<AreaStore>((set) => ({
    activePindCode: null,
    setActivePinCode: (code:any) => set({ activePindCode: code }),
}))
