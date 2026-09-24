import { useEffect, useState } from 'react'
import { getHealth } from '../lib/health'
 
type ConnectionState = 'loading' | 'success' | 'error'
  export function useCheckHealth() {
  const [state, setState] = useState<ConnectionState>('loading')
  const [message, setMessage] = useState('Checking API connection…')

  async function checkHealth() {
    setState('loading')
    setMessage('Checking API connection…')

    try {
      const health = await getHealth()

      if (!health.ok) {
        throw new Error('API reported an unhealthy status')
      }

      setState('success')
      setMessage('Connected to the Express API.')
    } catch (error) {
      setState('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Could not reach the Express API.',
      )
    }
  }


  useEffect(() => {
    void checkHealth()
  }, [])


  return { state, message,checkHealth }
}
