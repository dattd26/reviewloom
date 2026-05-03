const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5165/api/v1';

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.title || errorMessage;
    } catch {
      // Ignore json parse error
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}
