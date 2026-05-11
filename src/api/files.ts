import { request } from '~/lib/request'

export interface UploadResponse {
  url: string
  name: string
}

export const filesApi = {
  upload: (file: File, type: 'image' | 'file' = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    return request<UploadResponse>('/files/upload', {
      method: 'POST',
      body: formData,
      query: { type },
    })
  },

  update: (type: 'image' | 'file', name: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request<UploadResponse>(`/files/${type}/${name}`, {
      method: 'PUT',
      body: formData,
    })
  },
}
