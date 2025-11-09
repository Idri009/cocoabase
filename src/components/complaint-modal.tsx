"use client";

import {
  useState,
  useMemo,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Modal from "@/components/ui/modal";
import {
  useEngagementStore,
  type ComplaintAttachment,
  type ComplaintPriority,
} from "@/store/engagement";
import { usePlantationsStore } from "@/store/plantations";
import { useAlertsStore } from "@/store/alerts";
import { cn } from "@/lib/cn";

type ComplaintModalProps = {
  open: boolean;
  onClose: () => void;
  defaultCategory?: string;
  defaultPlantationId?: string;
};

const categories = [
  "logistics",
  "payments",
  "technology",
  "governance",
  "other",
];

const priorities: ComplaintPriority[] = ["low", "medium", "high"];

const buildMockAttachment = (file: File): ComplaintAttachment => ({
  id: `file-${Math.random().toString(36).slice(2, 9)}`,
  fileName: file.name,
  storageUrl: `https://mock.cocoachain.storage/support/${encodeURIComponent(
    file.name
  )}`,
});

export default function ComplaintModal({
  open,
  onClose,
  defaultCategory = "logistics",
  defaultPlantationId,
}: ComplaintModalProps) {
  const addComplaint = useEngagementStore((state) => state.addComplaint);
  const plantations = usePlantationsStore((state) => state.plantations);
  const addAlert = useAlertsStore((state) => state.addAlert);

  const plantationOptions = useMemo(
    () =>
      plantations.map((plantation) => ({
        id: plantation.id,
        name: plantation.seedName,
        location: plantation.location,
        walletAddress: plantation.walletAddress,
      })),
    [plantations]
  );

  const [plantationId, setPlantationId] = useState<string | undefined>(
    defaultPlantationId ?? plantationOptions[0]?.id
  );
  const [category, setCategory] = useState<string>(defaultCategory);
  const [priority, setPriority] = useState<ComplaintPriority>("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<ComplaintAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedWallet = useMemo(() => {
    if (!plantationId) {
      return undefined;
    }
    return plantationOptions.find(
      (item) => item.id === plantationId
    )?.walletAddress;
  }, [plantationId, plantationOptions]);

  const resetForm = useCallback(() => {
    setCategory(defaultCategory);
    setPriority("medium");
    setSubject("");
    setDescription("");
    setAttachments([]);
    setError(null);
    if (defaultPlantationId) {
      setPlantationId(defaultPlantationId);
    }
  }, [defaultCategory, defaultPlantationId]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      setAttachments([]);
      return;
    }
    const mapped = Array.from(files).map((file) => buildMockAttachment(file));
    setAttachments(mapped);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject.trim()) {
      setError("Provide a subject for the complaint.");
      return;
    }
    if (!description.trim()) {
      setError("Describe the issue so the cooperative team can respond.");
      return;
    }

    setIsSubmitting(true);
    try {
      const complaint = addComplaint({
        plantationId,
        walletAddress: selectedWallet,
        category,
        priority,
        subject: subject.trim(),
        description: description.trim(),
        attachments,
      });

      addAlert({
        type: "system",
        severity: priority === "high" ? "warning" : "info",
        title: "Complaint submitted",
        description: `Support team notified about “${complaint.subject}”.`,
      });

      resetForm();
      onClose();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit complaint. Try again."
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
      title="File a support complaint"
      description="Raise issues with logistics, payments, or technology so the cooperative can assist quickly."
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
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="space-y-2 rounded-2xl border border-cream-200 bg-cream-50/70 p-4">
          <legend className="px-2 text-xs font-semibold uppercase tracking-[0.25em] text-cocoa-500">
            Priority
          </legend>
          <div className="flex flex-wrap gap-3">
            {priorities.map((option) => (
              <label
                key={option}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition",
                  priority === option
                    ? "border-cocoa-900 bg-cocoa-900 text-cream-50"
                    : "border-cream-300 bg-white text-cocoa-600 hover:border-cocoa-300"
                )}
              >
                <input
                  type="radio"
                  name="priority"
                  value={option}
                  checked={priority === option}
                  onChange={() => setPriority(option)}
                  className="hidden"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block text-sm text-cocoa-600">
          Subject
          <input
            type="text"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Summarise the issue..."
            className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            required
          />
        </label>

        <label className="block text-sm text-cocoa-600">
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            placeholder="Share specific details to help the support team respond quickly."
            className="mt-1 w-full rounded-2xl border border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-800 shadow-sm focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
            required
          />
        </label>

        <label className="block text-sm text-cocoa-600">
          Attach files (optional)
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 flex w-full cursor-pointer items-center justify-between rounded-2xl border border-dashed border-cream-300 bg-white px-3 py-2 text-sm text-cocoa-500 shadow-sm file:mr-3 file:rounded-full file:border-0 file:bg-cocoa-900 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-cream-100 hover:border-cocoa-400 focus:border-cocoa-400 focus:outline-none focus:ring-2 focus:ring-cocoa-200"
          />
          {attachments.length ? (
            <ul className="mt-2 space-y-1 text-xs text-cocoa-500">
              {attachments.map((attachment) => (
                <li key={attachment.id} className="truncate">
                  {attachment.fileName}
                </li>
              ))}
            </ul>
          ) : null}
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
              "rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-cocoa-900 shadow transition focus:outline-none focus:ring-2 focus:ring-leaf-400 focus:ring-offset-2 focus:ring-offset-cream-50",
              isSubmitting && "cursor-not-allowed opacity-70"
            )}
          >
            {isSubmitting ? "Submitting…" : "Submit complaint"}
          </button>
        </div>
      </form>
    </Modal>
  );
}


