import { create } from 'zustand';

const useSidebarStore = create((set) => ({
    currentMenu: 'dashboard',
    updateCurrentMenu: (newMenu) => set({ currentMenu: newMenu }),
}));

export default useSidebarStore;