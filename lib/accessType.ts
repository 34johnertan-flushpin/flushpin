export type AccessType =
  | 'keypad_code'
  | 'no_code_needed'
  | 'ask_staff'
  | 'customers_only'
  | 'locked'
  | 'unknown'

export type AccessMethod = 'keypad_code' | 'no_code_needed' | 'ask_staff' | 'locked'

const ACCESS_METHODS = new Set<AccessMethod>([
  'keypad_code',
  'no_code_needed',
  'ask_staff',
  'locked',
])

export const ACCESS_METHOD_CHIPS: { id: AccessMethod; label: string; emoji: string }[] = [
  { id: 'keypad_code', label: 'Has access code', emoji: '🔐' },
  { id: 'no_code_needed', label: 'Open — no code', emoji: '🚪' },
  { id: 'ask_staff', label: 'Ask staff for key', emoji: '🔑' },
  { id: 'locked', label: 'Locked / unavailable', emoji: '🚫' },
]

/** @deprecated Use ACCESS_METHOD_CHIPS + customers-only toggle in the edit form */
export const ACCESS_TYPE_CHIPS: { id: AccessType; label: string; emoji: string }[] = [
  ...ACCESS_METHOD_CHIPS,
  { id: 'customers_only', label: 'Customers only', emoji: '🧾' },
]

const COMBO_SEP = '+'

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

export type AccessEditState = {
  customersOnly: boolean
  method: AccessMethod
  pin: string
  accessible: boolean
}

export type ParsedAccess = {
  customersOnly: boolean
  method: AccessMethod | 'unknown'
  displayPin: string | null
}

export type ResolvedAccess = ParsedAccess & {
  accessType: AccessType
}

export function normalizeAccessType(raw: string | null | undefined): AccessType | null {
  if (!raw) return null
  const base = raw.split(COMBO_SEP)[0]?.toLowerCase().trim()
  if (base === 'customers_only' && raw.includes(COMBO_SEP)) {
    const method = raw.split(COMBO_SEP)[1]?.toLowerCase().trim()
    if (method && LEGACY_ACCESS_MAP[method]) return LEGACY_ACCESS_MAP[method]
    return 'customers_only'
  }
  return LEGACY_ACCESS_MAP[raw.toLowerCase().trim()] ?? null
}

export function isAccessMethod(value: string | null | undefined): value is AccessMethod {
  return !!value && ACCESS_METHODS.has(value as AccessMethod)
}

export function encodeAccessType(customersOnly: boolean, method: AccessMethod): string {
  if (method === 'locked') return 'locked'
  if (customersOnly) return `customers_only${COMBO_SEP}${method}`
  return method
}

export function parseAccessRecord(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
}): ParsedAccess {
  const raw = record.access_type?.trim() ?? ''
  const realPin = hasRealPin(record.pin) ? record.pin!.trim() : null

  if (raw.includes(COMBO_SEP)) {
    const [restriction, methodPart] = raw.split(COMBO_SEP, 2)
    if (restriction === 'customers_only' && isAccessMethod(methodPart)) {
      return {
        customersOnly: true,
        method: methodPart,
        displayPin: methodPart === 'keypad_code' ? realPin : null,
      }
    }
  }

  const normalized = normalizeAccessType(raw)

  if (normalized === 'locked') {
    return { customersOnly: false, method: 'locked', displayPin: null }
  }

  if (realPin) {
    return {
      customersOnly: normalized === 'customers_only',
      method: 'keypad_code',
      displayPin: realPin,
    }
  }

  if (normalized === 'customers_only') {
    return { customersOnly: true, method: 'no_code_needed', displayPin: null }
  }

  if (normalized && isAccessMethod(normalized)) {
    return { customersOnly: false, method: normalized, displayPin: null }
  }

  if (record.pin) {
    const pinNorm = record.pin.trim().toLowerCase().replace(/[!?.]/g, '').trim()
    if (PIN_TEXT_TO_ACCESS[pinNorm]) {
      const mapped = PIN_TEXT_TO_ACCESS[pinNorm]
      if (mapped === 'customers_only') {
        return { customersOnly: true, method: 'no_code_needed', displayPin: null }
      }
      if (isAccessMethod(mapped)) {
        return { customersOnly: false, method: mapped, displayPin: null }
      }
    }
    if (isPlaceholderPin(record.pin)) {
      return { customersOnly: false, method: 'no_code_needed', displayPin: null }
    }
  }

  if (record.has_code === true) {
    return { customersOnly: false, method: 'unknown', displayPin: null }
  }

  return { customersOnly: false, method: 'unknown', displayPin: null }
}

