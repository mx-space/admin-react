import { systemApi, type AppInfoModel } from '~/api/system'

import { createSingletonResource } from '../create-singleton'

export const appInfo = createSingletonResource<AppInfoModel>({
  name: 'appInfo',
  fetcher: ({ signal }) => systemApi.appInfo({ signal }),
})
