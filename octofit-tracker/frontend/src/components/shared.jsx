export function PageHeading({ eyebrow, title, description, count }) {
  return (
    <header className="page-heading">
      <div>
        <p className="page-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {count !== undefined && (
        <p className="page-count">
          <strong>{count}</strong>
          <span>{count === 1 ? 'record' : 'records'}</span>
        </p>
      )}
    </header>
  )
}

export function CollectionContent({ records, isLoading, error, onRetry, emptyMessage, children }) {
  if (isLoading) {
    return <p className="collection-message" role="status">Loading records...</p>
  }

  if (error) {
    return (
      <div className="collection-message collection-error" role="alert">
        <p>Could not load records: {error}</p>
        <button className="retry-button" onClick={onRetry} type="button">Try again</button>
      </div>
    )
  }

  if (records.length === 0) {
    return <p className="collection-message">{emptyMessage}</p>
  }

  return children
}

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