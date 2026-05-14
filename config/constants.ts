export const TAX_CONSTANTS = {
  2026: {
    // Common rates (as fractions)
    TAX_RATE_A: 0.2, // Model A income tax
    TAX_RATE_B: 0.1, // Model B income tax
    PIO_RATE: 0.24, // Pension & Disability
    HEALTH_RATE: 0.103, // Health insurance

    // Model A (Opcija 1) - Fixed deduction
    MODEL_A_FIXED_QUARTER: 110_647,

    // Model B (Opcija 2) - Fixed + percentage
    MODEL_B_FIXED_PART: 66_733,
    MODEL_B_PERCENT: 0.34,

    // PIO Minimum (Model B only)
    MODEL_B_PIO_MIN_QUARTER: 36_934,

    // Health Minimum (if uncovered)
    HEALTH_MIN_QUARTER: 7_003,

    // Lowest monthly base
    LOWEST_MONTHLY_BASE: 51_297,

    // Quarterly multiplier
    QUARTER_MONTHS: 3,
  },
};

// ─── Transaction Categories ───────────────────────────────────────────────────

export const transactionCategories = [
  "salary",
  "freelance_income",
  "client_payment",
  "subscription",
  "software",
  "hosting",
  "domain",
  "marketing",
  "advertising",
  "equipment",
  "office",
  "coworking",
  "internet",
  "phone",
  "education",
  "course",
  "book",
  "travel",
  "transport",
  "food",
  "meal",
  "health",
  "insurance",
  "tax",
  "bank_fee",
  "withdrawal",
  "transfer",
  "investment",
  "savings",
  "refund",
  "gift",
  "entertainment",
  "gaming",
  "other",
] as const;

export type TransactionCategory = (typeof transactionCategories)[number];

// db/seed/data/municipalities.ts

export type MunicipalitySeed = {
  code: string;
  name: string;
  city?: string;
};

