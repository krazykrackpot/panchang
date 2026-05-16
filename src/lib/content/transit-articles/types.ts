export interface MoonSignEffect {
  rashiId: number;
  house: number;
  headline: string;
  body: string;
  dosAndDonts: string[];
  remedy: string;
}

export interface KeyDate {
  date: string;
  event: string;
  significance: string;
}

export interface TransitArticle {
  slug: string;
  planetId: number;
  fromSignId: number;
  toSignId: number;
  year: number;
  exactDate: string;
  endDate: string;
  duration: string;
  title: { en: string; hi: string };
  metaDescription: { en: string; hi: string };
  overview: { en: string; hi: string };
  generalThemes: { en: string; hi: string }[];
  moonSignEffects: MoonSignEffect[];
  keyDates: KeyDate[];
  retrogradeNote?: string;
  publishDate: string;
}
