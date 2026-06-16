
import { BASE_URL } from '@/lib/api-client';

export const MediaService = {
  /**
   * Uploads an image to the backend which then uploads to Cloudinary
   */
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    // We don't use apiClient here because it defaults to JSON content type
    const response = await fetch(`${BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header, fetch will set it with the boundary for FormData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload image');
    }

    return response.json() as Promise<{ url: string }>;
  }
};
