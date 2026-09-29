import { useCollection } from '../hooks/useCollection.js'
import { CollectionContent, PageHeading } from './shared.jsx'

function Teams() {
  const { records, isLoading, error, retry } = useCollection('teams')

  return (
    <main className="page container-fluid">
      <PageHeading
        count={records.length}
        description="Team membership and combined activity points."
        eyebrow="GROUPS"
        title="Teams"
      />
      <CollectionContent
        emptyMessage="No teams have been created yet."
        error={error}
        isLoading={isLoading}
        onRetry={retry}
        records={records}
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Team</th>
                <th scope="col">Members</th>
                <th scope="col">Total points</th>
                <th scope="col">Team ID</th>
              </tr>
            </thead>
            <tbody>
              {records.map((team, index) => (
                <tr key={team._id || team.id || `${team.name}-${index}`}>
                  <td className="primary-cell">{team.name || 'Unnamed team'}</td>
                  <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                  <td className="points-value">{team.totalPoints ?? 0}</td>
                  <td className="reference-value">{team._id || team.id || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionContent>
    </main>
  )
}

export default Teams