export function parseAccessEditState(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
  accessible?: boolean | null
}): AccessEditState {
  const parsed = parseAccessRecord(record)
  return {
    customersOnly: parsed.customersOnly,
    method: parsed.method === 'unknown' ? 'no_code_needed' : parsed.method,
    pin: parsed.displayPin || '',
    accessible: record.accessible || false,
  }
}

export function resolveRestroomAccess(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
}): ResolvedAccess {
  const parsed = parseAccessRecord(record)

  if (parsed.method === 'unknown') {
    return { ...parsed, accessType: 'unknown' }
  }

  if (parsed.method === 'locked') {
    return { ...parsed, accessType: 'locked' }
  }

  if (parsed.method === 'keypad_code' && parsed.displayPin) {
    return { ...parsed, accessType: 'keypad_code' }
  }

  if (parsed.customersOnly && parsed.method !== 'keypad_code') {
    return { ...parsed, accessType: 'customers_only' }
  }

  return { ...parsed, accessType: parsed.method }
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

export function restroomHasAccessInfo(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
  status?: string | null
}): boolean {
  const parsed = parseAccessRecord(record)
  if (parsed.method === 'unknown') return record.status === 'green'
  if (parsed.method === 'keypad_code') return !!parsed.displayPin
  return true
}

export function getAccessListLabel(record: {
  pin?: string | null
  access_type?: string | null
  has_code?: boolean | null
}): { label: string; color: string; bg: string } {
  const parsed = parseAccessRecord(record)

  if (parsed.method === 'unknown') {
    return { label: '❓ Access unknown', color: '#991B1B', bg: '#FEE2E2' }
  }

  if (parsed.method === 'locked') {
    return { label: '🚫 Locked', color: '#991B1B', bg: '#FEE2E2' }
  }

  const parts: string[] = []
  if (parsed.customersOnly) parts.push('🧾 Customers')
  if (parsed.method === 'keypad_code' && parsed.displayPin) parts.push('🔐 Code')
  else if (parsed.method === 'no_code_needed') parts.push('🚪 Open')
  else if (parsed.method === 'ask_staff') parts.push('🔑 Ask staff')

  const label = parts.length > 0 ? parts.join(' · ') : '❓ Access unknown'
  const hasCustomers = parsed.customersOnly
  const color = hasCustomers ? '#4338CA' : parsed.method === 'keypad_code' ? '#085041' : parsed.method === 'ask_staff' ? '#92400E' : '#065F46'
  const bg = hasCustomers ? '#EEF2FF' : parsed.method === 'keypad_code' ? '#E1F5EE' : parsed.method === 'ask_staff' ? '#FEF3C7' : '#D1FAE5'

  return { label, color, bg }
}

export function buildAccessPayload(entry: Pick<AccessEditState, 'customersOnly' | 'method' | 'pin' | 'accessible'>) {
  const now = new Date().toISOString()
  const customersOnly = entry.method === 'locked' ? false : entry.customersOnly
  const access_type = encodeAccessType(customersOnly, entry.method)

  let pin: string | null = null
  if (entry.method === 'keypad_code') {
    pin = entry.pin.trim() || null
  } else if (entry.method === 'no_code_needed') {
    pin = 'open'
  }

  const hasInfo =
    entry.method !== 'locked' &&
    (entry.method !== 'keypad_code' || !!pin)

  return {
    access_type,
    pin,
    accessible: entry.accessible,
    status: hasInfo ? 'green' : 'red',
    verified: buildVerifiedLabel(customersOnly, entry.method, now),
    pin_updated_at: now,
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

export function buildVerifiedLabel(
  customersOnly: boolean,
  method: AccessMethod,
  at?: string,
): string {
  const parts: string[] = []
  if (customersOnly) parts.push('Customers only')
  const chip = ACCESS_METHOD_CHIPS.find(c => c.id === method)
  if (chip) parts.push(chip.label)
  const label = parts.length > 0 ? parts.join(' · ') : 'Access info shared'
  return `${label} · Updated ${formatUpdatedAt(at)}`
}

export function hasDbRestroomId(id: unknown): boolean {
  if (!id || typeof id !== 'string') return false
  return !id.startsWith('google_')
}
