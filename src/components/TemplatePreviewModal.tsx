import { useRef, useState } from "react";
import { X, Share2, Download, Loader2 } from "lucide-react";
import type { GreetingTemplate } from "@/data/templates";
import GreetingCardPreview from "@/components/GreetingCardPreview";
import {
  captureElementToBlob,
  shareBlob,
  downloadBlob,
} from "@/utils/captureShare";

type Props = {
  open: boolean;
  template: GreetingTemplate | null;
  displayName: string;
  photoUrl: string | null;
  onClose: () => void;
};

function waitNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export default function TemplatePreviewModal({
  open,
  template,
  displayName,
  photoUrl,
  onClose,
}: Props) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);

  if (!open || !template) return null;

  const fileStem = template.title.replace(/\s+/g, "-").toLowerCase();

  const runCapture = async (): Promise<Blob | null> => {
    await waitNextPaint();
    const el = captureRef.current;
    if (!el) {
      alert("Could not read the preview. Close and open the preview again.");
      return null;
    }
    try {
      return await captureElementToBlob(el);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const handleShare = async () => {
    setBusy(true);
    try {
      const blob = await runCapture();
      if (!blob) return;
      await shareBlob(blob, "My greeting", `${fileStem}.png`);
    } catch (e) {
      console.error(e);
      alert(
        "Could not create or share the image. Try Download, or use another browser if this keeps failing."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    setBusy(true);
    try {
      const blob = await runCapture();
      if (!blob) return;
      downloadBlob(blob, `${fileStem}.png`);
    } catch (e) {
      console.error(e);
      alert("Could not create the image file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 bg-black/75 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
        <h2
          id="preview-modal-title"
          className="pr-10 text-lg font-semibold text-white"
        >
          Preview — {template.title}
        </h2>

        <div className="mx-auto mt-5 w-full max-w-[280px]">
          <GreetingCardPreview
            ref={captureRef}
            template={template}
            displayName={displayName}
            photoUrl={photoUrl}
            prominentOverlay
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
            Share
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-600 py-3 font-semibold text-slate-100 transition hover:bg-white/5 disabled:opacity-60"
          >
            <Download className="h-5 w-5" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
