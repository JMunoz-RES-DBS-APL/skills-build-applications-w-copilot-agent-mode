import { useCollection } from '../hooks/useCollection.js'
import { CollectionContent, PageHeading } from './shared.jsx'

function Workouts() {
  const { records, isLoading, error, retry } = useCollection('workouts')

  return (
    <main className="page container-fluid">
      <PageHeading
        count={records.length}
        description="Suggested sessions for different training levels."
        eyebrow="TRAINING PLAN"
        title="Workouts"
      />
      <CollectionContent
        emptyMessage="No workout suggestions are available yet."
        error={error}
        isLoading={isLoading}
        onRetry={retry}
        records={records}
      >
        <div className="table-scroll">
          <table className="data-table workouts-table">
            <thead>
              <tr>
                <th scope="col">Workout</th>
                <th scope="col">Activity</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {records.map((workout, index) => (
                <tr key={workout._id || workout.id || `${workout.name}-${index}`}>
                  <td>
                    <span className="primary-cell">{workout.name || 'Workout'}</span>
                    <span className="secondary-cell">{workout.description || 'No description provided.'}</span>
                  </td>
                  <td>{workout.activityType || '—'}</td>
                  <td><span className="difficulty-label">{workout.difficulty || 'Unspecified'}</span></td>
                  <td>{workout.durationMinutes ?? '—'} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionContent>
    </main>
  )
}

export default Workouts