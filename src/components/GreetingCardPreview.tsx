import { forwardRef } from "react";
import type { GreetingTemplate } from "@/data/templates";

/** Only same-origin (and resolved absolute) images can use crossOrigin without breaking load (e.g. Google profile photos). */
function crossOriginForCapture(src: string): "anonymous" | undefined {
  if (src.startsWith("data:") || src.startsWith("blob:")) return undefined;
  try {
    const resolved = new URL(src, window.location.href);
    return resolved.origin === window.location.origin ? "anonymous" : undefined;
  } catch {
    return undefined;
  }
}

type Props = {
  template: GreetingTemplate;
  displayName: string;
  photoUrl: string | null;
  /** Slightly smaller type scale in grid thumbnails */
  compact?: boolean;
  /** Larger avatar + name for wide template strips */
  prominentOverlay?: boolean;
};

const GreetingCardPreview = forwardRef<HTMLDivElement, Props>(
  ({ template, displayName, photoUrl, compact, prominentOverlay }, ref) => {
    const initial = displayName.trim().charAt(0).toUpperCase() || "?";

    const avatarClass = compact
      ? "h-14 w-14"
      : prominentOverlay
        ? "h-[5.5rem] w-[5.5rem]"
        : "h-24 w-24";

    const nameClass = compact
      ? "text-sm max-w-[90%] truncate"
      : prominentOverlay
        ? "text-3xl max-w-[95%] leading-tight drop-shadow-lg"
        : "text-2xl";

    const initialClass = compact
      ? "text-lg"
      : prominentOverlay
        ? "text-4xl"
        : "text-3xl";

    const bottomPad = prominentOverlay ? "gap-4 p-5 pb-8" : "gap-3 p-4 pb-6";

    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-2xl bg-slate-900 shadow-xl ring-1 ring-white/10"
        style={{ aspectRatio: "3 / 4" }}
      >
        <img
          src={template.imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          crossOrigin={crossOriginForCapture(template.imageUrl)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div
          className={`absolute bottom-0 left-0 right-0 flex flex-col items-center ${bottomPad}`}
        >
          <div
            className={`relative rounded-full border-4 border-white/90 shadow-lg ring-2 ring-violet-500/35 ${avatarClass} overflow-hidden bg-slate-700`}
            data-capture-avatar=""
            data-capture-initial={initial}
            data-capture-fallback-class={`flex h-full w-full items-center justify-center font-semibold text-white ${initialClass}`}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="h-full w-full object-cover"
                crossOrigin={crossOriginForCapture(photoUrl)}
              />
            ) : (
              <span
                className={`flex h-full w-full items-center justify-center font-semibold text-white ${initialClass}`}
              >
                {initial}
              </span>
            )}
          </div>
          <p
            className={`text-center font-semibold text-white drop-shadow-md ${nameClass}`}
          >
            {displayName.trim() || "Your name"}
          </p>
        </div>
      </div>
    );
  }
);

GreetingCardPreview.displayName = "GreetingCardPreview";

export default GreetingCardPreview;
