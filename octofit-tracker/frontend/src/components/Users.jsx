import { useCollection } from '../hooks/useCollection.js'
import { CollectionContent, PageHeading, referenceLabel } from './shared.jsx'

function Users() {
  const { records, isLoading, error, retry } = useCollection('users')

  return (
    <main className="page container-fluid">
      <PageHeading
        count={records.length}
        description="Member profiles, team assignments, and earned points."
        eyebrow="MEMBERS"
        title="Users"
      />
      <CollectionContent
        emptyMessage="No members are registered yet."
        error={error}
        isLoading={isLoading}
        onRetry={retry}
        records={records}
      >
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Email</th>
                <th scope="col">Team ID</th>
                <th scope="col">Points</th>
              </tr>
            </thead>
            <tbody>
              {records.map((user, index) => (
                <tr key={user._id || user.id || user.username || index}>
                  <td>
                    <span className="primary-cell">{user.name || user.username || 'Unnamed member'}</span>
                    {user.username && <span className="secondary-cell">@{user.username}</span>}
                  </td>
                  <td>{user.email || '—'}</td>
                  <td className="reference-value">{referenceLabel(user.teamId)}</td>
                  <td className="points-value">{user.points ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollectionContent>
    </main>
  )
}

export default Users