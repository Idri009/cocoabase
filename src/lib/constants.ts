export const GROWTH_STAGES = {
  SEEDLING: "seedling",
  VEGETATIVE: "vegetative",
  FLOWERING: "flowering",
  FRUITING: "fruiting",
  HARVEST: "harvest",
} as const;

export const GROWTH_STAGE_LABELS: Record<string, string> = {
  [GROWTH_STAGES.SEEDLING]: "Seedling",
  [GROWTH_STAGES.VEGETATIVE]: "Vegetative",
  [GROWTH_STAGES.FLOWERING]: "Flowering",
  [GROWTH_STAGES.FRUITING]: "Fruiting",
  [GROWTH_STAGES.HARVEST]: "Harvest",
};

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;

export const ALERT_TYPES = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  ERROR: "error",
} as const;

export const NOTIFICATION_TYPES = {
  TASK_DUE: "task_due",
  STAGE_TRANSITION: "stage_transition",
  YIELD_UPDATE: "yield_update",
  COLLABORATION: "collaboration",
  SYSTEM: "system",
} as const;

export const CARBON_OFFSET_FACTORS = {
  COCOA_TREE_PER_YEAR: 0.025, // tons CO2 per tree per year
  HECTARE_PER_YEAR: 2.5, // tons CO2 per hectare per year
} as const;

export const YIELD_ESTIMATES = {
  SEEDLING: { min: 0, max: 0 },
  VEGETATIVE: { min: 0, max: 0 },
  FLOWERING: { min: 0, max: 0.5 },
  FRUITING: { min: 0.5, max: 2.0 },
  HARVEST: { min: 2.0, max: 5.0 },
} as const;

export const STAGE_DURATIONS_DAYS = {
  SEEDLING: 30,
  VEGETATIVE: 90,
  FLOWERING: 30,
  FRUITING: 120,
  HARVEST: 0,
} as const;

export const DEFAULT_PLANTATION_CONFIG = {
  AREA_HECTARES: 1.0,
  TREE_DENSITY_PER_HECTARE: 1000,
  INITIAL_STAGE: GROWTH_STAGES.SEEDLING,
} as const;

export const STORAGE_KEYS = {
  FAVORITES: "cocoa-favorite-plantations",
  VIEW_MODE: "cocoa-view-mode",
  FILTERS: "cocoa-filters",
  NOTES: "cocoa-plantation-notes",
  DASHBOARD_LAYOUT: "cocoa-dashboard-layout",
} as const;

export const API_ENDPOINTS = {
  PLANTATIONS: "/api/plantations",
  TASKS: "/api/tasks",
  ANALYTICS: "/api/analytics",
  ALERTS: "/api/alerts",
  COLLABORATION: "/api/collaboration",
} as const;

export const DATE_FORMATS = {
  SHORT: "MMM d, yyyy",
  LONG: "MMMM d, yyyy",
  ISO: "yyyy-MM-dd",
  DATETIME: "MMM d, yyyy 'at' h:mm a",
} as const;

export const CHART_COLORS = {
  PRIMARY: "#8B4513",
  SECONDARY: "#E8DCC6",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  INFO: "#3B82F6",
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const VALIDATION = {
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
  MAX_NOTES_LENGTH: 1000,
  MAX_NAME_LENGTH: 100,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword"],
} as const;

export const CACHE_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 30 * 60 * 1000, // 30 minutes
  VERY_LONG: 60 * 60 * 1000, // 1 hour
} as const;

export const RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
  BACKOFF_MULTIPLIER: 2,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;

export const SUCCESS_MESSAGES = {
  SAVED: "Changes saved successfully.",
  CREATED: "Created successfully.",
  UPDATED: "Updated successfully.",
  DELETED: "Deleted successfully.",
  COPIED: "Copied to clipboard.",
} as const;

