import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

export function useApi(apiFn, options = {}) {
  const { onSuccess, onError, successMsg } = options
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiFn(...args)
      setData(res.data)
      if (successMsg) toast.success(successMsg)
      if (onSuccess) onSuccess(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Something went wrong'
      setError(msg)
      toast.error(msg)
      if (onError) onError(err)
    } finally {
      setLoading(false)
    }
  }, [apiFn, successMsg, onSuccess, onError])

  return { data, loading, error, execute }
}
