export interface DownloadCollectionToSave {
  createTime: number
  albumList: Album[]
}
export interface DownloadCollectionDb {
  createTime: number
  albumIdList: string[]
  albumIdFullList: string[]
}
export interface DownloadCollectionQueryResult {
  createTime: number
  albumList: Album[]
  albumFullList: Album[]
}

export interface Album {
  id: string
  name: string
  url: string
  downloadLinks: string[]
  createTime: number
}