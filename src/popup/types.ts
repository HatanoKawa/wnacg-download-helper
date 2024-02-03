export interface DownloadCollection {
  createTime: number
  albumList: Album[]
}
export interface DownloadCollectionDb {
  createTime: number
  albumIdList: string[]
}

export interface Album {
  id: string
  name: string
  url: string
  downloadLinks: string[]
  createTime: number
}