export const MUNICIPALITIES: MunicipalitySeed[] = [
  // --- BEOGRAD ---
  { code: "VOZDOVAC", name: "Voždovac", city: "Beograd" },
  { code: "VRACAR", name: "Vračar", city: "Beograd" },
  { code: "ZVEZDARA", name: "Zvezdara", city: "Beograd" },
  { code: "ZEMUN", name: "Zemun", city: "Beograd" },
  { code: "NOVI_BEOGRAD", name: "Novi Beograd", city: "Beograd" },
  { code: "PALILULA_BG", name: "Palilula (Beograd)", city: "Beograd" },
  { code: "RAKOVICA", name: "Rakovica", city: "Beograd" },
  { code: "SAVSKI_VENAC", name: "Savski Venac", city: "Beograd" },
  { code: "STARI_GRAD_BG", name: "Stari Grad (Beograd)", city: "Beograd" },
  { code: "CUKARICA", name: "Čukarica", city: "Beograd" },
  { code: "GROCKA", name: "Grocka", city: "Beograd" },
  { code: "OBRENOVAC", name: "Obrenovac", city: "Beograd" },
  { code: "LAZAREVAC", name: "Lazarevac", city: "Beograd" },
  { code: "MLADENOVAC", name: "Mladenovac", city: "Beograd" },
  { code: "SOPOT", name: "Sopot", city: "Beograd" },
  { code: "SURCIN", name: "Surčin", city: "Beograd" },
  { code: "BARAJEVO", name: "Barajevo", city: "Beograd" },

  // --- VOJVODINA ---
  { code: "NOVI_SAD", name: "Novi Sad" },
  { code: "SUBOTICA", name: "Subotica" },
  { code: "ZRENJANIN", name: "Zrenjanin" },
  { code: "PANCEVO", name: "Pančevo" },
  { code: "SOMBOR", name: "Sombor" },
  { code: "SREMSKA_MITROVICA", name: "Sremska Mitrovica" },
  { code: "KIKINDA", name: "Kikinda" },
  { code: "VRBAS", name: "Vrbas" },
  { code: "RUMA", name: "Ruma" },
  { code: "INDJIJA", name: "Inđija" },
  { code: "STARA_PAZOVA", name: "Stara Pazova" },
  { code: "BACKA_TOPOLA", name: "Bačka Topola" },
  { code: "TEMERIN", name: "Temerin" },
  { code: "APATIN", name: "Apatin" },
  { code: "KULA", name: "Kula" },
  { code: "ODZACI", name: "Odžaci" },
  { code: "SRBOBRAN", name: "Srbobran" },
  { code: "BEOCIN", name: "Beočin" },
  { code: "BACKI_PETROVAC", name: "Bački Petrovac" },
  { code: "ZABALJ", name: "Žabalj" },
  { code: "KOVACICA", name: "Kovačica" },
  { code: "OPOVO", name: "Opovo" },

  // --- ŠUMADIJA & ZAPADNA SRBIJA ---
  { code: "KRAGUJEVAC", name: "Kragujevac" },
  { code: "ARANDJELOVAC", name: "Aranđelovac" },
  { code: "TOPOLA", name: "Topola" },
  { code: "BATOCINA", name: "Batočina" },
  { code: "RACA", name: "Rača" },
  { code: "LAPOVO", name: "Lapovo" },
  { code: "VALJEVO", name: "Valjevo" },
  { code: "MIONICA", name: "Mionica" },
  { code: "LJIG", name: "Ljig" },
  { code: "OSEČINA", name: "Osečina" },
  { code: "UB", name: "Ub" },
  { code: "SABAC", name: "Šabac" },
  { code: "LOZNICA", name: "Loznica" },
  { code: "KRUPANJ", name: "Krupanj" },
  { code: "MALI_ZVORNIK", name: "Mali Zvornik" },
  { code: "LJUBOVIJA", name: "Ljubovija" },
  { code: "BOGATIC", name: "Bogatić" },
  { code: "KOCELEVA", name: "Koceljeva" },
  { code: "VLADIMIRCI", name: "Vladimirci" },

  // --- CENTRAL ---
  { code: "KRUSEVAC", name: "Kruševac" },
  { code: "TRSTENIK", name: "Trstenik" },
  { code: "VRNJACKA_BANJA", name: "Vrnjačka Banja" },
  { code: "ALEKSANDROVAC", name: "Aleksandrovac" },
  { code: "BRUS", name: "Brus" },
  { code: "VARVARIN", name: "Varvarin" },
  { code: "CICEVAC", name: "Ćićevac" },
  { code: "KRALJEVO", name: "Kraljevo" },
  { code: "CACAK", name: "Čačak" },
  { code: "GORNJI_MILANOVAC", name: "Gornji Milanovac" },
  { code: "LUČANI", name: "Lučani" },

  // --- SOUTH ---
  { code: "NIS", name: "Niš" },
  { code: "LESKOVAC", name: "Leskovac" },
  { code: "VRANJE", name: "Vranje" },
  { code: "PIROT", name: "Pirot" },
  { code: "PROKUPLJE", name: "Prokuplje" },
  { code: "KURSUMLIJA", name: "Kuršumlija" },
  { code: "BLACE", name: "Blace" },
  { code: "ZITORADJA", name: "Žitorađa" },
  { code: "DOLJEVAC", name: "Doljevac" },
  { code: "MEROSINA", name: "Merošina" },
  { code: "GADZIN_HAN", name: "Gadžin Han" },
  { code: "SVRLJIG", name: "Svrljig" },
  { code: "BELA_PALANKA", name: "Bela Palanka" },
  { code: "BABUSNICA", name: "Babušnica" },

  // --- EAST ---
  { code: "ZAJECAR", name: "Zaječar" },
  { code: "BOR", name: "Bor" },
  { code: "KNJAZEVAC", name: "Knjaževac" },
  { code: "NEGOTIN", name: "Negotin" },
  { code: "MAJDANPEK", name: "Majdanpek" },
  { code: "KLADOVO", name: "Kladovo" },

  // --- SANDZAK ---
  { code: "NOVI_PAZAR", name: "Novi Pazar" },
  { code: "TUTIN", name: "Tutin" },
  { code: "SJENICA", name: "Sjenica" },
  { code: "PRIJEPOLJE", name: "Prijepolje" },
  { code: "PRIBOJ", name: "Priboj" },
  { code: "NOVA_VAROS", name: "Nova Varoš" },

  // --- KOSOVO ---
  { code: "KOSOVSKA_MITROVICA", name: "Kosovska Mitrovica" },
];
