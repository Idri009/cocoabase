export const formatNumber = (
  value: number,
  options?: {
    decimals?: number;
    compact?: boolean;
    currency?: string;
  }
): string => {
  const { decimals = 0, compact = false, currency } = options || {};

  if (compact && value >= 1000) {
    if (value >= 1_000_000) {
      const millions = value / 1_000_000;
      return `${millions.toFixed(decimals)}M`;
    }
    if (value >= 1_000) {
      const thousands = value / 1_000;
      return `${thousands.toFixed(decimals)}K`;
    }
  }

  const formatterOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  };

  if (currency) {
    formatterOptions.style = "currency";
    formatterOptions.currency = currency;
  }

  return new Intl.NumberFormat(undefined, formatterOptions).format(value);
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export const formatAddress = (address: string, chars: number = 4): string => {
  if (address.length <= chars * 2) {
    return address;
  }
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
};

export const formatList = (
  items: string[],
  options?: {
    max?: number;
    conjunction?: string;
  }
): string => {
  const { max = items.length, conjunction = "and" } = options || {};

  if (items.length === 0) {
    return "";
  }
  if (items.length === 1) {
    return items[0];
  }

  const visible = items.slice(0, max);
  const remaining = items.length - max;

  if (remaining > 0) {
    return `${visible.join(", ")}, ${conjunction} ${remaining} more`;
  }

  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }

  const last = visible.pop();
  return `${visible.join(", ")}, ${conjunction} ${last}`;
};

export const capitalizeFirst = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatStageLabel = (stage: string): string => {
  return capitalizeFirst(stage);
};

export const formatTaskStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
  };
  return statusMap[status] || capitalizeFirst(status);
};

export const getInitials = (name: string, maxLength: number = 2): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return "";
  if (words.length === 1) {
    return words[0].slice(0, maxLength).toUpperCase();
  }
  return words
    .slice(0, maxLength)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export const formatDurationShort = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m`;
  }
  return `${seconds}s`;
};

export const formatCarbonOffset = (tons: number): string => {
  if (tons < 1) {
    return `${(tons * 1000).toFixed(0)} kg CO₂`;
  }
  return `${tons.toFixed(2)} tCO₂`;
};

export const formatArea = (hectares: number): string => {
  if (hectares < 0.01) {
    return `${(hectares * 10000).toFixed(0)} m²`;
  }
  if (hectares < 1) {
    return `${(hectares * 100).toFixed(1)} acres`;
  }
  return `${hectares.toFixed(2)} ha`;
};

export const formatYield = (kg: number): string => {
  if (kg < 1) {
    return `${(kg * 1000).toFixed(0)} g`;
  }
  if (kg < 1000) {
    return `${kg.toFixed(1)} kg`;
  }
  return `${(kg / 1000).toFixed(2)} t`;
};

export const getProgressColor = (percentage: number): string => {
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-blue-500";
  if (percentage >= 40) return "bg-yellow-500";
  if (percentage >= 20) return "bg-orange-500";
  return "bg-red-500";
};

export const getHealthColor = (score: number): string => {
  if (score >= 70) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

export const getHealthBgColor = (score: number): string => {
  if (score >= 70) return "bg-green-50";
  if (score >= 50) return "bg-yellow-50";
  return "bg-red-50";
};

