import { useState, useMemo, useCallback } from "react";

export type FilterConfig<T> = {
  field: keyof T;
  operator: "equals" | "contains" | "gt" | "lt" | "gte" | "lte" | "in" | "between";
  value: unknown;
};

export const useFilters = <T extends Record<string, unknown>>(data: T[]) => {
  const [filters, setFilters] = useState<FilterConfig<T>[]>([]);

  const addFilter = useCallback((filter: FilterConfig<T>) => {
    setFilters((prev) => [...prev, filter]);
  }, []);

  const removeFilter = useCallback((index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const updateFilter = useCallback((index: number, filter: FilterConfig<T>) => {
    setFilters((prev) => prev.map((f, i) => (i === index ? filter : f)));
  }, []);

  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter((item) => {
      return filters.every((filter) => {
        const fieldValue = item[filter.field];

        switch (filter.operator) {
          case "equals":
            return fieldValue === filter.value;
          case "contains":
            return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case "gt":
            return Number(fieldValue) > Number(filter.value);
          case "lt":
            return Number(fieldValue) < Number(filter.value);
          case "gte":
            return Number(fieldValue) >= Number(filter.value);
          case "lte":
            return Number(fieldValue) <= Number(filter.value);
          case "in":
            return Array.isArray(filter.value) && filter.value.includes(fieldValue);
          case "between":
            if (Array.isArray(filter.value) && filter.value.length === 2) {
              const numValue = Number(fieldValue);
              return numValue >= Number(filter.value[0]) && numValue <= Number(filter.value[1]);
            }
            return false;
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  return {
    filters,
    filteredData,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
  };
};

