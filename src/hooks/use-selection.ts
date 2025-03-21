import type {} from "@redux-devtools/extension";
import { create } from "zustand";

type Item = {
  type: "file" | "folder";
  googleId: string;
  id: number;
};

interface SelectionState {
  items: Item[];
  toggleSelect: (item: Item) => void;
  removeItem: (id: number) => void;
  resetItems: () => void;
}

export const useSelection = create<SelectionState>()((set) => ({
  items: [],
  resetItems: () => set(() => ({ items: [] })),
  toggleSelect: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        return { items: state.items.filter((i) => i.id !== item.id) };
      }
      return { items: [...state.items, item] };
    }),
  removeItem: (id) =>
    set((state) => {
      const alreadyExists = state.items.find((i) => i.id === id);
      if (!alreadyExists) return state;
      return {
        items: state.items.filter((item) => item.id !== id),
      };
    }),
}));
