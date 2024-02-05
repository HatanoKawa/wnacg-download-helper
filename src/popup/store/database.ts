import { defineStore } from "pinia";
import {
  Album,
  DownloadCollectionDb,
  DownloadCollectionQueryResult,
  DownloadCollectionToSave
} from "../types";
import { createRxDatabase } from "rxdb";
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import type { RxJsonSchema } from "rxdb/src/types";
import { RxDatabase } from "rxdb/dist/types/types";
import { shallowRef } from "vue";
import { pick, uniqBy } from "lodash-es";
import { downloadJsonAsFile, formatTime } from "../utils";

const COLLECTION_SCHEMA: RxJsonSchema<any> = {
  title: 'collection schema',
  description: 'describe a collection of albums',
  version: 0,
  type: 'object',
  primaryKey: 'createTime',
  properties: {
    createTime: {
      type: 'number',
      maxLength: 100,
    },
    // albumIdList will exclude the ids of albums that already exist in the database
    albumIdList: {
      type: 'array',
      ref: 'album',
      items: {
        type: 'string'
      }
    },
    // albumIdFullList will include all the ids of albums no matter they exist in the database or not
    albumIdFullList: {
      type: 'array',
      ref: 'album',
      items: {
        type: 'string'
      }
    }
  },
  required: ['createTime', 'albumIdList']
}

const ALBUM_SCHEMA: RxJsonSchema<any> = {
  title: 'album schema',
  description: 'describe an album',
  version: 0,
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string'
    },
    url: {
      type: 'string'
    },
    downloadLinks: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    createTime: {
      type: 'number',
      ref: 'collection'
    }
  },
  required: ['id', 'name', 'url', 'downloadLinks', 'createTime']
}

export const useDatabaseStore = defineStore("database", () => {
  let db = shallowRef<RxDatabase>()
  const allCollectionList = shallowRef<DownloadCollectionDb[]>([])

  const initDatabase = async () => {
    db.value = await createRxDatabase({
      name: 'wnacg_download_log',
      storage: getRxStorageDexie()
    })
    await db.value?.addCollections({
      download_collection: {
        schema: COLLECTION_SCHEMA
      },
      album: {
        schema: ALBUM_SCHEMA
      }
    })
  }

  const refreshAllCollections = async () => {
    db.value?.download_collection.find().exec()
      .then(res => {
        console.warn(res)
        allCollectionList.value = res
      })
  }

  initDatabase()
    .then(() => {
      return refreshAllCollections()
    })

  const exportDatabase = () => {
    db.value?.exportJSON()
      .then(json => {
        console.warn('exportDatabase:')
        console.warn(json)
      })
  }

  const exportDownloadCollection = async (collectionId: number) => {
    const collection = await db.value?.download_collection.findOne({
      selector: {
        createTime: collectionId
      }
    }).exec()
    const albumList = await collection?.populate('albumIdList')
    downloadJsonAsFile(
      {
        ...pick(collection.toJSON(), ['createTime']),
        albumList: albumList?.map((album: any) => album.toJSON())
      },
      `download collection [${formatTime(collectionId)}].json`
    )
  }
  
  const insertDownloadCollection = async (collection: DownloadCollectionToSave) => {
    const albumListWithoutDuplicateData: Album[] = uniqBy(collection.albumList, 'id')
    const albumInsertResult = await db.value?.album.bulkInsert(albumListWithoutDuplicateData)

    const collectionToInsert: DownloadCollectionDb = {
      createTime: collection.createTime,
      albumIdList: (albumInsertResult?.success as any[]).map(album => album.id as string),
      albumIdFullList: albumListWithoutDuplicateData.map(album => album.id)
    } as DownloadCollectionDb
    const downloadCollection = await db.value
      ?.download_collection
      .insert(collectionToInsert)
    const albumFullList = await downloadCollection?.populate('albumIdFullList')

    return {
      createTime: downloadCollection.createTime,
      albumList: albumInsertResult?.success.map(album => pick(album, ['id', 'name', 'url', 'downloadLinks', 'createTime', 'createTime']) as Album),
      albumFullList: albumFullList,
    } as DownloadCollectionQueryResult
  }

  return {
    allCollectionList,
    initDatabase,
    insertDownloadCollection,
    exportDatabase,
    exportDownloadCollection,
  }
})