import { useEffect } from 'react'
 
import { useCheckHealth } from '../hooks/useCheckHealth'

 

export function DashboardPage() {
  const { state, message,checkHealth } = useCheckHealth()

 
  useEffect(() => {
    void checkHealth()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">

 

      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">
          AI Analytics Dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          Backend connection status for the Express API.
        </p>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500">
            API health
          </h2>

          <div className="mt-4 flex items-start gap-3">
            <span
              className={
                state === 'loading'
                  ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-amber-400'
                  : state === 'success'
                    ? 'mt-1 h-3 w-3 shrink-0 rounded-full bg-emerald-500'
                    : 'mt-1 h-3 w-3 shrink-0 rounded-full bg-red-500'
              }
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">
                {state === 'loading' && 'Checking connection'}
                {state === 'success' && 'Connected'}
                {state === 'error' && 'Connection failed'}
              </p>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
            </div>
          </div>

          {state === 'error' && (
            <button
              type="button"
              onClick={() => void checkHealth()}
              className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Retry
            </button>
          )}
        </section>
      </div>
    </main>
  )
}
