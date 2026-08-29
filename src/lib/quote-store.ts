import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type QuoteDraft = {
  photos: string[];
  jobType: string;
  description: string;
  name: string;
  phone: string;
  zone: string;
  step: 1 | 2 | 3;
};

const empty: QuoteDraft = {
  photos: [],
  jobType: "",
  description: "",
  name: "",
  phone: "",
  zone: "Andria",
  step: 1,
};

type QuoteStore = QuoteDraft & {
  setDraft: (patch: Partial<QuoteDraft>) => void;
  reset: () => void;
};

const memoryStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useQuoteDraft = create<QuoteStore>()(
  persist(
    (set) => ({
      ...empty,
      setDraft: (patch) => set(patch),
      reset: () => set(empty),
    }),
    {
      name: "ie-quote-draft",
      storage: createJSONStorage(() =>
        typeof window === "undefined" ? memoryStorage : sessionStorage,
      ),
      partialize: (state) => ({
        photos: state.photos,
        jobType: state.jobType,
        description: state.description,
        name: state.name,
        phone: state.phone,
        zone: state.zone,
        step: state.step,
      }),
    },
  ),
);
