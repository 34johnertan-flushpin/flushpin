export type AccessType =
  | 'keypad_code'
  | 'no_code_needed'
  | 'ask_staff'
  | 'customers_only'
  | 'locked'
  | 'unknown'

export const ACCESS_TYPE_CHIPS: { id: AccessType; label: string; emoji: string }[] = [
  { id: 'keypad_code', label: 'Has access code', emoji: '🔐' },
  { id: 'no_code_needed', label: 'Open — no code', emoji: '🚪' },
  { id: 'ask_staff', label: 'Ask staff for key', emoji: '🔑' },
  { id: 'customers_only', label: 'Customers only', emoji: '🧾' },
  { id: 'locked', label: 'Locked / unavailable', emoji: '🚫' },
]

const LEGACY_ACCESS_MAP: Record<string, AccessType> = {
  keypad_code: 'keypad_code',
  pin: 'keypad_code',
  no_code_needed: 'no_code_needed',
  open: 'no_code_needed',
  public: 'no_code_needed',
  ask_staff: 'ask_staff',
  key: 'ask_staff',
  customers_only: 'customers_only',
  customers: 'customers_only',
  locked: 'locked',
  unknown: 'unknown',
}

const PLACEHOLDER_PINS = new Set([
  'empty', 'no code', 'none', 'open', 'n/a', 'na', 'no pin', 'nocode',
])

const PIN_TEXT_TO_ACCESS: Record<string, AccessType> = {
  'ask staff': 'ask_staff',
  'customers only': 'customers_only',
  locked: 'locked',
}

export function normalizeAccessType(raw: string | null | undefined): AccessType | null {
  if (!raw) return null
  return LEGACY_ACCESS_MAP[raw.toLowerCase().trim()] ?? null
}

export function isPlaceholderPin(pin: string | null | undefined): boolean {
  if (!pin?.trim()) return true
  const normalized = pin.trim().toLowerCase().replace(/[!?.]/g, '').trim()
  if (PLACEHOLDER_PINS.has(normalized)) return true
  return normalized.replace(/\s/g, '') === 'nocode'
}

export function hasRealPin(pin: string | null | undefined): boolean {
  if (!pin || isPlaceholderPin(pin)) return false
  const normalized = pin.trim().toLowerCase().replace(/[!?.]/g, '').trim()
  return !PIN_TEXT_TO_ACCESS[normalized]
}

export type ResolvedAccess = {
  accessType: AccessType
  displayPin: string | null
}

export function resolveRestroomAccess(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
}): ResolvedAccess {
  const normalizedType = normalizeAccessType(record.access_type)
  const realPin = hasRealPin(record.pin) ? record.pin!.trim() : null

  if (realPin) {
    return { accessType: 'keypad_code', displayPin: realPin }
  }

  if (normalizedType && normalizedType !== 'keypad_code') {
    return { accessType: normalizedType, displayPin: null }
  }

  if (record.pin) {
    const pinNorm = record.pin.trim().toLowerCase().replace(/[!?.]/g, '').trim()
    if (PIN_TEXT_TO_ACCESS[pinNorm]) {
      return { accessType: PIN_TEXT_TO_ACCESS[pinNorm], displayPin: null }
    }
    if (isPlaceholderPin(record.pin)) {
      return { accessType: 'no_code_needed', displayPin: null }
    }
  }

  if (normalizedType === 'keypad_code' || record.has_code === true) {
    return { accessType: 'unknown', displayPin: null }
  }

  return { accessType: 'unknown', displayPin: null }
}

export function restroomHasAccessInfo(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
  status?: string | null
}): boolean {
  const { accessType } = resolveRestroomAccess(record)
  return accessType !== 'unknown' || record.status === 'green'
}

export function getAccessListLabel(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
}): { label: string; color: string; bg: string } {
  const { accessType } = resolveRestroomAccess(record)

  switch (accessType) {
    case 'keypad_code':
      return { label: '🔐 Has access code', color: '#085041', bg: '#E1F5EE' }
    case 'no_code_needed':
      return { label: '🚪 Open access', color: '#065F46', bg: '#D1FAE5' }
    case 'ask_staff':
      return { label: '🔑 Ask staff', color: '#92400E', bg: '#FEF3C7' }
    case 'customers_only':
      return { label: '🧾 Customers only', color: '#4338CA', bg: '#EEF2FF' }
    case 'locked':
      return { label: '🚫 Locked', color: '#991B1B', bg: '#FEE2E2' }
    default:
      return { label: '❓ Access unknown', color: '#991B1B', bg: '#FEE2E2' }
  }
}

export function formatUpdatedAt(iso?: string | null): string {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function buildVerifiedLabel(accessType: AccessType, at?: string): string {
  const chip = ACCESS_TYPE_CHIPS.find(c => c.id === accessType)
  const label = chip?.label ?? 'Access info shared'
  return `${label} · Updated ${formatUpdatedAt(at)}`
}

export function hasDbRestroomId(id: unknown): boolean {
  if (!id || typeof id !== 'string') return false
  return !id.startsWith('google_')
}
