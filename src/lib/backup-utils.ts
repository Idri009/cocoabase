export type BackupData = {
  plantations: unknown[];
  tasks: unknown[];
  inventory: unknown[];
  settings: unknown;
  timestamp: Date;
  version: string;
};

export const createBackup = (data: {
  plantations: unknown[];
  tasks: unknown[];
  inventory: unknown[];
  settings: unknown;
}): BackupData => {
  return {
    ...data,
    timestamp: new Date(),
    version: "1.0.0",
  };
};

export const exportBackup = (backup: BackupData): string => {
  return JSON.stringify(backup, null, 2);
};

export const importBackup = (backupJson: string): BackupData => {
  try {
    const parsed = JSON.parse(backupJson);
    return {
      ...parsed,
      timestamp: new Date(parsed.timestamp),
    };
  } catch (error) {
    throw new Error("Invalid backup file format");
  }
};

export const downloadBackup = (backup: BackupData, filename?: string): void => {
  if (typeof window === "undefined") return;

  const json = exportBackup(backup);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `cocoa-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const uploadBackup = (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = importBackup(content);
        resolve(backup);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

export const validateBackup = (backup: BackupData): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!backup.timestamp) {
    errors.push("Missing timestamp");
  }

  if (!backup.version) {
    errors.push("Missing version");
  }

  if (!Array.isArray(backup.plantations)) {
    errors.push("Plantations must be an array");
  }

  if (!Array.isArray(backup.tasks)) {
    errors.push("Tasks must be an array");
  }

  if (!Array.isArray(backup.inventory)) {
    errors.push("Inventory must be an array");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const getBackupSize = (backup: BackupData): number => {
  const json = exportBackup(backup);
  return new Blob([json]).size;
};

export const formatBackupSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

