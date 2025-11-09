import { create } from "zustand";
import {
  persist,
  type PersistOptions,
  createJSONStorage,
} from "zustand/middleware";

export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "stormy"
  | "windy"
  | "foggy"
  | "snowy";

export type WeatherRecord = {
  id: string;
  date: string;
  location?: string;
  plantationId?: string;
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed?: number;
  notes?: string;
  createdAt: string;
};

export type WeatherRecordDraft = Omit<
  WeatherRecord,
  "id" | "createdAt"
> & {
  id?: string;
};

type WeatherHistoryState = {
  records: WeatherRecord[];
  addRecord: (draft: WeatherRecordDraft) => void;
  updateRecord: (id: string, updates: Partial<WeatherRecordDraft>) => void;
  removeRecord: (id: string) => void;
  getRecordsByDateRange: (startDate: string, endDate: string) => WeatherRecord[];
  getRecordsByPlantation: (plantationId: string) => WeatherRecord[];
  getAverageRainfall: (startDate?: string, endDate?: string) => number;
};

const generateWeatherId = () =>
  `weather_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export const useWeatherHistoryStore = create<WeatherHistoryState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (draft) => {
        const now = new Date().toISOString();
        const record: WeatherRecord = {
          ...draft,
          id: draft.id ?? generateWeatherId(),
          createdAt: now,
        };
        set((state) => ({
          records: [...state.records, record],
        }));
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...updates } : record
          ),
        }));
      },

      removeRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },

      getRecordsByDateRange: (startDate, endDate) => {
        return get()
          .records.filter(
            (record) => record.date >= startDate && record.date <= endDate
          )
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getRecordsByPlantation: (plantationId) => {
        return get()
          .records.filter((record) => record.plantationId === plantationId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },

      getAverageRainfall: (startDate, endDate) => {
        const filtered = startDate && endDate
          ? get().getRecordsByDateRange(startDate, endDate)
          : get().records;
        if (filtered.length === 0) return 0;
        const total = filtered.reduce((sum, record) => sum + record.rainfall, 0);
        return total / filtered.length;
      },
    }),
    {
      name: "cocoa-chain-weather-history",
      storage: createJSONStorage(() => localStorage),
    } as PersistOptions<WeatherHistoryState>
  )
);

