import type { App } from "vue";
import { computed, type Ref } from "vue";

// Tipagem para os valores de usuário
type RoleType = "ADMIN" | "CUSTOMER" | "SUPPORT";

// Mapeamento dos papéis de usuário
const roleUserMap: Record<RoleType, string> = {
  ADMIN: "Administrador",
  CUSTOMER: "Gerente",
  SUPPORT: "Usuário padrão",
};

// Função de filtro para formatar papéis de usuário
export function roleUserFilter(value: RoleType): string {
  return roleUserMap[value] || value;
}

// Função para formatar CNPJ
export function formatCnpj(cnpj: string): string {
  if (!cnpj) {
    return "";
  }
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

// Função para formatar CPF
export function formatCpf(cpf: string): string {
  if (!cpf) {
    return "";
  }
  return cpf
    .replace(/[^\d]/g, "")
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// Função para limpar caracteres não numéricos de CPF
export function cleanCpf(cpf: string): string {
  return cpf.replace(/[^\d]/g, "");
}

// Função para formatar número de telefone
export function formatPhone(
  phone: string,
  options: { ddi?: boolean } = {}
): string {
  const cleaned = phone.replace(/\D/g, "");
  let match: RegExpMatchArray | null = null;

  if (options.ddi) {
    match =
      cleaned.length === 13
        ? cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/)
        : cleaned.match(/^(\d{2})(\d{2})(\d{4})(\d{4})$/);

    if (!match) return phone;
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }

  match =
    cleaned.length === 10
      ? cleaned.match(/^(\d{2})(\d{4})(\d{4})$/)
      : cleaned.length === 11
      ? cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
      : cleaned.length === 12
      ? cleaned.match(/^(\d{3})(\d{5})(\d{4})$/)
      : cleaned.length === 13
      ? cleaned.match(/^(\d{3})(\d{5})(\d{4})$/)
      : null;

  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
}

// Função para remover caracteres não numéricos de telefone
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// Função para formatar a data (DD/MM/YYYY)
// export function formatDate(dateString: string): string {
//   if (!dateString) return "";

//   const date = new Date(dateString);
//   const day = String(date.getUTCDate()).padStart(2, "0");
//   const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//   const year = date.getUTCFullYear();

//   return `${day}/${month}/${year}`;
// }
// Função para formatar a data (DD/MM/YYYY)
export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "";

  // Garante que aceita tanto string quanto objeto Date
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Evita erros caso a data seja inválida
  if (isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

// Função para formatar valor em real (pt-BR)
export function formatCurrency(
  value: number | string | undefined | null
): string {
  const num =
    typeof value === "string" ? parseFloat(value.replace(",", ".")) : value;

  if (!num || isNaN(num)) return "R$ 0,00";

  return Number(num).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function parseCurrency(value: string): number {
  // Remove tudo que não é número, divide por 100 para considerar centavos
  const numeric = Number(value.replace(/\D/g, "")) / 100;
  return Number(numeric.toFixed(2));
}

// Função para formatar agencia (0000-0)
export function formatAgency(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 5);
  if (digits.length <= 4) return digits;
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}
// Função para formatar conta corrente (00.000-0)
export function formatCheckingAccount(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6); // Máximo 6 dígitos
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}-${digits.slice(5)}`;
}

/**
 * Hook reutilizável para lidar com campos de data:
 * - `pickerValue`: usado no v-date-picker (formato YYYY-MM-DD)
 * - `formattedValue`: mostrado ao usuário (ex: 15/06/2025)
 */
export function useDatePickerField(refData: Ref<any>, key: string) {
  const pickerValue = computed({
    get() {
      const iso = refData.value?.[key];
      if (!iso) return null;

      // Retorna no formato YYYY-MM-DD, compatível com v-date-picker
      return iso.split("T")[0];
    },
    set(val: string) {
      // Gera ISO completo a partir do valor selecionado
      refData.value[key] = new Date(val).toISOString();
    },
  });

  const formattedValue = computed(() => {
    const iso = refData.value?.[key];
    if (!iso) return "";

    const date = new Date(iso);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`; // → 30/06/2025
  });

  return { pickerValue, formattedValue };
}

// Função para formatar frequência de rádio (ex: "1008" → "100,8")
export function formatFrequency(value: string): string {
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 3) {
    return `${cleaned.slice(0, 2)},${cleaned.slice(2)}`;
  }

  if (cleaned.length === 4) {
    return `${cleaned.slice(0, 3)},${cleaned.slice(3)}`;
  }

  return value;
}

