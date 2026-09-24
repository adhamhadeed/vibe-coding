import axios from 'axios'
import { api } from './api'

export type HealthResponse = {
  ok: boolean
}

export async function getHealth(): Promise<HealthResponse> {
  try {
    const { data } = await api.get<HealthResponse>('/health')
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response
          ? `API health check failed (${error.response.status})`
          : 'Could not reach the API. Is it running on port 3001?',
      )
    }

    throw error
  }
}
