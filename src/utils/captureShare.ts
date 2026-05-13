import html2canvas from "html2canvas";

const SHARE_TEXT =
  "My personalized greeting — choose WhatsApp, Instagram, Gmail, or another app from your device share menu.";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** HTTP(S) images from another origin taint the canvas; html2canvas then cannot produce a PNG blob. */
function isCrossOriginHttpImageSrc(src: string): boolean {
  if (!src.startsWith("http://") && !src.startsWith("https://")) {
    return false;
  }
  try {
    return new URL(src).origin !== window.location.origin;
  } catch {
    return true;
  }
}

/**
 * In the cloned DOM, replace cross-origin bitmaps so the canvas stays exportable.
 * Avatar slot gets an initial letter; any other foreign image becomes a 1×1 transparent pixel.
 */
function sanitizeCloneForExport(documentClone: Document, rootClone: HTMLElement) {
  const imgs = rootClone.querySelectorAll("img");
  imgs.forEach((img) => {
    const raw = img.currentSrc || img.getAttribute("src") || "";
    if (!isCrossOriginHttpImageSrc(raw)) return;

    const avatarRoot = img.closest("[data-capture-avatar]");
    if (avatarRoot) {
      const initial = (
        avatarRoot.getAttribute("data-capture-initial") || "?"
      )
        .trim()
        .charAt(0)
        .toUpperCase();
      const fallbackClass =
        avatarRoot.getAttribute("data-capture-fallback-class") ||
        "flex h-full w-full items-center justify-center font-semibold text-white text-3xl";
      img.remove();
      const span = documentClone.createElement("span");
      span.setAttribute("class", fallbackClass);
      span.textContent = initial || "?";
      avatarRoot.appendChild(span);
      return;
    }

    img.removeAttribute("crossorigin");
    img.setAttribute("src", TRANSPARENT_PIXEL);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Could not create image blob"));
      },
      "image/png",
      0.95
    );
  });
}

export async function captureElementToBlob(
  element: HTMLElement,
  scale = 2
): Promise<Blob> {
  const baseOpts = {
    scale,
    logging: false,
    backgroundColor: "#0f172a",
    scrollX: 0,
    scrollY: 0,
    onclone: (_documentClone: Document, cloned: HTMLElement) => {
      sanitizeCloneForExport(_documentClone, cloned);
    },
  };

  try {
    const canvas = await html2canvas(element, {
      ...baseOpts,
      useCORS: true,
      allowTaint: false,
    });
    return canvasToBlob(canvas);
  } catch (e) {
    console.warn("html2canvas (strict) failed, retrying with allowTaint", e);
    const canvas = await html2canvas(element, {
      ...baseOpts,
      useCORS: false,
      allowTaint: true,
    });
    return canvasToBlob(canvas);
  }
}

function isAbortError(e: unknown): boolean {
  return e instanceof DOMException && e.name === "AbortError";
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.rel = "noopener";
  a.style.position = "fixed";
  a.style.left = "-9999px";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 250);
}

export async function shareBlob(blob: Blob, title: string, fileName: string) {
  const file = new File([blob], fileName, { type: "image/png" });
  const payload: ShareData = {
    files: [file],
    title,
    text: SHARE_TEXT,
  };

  if (navigator.share) {
    if (typeof navigator.canShare === "function" && !navigator.canShare(payload)) {
      downloadBlob(blob, fileName);
      return;
    }
    try {
      await navigator.share(payload);
      return;
    } catch (e) {
      if (isAbortError(e)) return;
    }
  }

  downloadBlob(blob, fileName);
}
