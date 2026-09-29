import { useCollection } from '../hooks/useCollection.js'
import { CollectionContent, PageHeading, referenceLabel } from './shared.jsx'

function Leaderboard() {
  const { records, isLoading, error, retry } = useCollection('leaderboard')

  return (
    <main className="page container-fluid">
      <PageHeading
        count={records.length}
        description="Member standings ranked by points."
        eyebrow="CURRENT STANDINGS"
        title="Leaderboard"
      />
      <CollectionContent
        emptyMessage="No leaderboard entries are available yet."
        error={error}
        isLoading={isLoading}
        onRetry={retry}
        records={records}
      >
        <div className="table-scroll">
          <table className="data-table leaderboard-table">
            <thead>
              <tr>
                <th scope="col">Rank</th>
                <th scope="col">Member ID</th>
                <th scope="col">Team ID</th>
                <th scope="col">Period</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {[...records]
                .sort((first, second) => (second.points || 0) - (first.points || 0))
                .map((entry, index) => (
                  <tr key={entry._id || entry.id || `${entry.userId}-${index}`}>
                    <td><span className="rank-number">{String(index + 1).padStart(2, '0')}</span></td>
                    <td className="reference-value">{referenceLabel(entry.userId)}</td>
                    <td className="reference-value">{referenceLabel(entry.teamId)}</td>
                    <td>{entry.period || 'all-time'}</td>
                    <td className="points-value">{entry.points ?? 0}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </CollectionContent>
    </main>
  )
}

export default Leaderboard