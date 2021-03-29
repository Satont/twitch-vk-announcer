import got from 'got'

const apiInstance = got.extend({
  prefixUrl: 'https://api.vk.com/method/',
  searchParams: {
    v: '5.130',
    access_token: process.env.VK_GROUP_TOKEN,
  },
})

let groupId: string

export const posterBootstrap = async () => {
  const response = (await apiInstance.get('groups.getById').json()) as any
  groupId = response.response[0].id
}

export const postMessage = async (message: string) => {
  return await apiInstance
    .get('wall.post', {
      searchParams: {
        owner_id: `-${groupId}`,
        from_group: '1',
        message,
      },
    })
    .json()
}
