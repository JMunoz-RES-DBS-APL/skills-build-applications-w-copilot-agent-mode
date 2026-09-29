import { useCollection } from '../hooks/useCollection.js'
import { formatDate, referenceLabel } from './formatters.js'
import { CollectionContent, PageHeading } from './shared.jsx'

function Activities() {
  const { records, isLoading, error, retry } = useCollection('activities')

  return (
    <main className="page container-fluid">
      <PageHeading
        count={records.length}
        description="Training sessions logged by OctoFit members."
        eyebrow="MOVEMENT LOG"
        title="Activities"
      />
      <CollectionContent
        emptyMessage="No activities have been logged yet."
        error={error}
        isLoading={isLoading}
        onRetry={retry}
        records={records}
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Member ID</th>
                <th scope="col">Completed</th>
                <th scope="col">Duration</th>
                <th scope="col">Distance</th>
                <th scope="col">Calories</th>
              </tr>
            </thead>
            <tbody>
              {records.map((activity, index) => (
                <tr key={activity._id || activity.id || `${activity.type}-${index}`}>
                  <td><span className="type-label">{activity.type || 'Activity'}</span></td>
                  <td className="reference-value">{referenceLabel(activity.userId)}</td>
                  <td>{formatDate(activity.completedAt)}</td>
                  <td>{activity.durationMinutes ?? '—'} min</td>
                  <td>{activity.distanceKm == null ? '—' : `${activity.distanceKm} km`}</td>
                  <td>{activity.calories == null ? '—' : `${activity.calories} kcal`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionContent>
    </main>
  )
}

export default Activities