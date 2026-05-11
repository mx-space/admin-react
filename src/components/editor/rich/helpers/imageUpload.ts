import { filesApi } from '~/api/files'

export async function imageUpload(file: File): Promise<{ src: string }> {
  const result = await filesApi.upload(file, 'image')
  return { src: result.url }
}
