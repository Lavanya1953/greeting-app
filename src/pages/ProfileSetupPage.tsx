import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { defaultAvatarFromSeed } from "@/lib/defaultAvatar";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fallbackAvatar = useMemo(
    () => defaultAvatarFromSeed(user?.id ?? ""),
    [user?.id]
  );

  const handleFile = (f: File | null) => {
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    updateProfile({
      displayName: trimmed,
      photoUrl: photoPreview ?? defaultAvatarFromSeed(user?.id ?? trimmed),
    });
    navigate("/", { replace: true });
  };

  const circleSrc = photoPreview ?? fallbackAvatar;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-white">Your profile</h1>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative mx-auto flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-indigo-500/50 bg-slate-800 ring-2 ring-slate-700"
        >
          <img
            src={circleSrc}
            alt=""
            className="h-full w-full object-cover"
          />
          <span className="absolute bottom-1 right-1 rounded-full bg-indigo-600 p-1.5 text-white shadow">
            <Camera className="h-4 w-4" />
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-300">
            Display name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none ring-indigo-500 focus:ring-2"
            placeholder="e.g. Alex Kumar"
            autoFocus
          />
        </label>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-500"
        >
          Continue to templates
          <ArrowRight className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