export function normalizeWhitespace(text: string): string {
  return (text ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Formata telefones BR mesmo quando chegam "soltos"/com espaços:
 * 46 99934 2640  -> (46) 99934-2640
 * 46 98824 4476  -> (46) 98824-4476
 * Aceita parênteses/hífens/espaços misturados e não "invade" caracteres vizinhos.
 */
export function formatPhonesLoose(text: string): string {
  if (!text) return "";
  const re =
    /(^|[^\d])\(?\s*(\d{2})\s*\)?[^\dA-Za-z]{0,3}(\d{4,5})[^\dA-Za-z]{0,3}(\d{4})($|[^\d])/g;
  return text.replace(re, (_m, pre, ddd, meio, fim, pos) => {
    return `${pre}(${ddd}) ${meio}-${fim}${pos}`;
  });
}

/** Pipeline para “conteúdo social”: normaliza e aplica formatação de telefones */
// filters.ts
export function formatSocialContent(raw: string): string {
  if (!raw) return "";

  let s = raw.replace(/\s+/g, " ").trim();

  // Telefones BR: 10 ou 11 dígitos → (DD) 99999-9999 ou (DD) 9999-9999
  s = s.replace(
    /\b(\d{2})\D?(\d{4,5})\D?(\d{4})\b/g,
    (_m, ddd: string, meio: string, fim: string) => `(${ddd}) ${meio}-${fim}`
  );

  // Garante espaço antes de "(" quando vier após letra (WhatsApp( → WhatsApp ()
  s = s.replace(/([A-Za-zÀ-ÿ])\(/g, "$1 (");

  // Garante espaço depois do telefone se vier colado em palavra (....2640Comercial → ....2640 Comercial)
  s = s.replace(/(\d)\s*(?=[A-Za-zÀ-ÿ])/g, "$1 ");

  // Colapsa espaços múltiplos
  s = s.replace(/\s{2,}/g, " ").trim();

  // Se falar de "social/sociais" e não terminar com pontuação, adiciona "!"
  if (/(social|sociais)\b/i.test(s) && !/[.!?…]$/.test(s)) {
    s += "!";
  }

  return s;
}

// --- ⏰ Formatadores de horário para Programação de Rádio --- //

/**
 * Formata hora “crua” (ex: "0800") para formato de exibição "08:00:00".
 */
export function formatTime(value: string): string {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "").padStart(4, "0"); // garante 4 dígitos
  const hours = cleaned.slice(0, 2);
  const minutes = cleaned.slice(2, 4);
  return `${hours}:${minutes}:00`;
}

/**
 * Formata intervalo de horários para exibição:
 * ex: formatTimeRange("0800", "1200") → "08:00:00 - 12:00:00"
 */
export function formatTimeRange(start: string, end: string): string {
  const formattedStart = formatTime(start);
  const formattedEnd = formatTime(end);
  return `${formattedStart} - ${formattedEnd}`;
}

/**
 * Remove formatação para enviar ao backend:
 * ex: parseTime("08:00") ou parseTime("08:00:00") → "0800"
 */
export function parseTime(value: string): string {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  return cleaned.slice(0, 4);
}

/**
 * Exibe o horário no input enquanto o usuário digita.
 * Regras:
 * - "0" | "08" → mostra como está (sem prefixo "00:")
 * - "083" → "08:3" (parcial)
 * - "0830" → "08:30" (clampa minutos se > 59)
 */
export function formatTimeDisplay(value: string): string {
  if (!value) return "";
  const clean = value.replace(/\D/g, "").slice(0, 4); // até 4 dígitos

  if (clean.length === 0) return "";
  if (clean.length <= 2) return clean; // ainda digitando horas

  const hh = clean.slice(0, 2);
  const mm = clean.slice(2);

  // 3 dígitos → exibe parcial "HH:M"
  if (clean.length === 3) return `${hh}:${mm}`;

  // 4 dígitos → valida/clampa minutos (máx 59)
  const m = Math.min(parseInt(mm, 10), 59);
  return `${hh}:${m.toString().padStart(2, "0")}`;
}

/**
 * Normaliza para backend (HHMM) ao sair do campo.
 * - "8"  -> "0800"
 * - "08" -> "0800"
 * - "083"-> "0830"
 * - "0865" -> "0859" (clamp)
 */
export function normalizeTimeInput(value: string): string {
  const clean = (value || "").replace(/\D/g, "").slice(0, 4);

  if (clean.length === 0) return "";
  if (clean.length === 1) return `0${clean}00`;
  if (clean.length === 2) return `${clean}00`;
  if (clean.length === 3) return `${clean}0`;

  // length === 4
  const hh = clean.slice(0, 2);
  const mm = clean.slice(2);

  // clampa minutos
  const m = Math.min(parseInt(mm, 10), 59).toString().padStart(2, "0");
  return `${hh}${m}`;
}

// CEP: 65530000 → 65530-000
export function formatZipcode(value: string): string {
  if (!value) return "";
  return value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
}

// Endereço completo
export function formatAddress(address: any): string {
  if (!address) return "—";

  const street = address.street ?? "";
  const number = address.number ?? "";
  const neighborhood = address.neighborhood ?? "";

  return `${street}, nº ${number} | ${neighborhood}`;
}

// Plugin para registrar os filtros globais no app Vue
export function registerFilters(app: App): void {
  app.config.globalProperties.$filters = {
    roleUser: roleUserFilter,
    cnpj: formatCnpj,
    cpf: formatCpf,
    phone: formatPhone,
    date: formatDate,
    currency: formatCurrency,
    parseCurrency: parseCurrency,
    agency: formatAgency,
    checkingAccount: formatCheckingAccount,
    useDatePickerField: useDatePickerField,
    frequency: formatFrequency,
    normalizeWhitespace,
    formatPhonesLoose,
    socialContent: formatSocialContent,
    time: formatTime,
    timeRange: formatTimeRange,
    parseTime: parseTime,
    formatTimeDisplay: formatTimeDisplay,
    normalizeTimeInput: normalizeTimeInput,
    formatZipcode: formatZipcode,
    formatAddress: formatAddress,
  };
}
