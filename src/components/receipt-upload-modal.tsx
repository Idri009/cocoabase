"use client";

import {
  useState,
  useMemo,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Modal from "@/components/ui/modal";
import { useEngagementStore } from "@/store/engagement";
import { usePlantationsStore } from "@/store/plantations";
import { useAlertsStore } from "@/store/alerts";
import { cn } from "@/lib/cn";

type ReceiptUploadModalProps = {
  open: boolean;
  onClose: () => void;
  defaultPlantationId?: string;
};

type FileState = {
  fileName: string;
  storageUrl?: string;
};

const defaultCurrencyOptions = ["USD", "GHS", "NGN", "XOF"];

const buildMockStorageUrl = (fileName: string) =>
  `https://mock.cocoachain.storage/${encodeURIComponent(fileName)}`;

export default function ReceiptUploadModal({
  open,
  onClose,
  defaultPlantationId,
}: ReceiptUploadModalProps) {
  const addReceipt = useEngagementStore((state) => state.addReceipt);
  const addAlert = useAlertsStore((state) => state.addAlert);
  const plantations = usePlantationsStore((state) => state.plantations);

  const plantationOptions = useMemo(
    () =>
      plantations.map((plantation) => ({
        id: plantation.id,
        name: plantation.seedName,
        walletAddress: plantation.walletAddress,
      })),
    [plantations]
  );

  const firstPlantationId =
    defaultPlantationId ??
    plantationOptions[0]?.id ??
    undefined;

  const [plantationId, setPlantationId] = useState<string | undefined>(
    firstPlantationId
  );
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>(defaultCurrencyOptions[0]);
  const [issuedDate, setIssuedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [fileState, setFileState] = useState<FileState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWalletAddress = useMemo(() => {
    if (!plantationId) {
      return undefined;
    }
    return plantationOptions.find(
      (option) => option.id === plantationId
    )?.walletAddress;
  }, [plantationId, plantationOptions]);

  const resetForm = useCallback(() => {
    setTitle("");
    setAmount("");
    setCurrency(defaultCurrencyOptions[0]);
    setIssuedDate(new Date().toISOString().slice(0, 10));
    setNotes("");
    setFileState(null);
    setError(null);
    if (defaultPlantationId) {
      setPlantationId(defaultPlantationId);
    }
  }, [defaultPlantationId]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setFileState(null);
      return;
    }
    const fileName = file.name;
    setFileState({
      fileName,
      storageUrl: buildMockStorageUrl(fileName),
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!fileState) {
      setError("Attach a receipt file before uploading.");
      return;
    }
    if (!amount || Number.isNaN(Number.parseFloat(amount))) {
      setError("Enter a valid amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const receipt = addReceipt({
        plantationId,
        walletAddress: selectedWalletAddress,
        title: title.trim() || fileState.fileName,
        fileName: fileState.fileName,
        storageUrl: fileState.storageUrl,
        amount: Number.parseFloat(amount),
        currency,
        issuedDate,
        notes: notes.trim() || undefined,
      });

      addAlert({
        type: "system",
        severity: "info",
        title: "Receipt uploaded",
        description: `${receipt.title} recorded for ${currency} ${receipt.amount.toFixed(
          2
        )}.`,
      });

      resetForm();
      onClose();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload receipt. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Upload finance receipt"
      description="Log expenditure receipts to keep cooperative finances transparent."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-cocoa-600">
            Plantation
            <select
              value={plantationId ?? ""}
              onChange={(event) =>
                setPlantationId(event.target.value || undefined)
              }
              className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            >
              <option value="">General cooperative</option>
              {plantationOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-cocoa-600">
            Issued date
            <input
              type="date"
              value={issuedDate}
              onChange={(event) => setIssuedDate(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
              required
            />
          </label>
        </div>

        <label className="block text-sm text-cocoa-600">
          Receipt title
          <input
            type="text"
            value={title}
            placeholder="e.g. Fertiliser delivery"
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-[1fr,0.6fr]">
          <label className="text-sm text-cocoa-600">
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
              placeholder="0.00"
              required
            />
          </label>

          <label className="text-sm text-cocoa-600">
            Currency
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            >
              {defaultCurrencyOptions.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm text-cocoa-600">
          Attach receipt
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-500 shadow-sm file:mr-3 file:rounded-full file:border-0 file:bg-cocoa-900 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-cream-100 hover:border-cocoa-400 focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          {fileState ? (
            <p className="mt-1 text-xs text-cocoa-500">
              Selected: <span className="font-medium">{fileState.fileName}</span>
            </p>
          ) : null}
        </label>

        <label className="block text-sm text-cocoa-600">
          Notes (optional)
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            placeholder="Add context for finance reviewers..."
          />
        </label>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/80 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-full border border-cocoa-200 px-4 py-2 text-sm font-semibold text-cocoa-600 transition hover:border-cocoa-300 hover:text-cocoa-900 focus:outline-none focus:ring-2 focus:ring-cocoa-300 focus:ring-offset-2 focus:ring-offset-cream-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "rounded-full bg-cocoa-900 px-5 py-2 text-sm font-semibold text-cream-50 shadow transition focus:outline-none focus:ring-2 focus:ring-cocoa-500 focus:ring-offset-2 focus:ring-offset-cream-50",
              isSubmitting && "cursor-not-allowed opacity-70"
            )}
          >
            {isSubmitting ? "Uploading…" : "Save receipt"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


