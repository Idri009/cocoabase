export type DocumentType = "receipt" | "invoice" | "certificate" | "contract" | "permit" | "other";

export type DocumentStatus = "pending" | "processing" | "completed" | "failed";

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Date;
  processedAt?: Date;
  status: DocumentStatus;
  extractedData?: Record<string, unknown>;
  plantationId?: string;
  tags?: string[];
  notes?: string;
}

export const getDocumentTypeFromFileName = (fileName: string): DocumentType => {
  const lower = fileName.toLowerCase();
  if (lower.includes("receipt")) return "receipt";
  if (lower.includes("invoice")) return "invoice";
  if (lower.includes("certificate") || lower.includes("cert")) return "certificate";
  if (lower.includes("contract")) return "contract";
  if (lower.includes("permit")) return "permit";
  return "other";
};

export const getMimeType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return mimeTypes[extension || ""] || "application/octet-stream";
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const validateDocument = (file: File): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const maxSize = 10 * 1024 * 1024;
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${formatFileSize(maxSize)}`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push("File type not supported. Allowed types: PDF, JPEG, PNG, DOC, DOCX");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const extractTextFromDocument = async (file: File): Promise<string> => {
  if (file.type === "application/pdf") {
    return "PDF text extraction - requires PDF.js or similar library";
  }
  if (file.type.startsWith("image/")) {
    return "Image OCR - requires Tesseract.js or similar OCR library";
  }
  return "Text extraction not available for this file type";
};

export const createDocument = (
  file: File,
  type?: DocumentType,
  plantationId?: string
): Document => {
  const docType = type || getDocumentTypeFromFileName(file.name);

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: docType,
    title: file.name,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    uploadedAt: new Date(),
    status: "pending",
    plantationId,
  };
};

export const getDocumentsByType = (
  documents: Document[]
): Record<DocumentType, Document[]> => {
  return documents.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) {
        acc[doc.type] = [];
      }
      acc[doc.type].push(doc);
      return acc;
    },
    {
      receipt: [],
      invoice: [],
      certificate: [],
      contract: [],
      permit: [],
      other: [],
    } as Record<DocumentType, Document[]>
  );
};

export const searchDocuments = (
  documents: Document[],
  query: string
): Document[] => {
  const lowerQuery = query.toLowerCase();
  return documents.filter((doc) => {
    return (
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.fileName.toLowerCase().includes(lowerQuery) ||
      doc.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      doc.notes?.toLowerCase().includes(lowerQuery)
    );
  });
};

export const getDocumentSummary = (documents: Document[]): {
  total: number;
  byType: Record<DocumentType, number>;
  byStatus: Record<DocumentStatus, number>;
  totalSize: number;
} => {
  const byType = getDocumentsByType(documents);
  const byStatus = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.status]) {
        acc[doc.status] = 0;
      }
      acc[doc.status]++;
      return acc;
    },
    {} as Record<DocumentStatus, number>
  );

  return {
    total: documents.length,
    byType: {
      receipt: byType.receipt.length,
      invoice: byType.invoice.length,
      certificate: byType.certificate.length,
      contract: byType.contract.length,
      permit: byType.permit.length,
      other: byType.other.length,
    },
    byStatus: {
      pending: byStatus.pending || 0,
      processing: byStatus.processing || 0,
      completed: byStatus.completed || 0,
      failed: byStatus.failed || 0,
    },
    totalSize: documents.reduce((sum, doc) => sum + doc.fileSize, 0),
  };
};

