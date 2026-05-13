import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Gift,
  Heart,
  Sparkles,
  Share2,
  LogOut,
  Crown,
  Quote,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  TEMPLATES,
  CATEGORY_LABELS,
  withBalancedPremium,
  type TemplateCategory,
  type GreetingTemplate,
} from "@/data/templates";
import GreetingCardPreview from "@/components/GreetingCardPreview";
import PremiumModal from "@/components/PremiumModal";
import TemplatePreviewModal from "@/components/TemplatePreviewModal";
import { defaultAvatarFromSeed } from "@/lib/defaultAvatar";

const SUB_KEY = "greetings-premium-demo";

function readSubscribed(): boolean {
  return localStorage.getItem(SUB_KEY) === "1";
}

function writeSubscribed(v: boolean) {
  if (v) localStorage.setItem(SUB_KEY, "1");
  else localStorage.removeItem(SUB_KEY);
}

const categoryIcons: Record<TemplateCategory, LucideIcon> = {
  birthday: Gift,
  anniversary: Heart,
  festival: Sparkles,
  quotes: Quote,
};

/** How many times the category list is repeated in the strip (even). Fewer templates need more repeats so the row overflows and can auto-scroll / trackpad scroll. */
const STRIP_REPEAT = 8;

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [category, setCategory] = useState<TemplateCategory>("birthday");
  const [selected, setSelected] = useState<GreetingTemplate | null>(null);
  const [hovered, setHovered] = useState<GreetingTemplate | null>(null);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumUpsellTitle, setPremiumUpsellTitle] = useState<string>();
  const [subscribed, setSubscribed] = useState(readSubscribed);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewModalTemplate, setPreviewModalTemplate] =
    useState<GreetingTemplate | null>(null);

  const displayName = profile?.displayName ?? "Guest";
  const photoUrl =
    profile?.photoUrl ?? defaultAvatarFromSeed(user?.id ?? displayName);

  const deck = useMemo(() => withBalancedPremium(TEMPLATES), []);

  const filtered = useMemo(
    () => deck.filter((t) => t.category === category),
    [deck, category]
  );

  const stripItems = useMemo(
    () =>
      filtered.length === 0
        ? []
        : Array.from({ length: STRIP_REPEAT }).flatMap(() => filtered),
    [filtered]
  );

  const stripRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollLeft = 0;
  }, [category, filtered]);

  useEffect(() => {
    const el = stripRef.current;
    if (!el || filtered.length === 0) return;
    let paused = false;
    let raf = 0;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    const tick = () => {
      if (!paused) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 2) {
          el.scrollLeft += 0.45;
          const seqW = el.scrollWidth / STRIP_REPEAT;
          if (seqW > 0 && el.scrollLeft >= seqW) {
            el.scrollLeft -= seqW;
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, [filtered, category]);

  useEffect(() => {
    const list = deck.filter((t) => t.category === category);
    const freeFirst = list.find((t) => !t.premium) ?? list[0] ?? null;
    setSelected(freeFirst);
    setHovered(null);
    setPreviewModalOpen(false);
    setPreviewModalTemplate(null);
  }, [category, deck]);

  const openPreviewModal = useCallback((t: GreetingTemplate) => {
    setPreviewModalTemplate(t);
    setPreviewModalOpen(true);
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewModalOpen(false);
    setPreviewModalTemplate(null);
  }, []);

  const pickTemplate = useCallback(
    (t: GreetingTemplate) => {
      if (t.premium && !subscribed) {
        setPremiumUpsellTitle(t.title);
        setPremiumOpen(true);
        return;
      }
      setSelected(t);
      openPreviewModal(t);
    },
    [subscribed, openPreviewModal]
  );

  const previewTemplate =
    hovered ?? selected ?? filtered[0] ?? deck[0] ?? TEMPLATES[0];

  const openSharePreview = useCallback(() => {
    if (previewTemplate.premium && !subscribed) {
      setPremiumUpsellTitle(previewTemplate.title);
      setPremiumOpen(true);
      return;
    }
    setSelected(previewTemplate);
    openPreviewModal(previewTemplate);
  }, [previewTemplate, subscribed, openPreviewModal]);

  const subscribeDemo = () => {
    writeSubscribed(true);
    setSubscribed(true);
  };

  const closePremiumModal = () => {
    setPremiumOpen(false);
    setPremiumUpsellTitle(undefined);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24">
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-white">Custom Greetings</h1>
            <p className="text-sm text-slate-400">Hi, {displayName}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_LABELS) as TemplateCategory[]).map((cat) => {
            const Icon = categoryIcons[cat];
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "bg-slate-900/80 text-slate-400 ring-1 ring-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Templates — live preview with your photo
          </h2>
          <div
            ref={stripRef}
            className="no-scrollbar -mx-1 flex flex-nowrap gap-5 overflow-x-auto overflow-y-visible overscroll-x-contain px-2 py-6 scroll-smooth touch-pan-x md:gap-6"
            onMouseLeave={() => setHovered(null)}
          >
            {stripItems.map((t, idx) => {
              const isHoverRing = hovered?.id === t.id;
              const isThisHovered = hovered?.id === t.id;
              return (
                <button
                  key={`${t.id}-${idx}`}
                  type="button"
                  onMouseEnter={() => setHovered(t)}
                  onFocus={() => setHovered(t)}
                  onClick={() => pickTemplate(t)}
                  className="relative z-0 flex w-[min(92vw,20rem)] min-w-[15rem] shrink-0 flex-col items-stretch text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 sm:min-w-[17rem] sm:w-72 md:w-80"
                >
                  <div
                    className={`relative origin-center rounded-2xl ring-offset-2 ring-offset-slate-950 transition duration-200 ease-out ${
                      isHoverRing
                        ? "z-30 ring-2 ring-violet-500"
                        : "ring-0 ring-transparent"
                    } ${
                      isThisHovered
                        ? "scale-[1.05] shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
                        : "z-0"
                    }`}
                  >
                    <GreetingCardPreview
                      template={t}
                      displayName={displayName}
                      photoUrl={photoUrl}
                      compact={false}
                      prominentOverlay
                    />
                    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-wrap gap-1">
                      {t.premium ? (
                        <span className="flex items-center gap-0.5 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-950 shadow-sm">
                          <Crown className="h-3.5 w-3.5" />
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase text-slate-950 shadow-sm">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 w-full max-w-full truncate px-0.5 text-center text-base font-semibold text-slate-200">
                    {t.title}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mx-auto mt-10 max-w-md px-1">
            <button
              type="button"
              onClick={openSharePreview}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:bg-emerald-500"
            >
              <Share2 className="h-5 w-5" />
              Share greeting
            </button>
          </div>
        </section>
      </main>

      <TemplatePreviewModal
        open={previewModalOpen}
        template={previewModalTemplate}
        displayName={displayName}
        photoUrl={photoUrl}
        onClose={closePreviewModal}
      />

      <PremiumModal
        open={premiumOpen}
        templateTitle={premiumUpsellTitle}
        onClose={closePremiumModal}
        onSubscribeDemo={subscribeDemo}
      />
    </div>
  );
}
