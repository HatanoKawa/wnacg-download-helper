import { defineStore } from "pinia";
import {
  Album,
  DownloadCollection,
  DownloadCollectionDb
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
    albumIdList: {
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

export const useDatabaseStore = defineStore("logDatabase", () => {
  let db = shallowRef<RxDatabase>()

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
        return res[0].populate('albumIdList')
      })
      .then(res => {
        console.warn('populate:')
        console.warn(res)
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
      `download collection ${formatTime(collectionId)}.json`
    )
  }


  // no matter noDuplicate is true or false,
  // albums in the collection that already exist in the database will not be inserted again,

  // when noDuplicate is true,
  // the albumIdList of the collection will exclude the ids of albums that already exist in the database,
  // and if all albums exist in the database, the collection will not be inserted.

  // when noDuplicate is false,
  // collection will be inserted no matter what,
  // and the albumIdList of the collection will include all the ids of albums no matter they exist in the database or not.
  const insertDownloadCollection = async (collection: DownloadCollection, noDuplicate = true) => {
    const albumWithoutDuplicateData: Album[] = uniqBy(collection.albumList, 'id')
    const albumInsertResult = await db.value?.album.bulkInsert(albumWithoutDuplicateData)
    if (noDuplicate && (albumInsertResult?.success as any[]).length < 0) {
      console.error('all albums exist in database, so the collection will not be inserted.')
      return Promise.reject(new Error('all albums exist in database, so the collection will not be inserted.'))
    }

    const collectionToInsert: DownloadCollectionDb = {
      createTime: collection.createTime,
      albumIdList: noDuplicate
        ? (albumInsertResult?.success as any[]).map(album => album.id as string)
        : collection.albumList.map(album => album.id)
    } as DownloadCollectionDb
    const downloadCollection = await db.value
      ?.download_collection
      .insert(collectionToInsert)

    return {
      createTime: downloadCollection.createTime,
      albumList: albumInsertResult?.success.map(album => pick(album, ['id', 'name', 'url', 'downloadLinks', 'createTime', 'createTime']) as Album)
    } as DownloadCollection
  }

  return {
    initDatabase,
    insertDownloadCollection,
    exportDatabase,
    exportDownloadCollection,
  }
})