import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useCollection(resource) {
  const [records, setRecords] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadIndex, setReloadIndex] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(resource, { signal: controller.signal })
      .then((collection) => {
        setRecords(collection)
        setError('')
        setIsLoading(false)
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setRecords([])
          setError(requestError.message)
          setIsLoading(false)
        }
      })

    return () => controller.abort()
  }, [resource, reloadIndex])

  return { records, isLoading, error, retry: () => setReloadIndex((index) => index + 1) }
}