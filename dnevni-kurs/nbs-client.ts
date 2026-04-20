/**
 * NBS (Narodna Banka Srbije) SOAP API Client
 *
 * NBS exposes a SOAP/XML web service at:
 *   https://www.nbs.rs/kursnaListaModul/naZeljeniDan.faces
 *
 * We always extract the MIDDLE rate (srednji kurs) for tax purposes.
 * Ref: https://www.nbs.rs/sr_Latn/finansijske_institucije/medjunarodne_finansije/kursna_lista/
 */

export interface NbsRate {
  currency: string;       // ISO 4217 code, e.g. "USD"
  currencyName: string;   // Human-readable name
  unit: number;           // How many foreign units = 1 dinar basis (usually 1)
  buyingRate: number;
  middleRate: number;
  sellingRate: number;
  listDate: string;       // "YYYY-MM-DD" — the date NBS published this list FOR
}

export interface NbsFetchResult {
  success: true;
  listDate: string;
  rates: NbsRate[];
}

export interface NbsFetchError {
  success: false;
  error: string;
}

export type NbsResult = NbsFetchResult | NbsFetchError;

// ─── SOAP Envelope ───────────────────────────────────────────────────────────

/**
 * Builds the SOAP request body for a given date.
 * listType: 1 = today's list, 2 = next business day's list
 */
function buildSoapEnvelope(date: string, listType: 1 | 2 = 1): string {
  // date format expected by NBS: DD.MM.YYYY
  const [year, month, day] = date.split("-");
  const nbsDate = `${day}.${month}.${year}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:ks="http://www.nbs.rs/xsds/kursna_lista">
  <soapenv:Header/>
  <soapenv:Body>
    <ks:getKursnaListaByDateAndTipRequest>
      <ks:datum>${nbsDate}</ks:datum>
      <ks:tipListe>${listType}</ks:tipListe>
    </ks:getKursnaListaByDateAndTipRequest>
  </soapenv:Body>
</soapenv:Envelope>`;
}

// ─── XML Parser (no external deps — built-in regex for simple SOAP response) ─

function parseXmlValue(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<[^>]*${tag}[^>]*>([^<]*)<`, "i"));
  return match ? match[1].trim() : "";
}

function parseDecimal(value: string): number {
  // NBS uses comma as decimal separator in some responses
  return parseFloat(value.replace(",", "."));
}

function parseSoapResponse(xml: string): NbsRate[] {
  const rates: NbsRate[] = [];

  // Each currency is wrapped in <item> or <stavka> elements
  const itemRegex = /<(?:item|stavka)>([\s\S]*?)<\/(?:item|stavka)>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const currencyCode = parseXmlValue(block, "oznaka|sifra|currency");
    const currencyName = parseXmlValue(block, "naziv|name|currencyName");
    const unit         = parseInt(parseXmlValue(block, "jedinica|unit") || "1", 10);
    const buying       = parseDecimal(parseXmlValue(block, "kupovni|buying|buyRate"));
    const middle       = parseDecimal(parseXmlValue(block, "srednji|middle|middleRate"));
    const selling      = parseDecimal(parseXmlValue(block, "prodajni|selling|sellRate"));

    if (currencyCode && !isNaN(middle) && middle > 0) {
      rates.push({
        currency:     currencyCode.toUpperCase(),
        currencyName: currencyName || currencyCode,
        unit:         isNaN(unit) ? 1 : unit,
        buyingRate:   isNaN(buying) ? middle : buying,
        middleRate:   middle,
        sellingRate:  isNaN(selling) ? middle : selling,
        listDate:     "", // filled in after
      });
    }
  }

  return rates;
}

function extractListDate(xml: string): string {
  // NBS returns the date the list is valid FOR
  const raw = parseXmlValue(xml, "datumListe|listDate|datum");
  if (!raw) return "";

  // Normalize DD.MM.YYYY → YYYY-MM-DD
  const parts = raw.split(".");
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }
  return raw;
}

// ─── Main Fetcher ─────────────────────────────────────────────────────────────

const NBS_SOAP_URL = "https://www.nbs.rs/kursnaListaModul/naZeljeniDan.faces";
const FETCH_TIMEOUT_MS = 15_000;

export async function fetchNbsRates(
  date: string,           // YYYY-MM-DD
  listType: 1 | 2 = 1,   // 1 = current, 2 = next business day
): Promise<NbsResult> {
  const soapBody = buildSoapEnvelope(date, listType);

  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch(NBS_SOAP_URL, {
      method:  "POST",
      headers: {
        "Content-Type": "text/xml; charset=UTF-8",
        "SOAPAction":   '""',
        "User-Agent":   "FreelanceAppSrb/1.0 (tax-compliant rate fetcher)",
      },
      body:   soapBody,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        success: false,
        error: `NBS HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const xml = await response.text();

    // Check for SOAP fault
    if (xml.includes("<faultcode>") || xml.includes("<soap:Fault>")) {
      const faultMsg = parseXmlValue(xml, "faultstring|Reason");
      return {
        success: false,
        error: `NBS SOAP fault: ${faultMsg || "unknown error"}`,
      };
    }

    const listDate = extractListDate(xml);
    const rates    = parseSoapResponse(xml);

    if (rates.length === 0) {
      return {
        success: false,
        error:   "NBS returned 0 rates — likely a holiday or the list is not yet published.",
      };
    }

    // Stamp each rate with the NBS list date
    const stampedRates = rates.map((r) => ({ ...r, listDate: listDate || date }));

    return { success: true, listDate: listDate || date, rates: stampedRates };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "AbortError") {
      return { success: false, error: `NBS API timed out after ${FETCH_TIMEOUT_MS / 1000}s` };
    }
    return { success: false, error: `Network error: ${String(err)}` };
  }
}

// ─── Convenience: fetch for "today" or "tomorrow" ────────────────────────────

export async function fetchTodayRates(): Promise<NbsResult> {
  const today = new Date().toISOString().slice(0, 10);
  return fetchNbsRates(today, 1);
}

export async function fetchTomorrowRates(): Promise<NbsResult> {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  return fetchNbsRates(tomorrow, 2);
}
