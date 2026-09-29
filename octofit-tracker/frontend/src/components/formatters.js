export function referenceLabel(value) {
  const label = value && typeof value === 'object'
    ? value.name || value.username || value._id
    : value

  return label ? String(label) : 'Unassigned'
}

export function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Not recorded'
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}