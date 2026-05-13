export type TemplateCategory =
  | "birthday"
  | "anniversary"
  | "festival"
  | "quotes";

export type GreetingTemplate = {
  id: string;
  title: string;
  category: TemplateCategory;
  imageUrl: string;
  premium: boolean;
};

export const CATEGORY_LABELS: Record<TemplateCategory, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  festival: "Festivals",
  quotes: "Quotes",
};

const TEMPLATE_ASSET_REV = "5";

function publicTemplate(relPath: string): string {
  const base = import.meta.env.BASE_URL;
  const encoded = relPath
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const url = `${base}${encoded}`;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${TEMPLATE_ASSET_REV}`;
}

export const TEMPLATES: GreetingTemplate[] = [
  {
    id: "b1",
    title: "Birthday 1",
    category: "birthday",
    imageUrl: publicTemplate("templates/birthdays/birthday-1.jpg"),
    premium: false,
  },
  {
    id: "b2",
    title: "Birthday 2",
    category: "birthday",
    imageUrl: publicTemplate("templates/birthdays/birthday-2.jpg"),
    premium: false,
  },
  {
    id: "b3",
    title: "Birthday 3",
    category: "birthday",
    imageUrl: publicTemplate("templates/birthdays/birthday-3.jpg"),
    premium: false,
  },
  {
    id: "b4",
    title: "Birthday 4",
    category: "birthday",
    imageUrl: publicTemplate("templates/birthdays/birthday-4.jpg"),
    premium: false,
  },
  {
    id: "a1",
    title: "Anniversary 1",
    category: "anniversary",
    imageUrl: publicTemplate("templates/anniversary/Anniversary.jpg"),
    premium: false,
  },
  {
    id: "a2",
    title: "Anniversary 2",
    category: "anniversary",
    imageUrl: publicTemplate("templates/anniversary/Anniversary-2.jpg"),
    premium: false,
  },
  {
    id: "a3",
    title: "Anniversary 3",
    category: "anniversary",
    imageUrl: publicTemplate("templates/anniversary/annivesary-3.jpg"),
    premium: false,
  },
  {
    id: "a4",
    title: "Anniversary 4",
    category: "anniversary",
    imageUrl: publicTemplate("templates/anniversary/download.jpg"),
    premium: false,
  },
  {
    id: "a5",
    title: "Wedding anniversary",
    category: "anniversary",
    imageUrl: publicTemplate(
      "templates/anniversary/Wedding Anniversary Card.jpg"
    ),
    premium: false,
  },
  {
    id: "f1",
    title: "Holi",
    category: "festival",
    imageUrl: publicTemplate("templates/festivals/holi-1.jpg"),
    premium: false,
  },
  {
    id: "f2",
    title: "Christmas 1",
    category: "festival",
    imageUrl: publicTemplate("templates/festivals/christmas-1.jpg"),
    premium: false,
  },
  {
    id: "f3",
    title: "Christmas 2",
    category: "festival",
    imageUrl: publicTemplate("templates/festivals/christmas-2.jpg"),
    premium: false,
  },
  {
    id: "f4",
    title: "Christmas sparkle",
    category: "festival",
    imageUrl: publicTemplate("templates/festivals/Christmas template.jpg"),
    premium: false,
  },
  {
    id: "q1",
    title: "Inspirational pack",
    category: "quotes",
    imageUrl: publicTemplate("templates/quotes/10 Inspirational quotes.jpg"),
    premium: false,
  },
  {
    id: "q2",
    title: "Life quotes",
    category: "quotes",
    imageUrl: publicTemplate("templates/quotes/Life quotes.jpg"),
    premium: false,
  },
  {
    id: "q3",
    title: "Printable quotes",
    category: "quotes",
    imageUrl: publicTemplate(
      "templates/quotes/Printable inspirational quotes.jpg"
    ),
    premium: false,
  },
  {
    id: "q4",
    title: "Quote of the day",
    category: "quotes",
    imageUrl: publicTemplate("templates/quotes/quotes of the day.jpg"),
    premium: false,
  },
];

/**
 * Per category, alternate Free → Premium → Free → … so you never get an
 * all‑premium row by chance (the old `Math.random()` could mark every card
 * in a small category as premium).
 */
export function withBalancedPremium(
  items: GreetingTemplate[]
): GreetingTemplate[] {
  const idxByCategory = new Map<TemplateCategory, number>();
  return items.map((item) => {
    const i = idxByCategory.get(item.category) ?? 0;
    idxByCategory.set(item.category, i + 1);
    return { ...item, premium: i % 2 === 1 };
  });
}
