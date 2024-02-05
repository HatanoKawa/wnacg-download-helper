<script lang="ts" setup>
import { useAria2RpcStore } from "../store/aria2rpc";
import { useDatabaseStore } from "../store/database";
import type { DownloadCollectionToSave } from '../types'

const aria2RpcStore = useAria2RpcStore()
const validateAria2Rpc = () => {
  aria2RpcStore.validateAria2Server()
}

const databaseStore = useDatabaseStore()

const testJson = {
  "createTime": 1706976422454,
  "albumList": [
    {
      "id": "238134",
      "name": "[めそ山工務店 (めそ)] おきつねロリババソープランド [DL版]",
      "url": "https://www.wnacg.com/photos-index-aid-238134.html",
      "downloadLinks": [
        "https://v1.wzip.download/down/2382/5b220ffa7e07cc1300ba34df82a3a49e.zip?n=[%E3%82%81%E3%81%9D%E5%B1%B1%E5%B7%A5%E5%8B%99%E5%BA%97%20(%E3%82%81%E3%81%9D)]%20%E3%81%8A%E3%81%8D%E3%81%A4%E3%81%AD%E3%83%AD%E3%83%AA%E3%83%90%E3%83%90%E3%82%BD%E3%83%BC%E3%83%97%E3%83%A9%E3%83%B3%E3%83%89%20[DL%E7%89%88]",
        "https://v1.wzip.date/down/2382/5b220ffa7e07cc1300ba34df82a3a49e.zip?n=[%E3%82%81%E3%81%9D%E5%B1%B1%E5%B7%A5%E5%8B%99%E5%BA%97%20(%E3%82%81%E3%81%9D)]%20%E3%81%8A%E3%81%8D%E3%81%A4%E3%81%AD%E3%83%AD%E3%83%AA%E3%83%90%E3%83%90%E3%82%BD%E3%83%BC%E3%83%97%E3%83%A9%E3%83%B3%E3%83%89%20[DL%E7%89%88]"
      ],
      "createTime": 1706976422454,
    },
    {
      "id": "238102",
      "name": "(C103) [適齢期に食中毒 (沢村青)] ほしょ。 (艦隊これくしょん -艦これ-)",
      "url": "https://www.wnacg.com/photos-index-aid-238102.html",
      "downloadLinks": [
        "https://v1.wzip.download/down/2382/e97fc84e736ca29d3768af7d9daa6788.zip?n=(C103)%20[%E9%81%A9%E9%BD%A2%E6%9C%9F%E3%81%AB%E9%A3%9F%E4%B8%AD%E6%AF%92%20(%E6%B2%A2%E6%9D%91%E9%9D%92)]%20%E3%81%BB%E3%81%97%E3%82%87%E3%80%82%20(%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93%20-%E8%89%A6%E3%81%93%E3%82%8C-)",
        "https://v1.wzip.date/down/2382/e97fc84e736ca29d3768af7d9daa6788.zip?n=(C103)%20[%E9%81%A9%E9%BD%A2%E6%9C%9F%E3%81%AB%E9%A3%9F%E4%B8%AD%E6%AF%92%20(%E6%B2%A2%E6%9D%91%E9%9D%92)]%20%E3%81%BB%E3%81%97%E3%82%87%E3%80%82%20(%E8%89%A6%E9%9A%8A%E3%81%93%E3%82%8C%E3%81%8F%E3%81%97%E3%82%87%E3%82%93%20-%E8%89%A6%E3%81%93%E3%82%8C-)"
      ],
      "createTime": 1706976422454,
    },
    {
      "id": "238092",
      "name": "[もちもちブルドーザー部 (しゅぽーん)] 起きる前にはやめるから… (ブルーアーカイブ) [此处澄空个人汉化] [DL版]",
      "url": "https://www.wnacg.com/photos-index-aid-238092.html",
      "downloadLinks": [
        "https://v1.wzip.download/down/2381/3dad4637dd820fcedb0866530beeef26.zip?n=[%E3%82%82%E3%81%A1%E3%82%82%E3%81%A1%E3%83%96%E3%83%AB%E3%83%89%E3%83%BC%E3%82%B6%E3%83%BC%E9%83%A8%20(%E3%81%97%E3%82%85%E3%81%BD%E3%83%BC%E3%82%93)]%20%E8%B5%B7%E3%81%8D%E3%82%8B%E5%89%8D%E3%81%AB%E3%81%AF%E3%82%84%E3%82%81%E3%82%8B%E3%81%8B%E3%82%89%E2%80%A6%20(%E3%83%96%E3%83%AB%E3%83%BC%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96)%20[%E6%AD%A4%E5%A4%84%E6%BE%84%E7%A9%BA%E4%B8%AA%E4%BA%BA%E6%B1%89%E5%8C%96]%20[DL%E7%89%88]",
        "https://v1.wzip.date/down/2381/3dad4637dd820fcedb0866530beeef26.zip?n=[%E3%82%82%E3%81%A1%E3%82%82%E3%81%A1%E3%83%96%E3%83%AB%E3%83%89%E3%83%BC%E3%82%B6%E3%83%BC%E9%83%A8%20(%E3%81%97%E3%82%85%E3%81%BD%E3%83%BC%E3%82%93)]%20%E8%B5%B7%E3%81%8D%E3%82%8B%E5%89%8D%E3%81%AB%E3%81%AF%E3%82%84%E3%82%81%E3%82%8B%E3%81%8B%E3%82%89%E2%80%A6%20(%E3%83%96%E3%83%AB%E3%83%BC%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96)%20[%E6%AD%A4%E5%A4%84%E6%BE%84%E7%A9%BA%E4%B8%AA%E4%BA%BA%E6%B1%89%E5%8C%96]%20[DL%E7%89%88]"
      ],
      "createTime": 1706976422454,
    }
  ]
}
const testInsert = () => {
  databaseStore
    .insertDownloadCollection(testJson)
    .then(res => {
      console.warn(res)
    })
}


const testExportDownloadCollection = () => {
  databaseStore.exportDownloadCollection(testJson.createTime)
}

const checkIsLegalAlbum = (album: any) => album && album.id && album.name && album.url
  && album.downloadLinks && Array.isArray(album.downloadLinks)
  && (album.downloadLinks.length > 0)
const collectAlbumData = () => {
  chrome.tabs.query({
    url: 'https://www.wnacg.com/photos-index-aid-*.html'
  })
    .then(tabs => {
      Promise.allSettled(
        tabs.map(tabData => {
          return chrome.tabs.sendMessage(
            tabData.id!,
            { type: 'getAlbumData' }
          )
        })
      ).then(res => {
        const currentTime = Date.now()
        const downloadCollection: DownloadCollectionToSave = {
          createTime: currentTime,
          albumList: res
            .map(r => r.status === 'fulfilled' && checkIsLegalAlbum(r.value) ? r.value : null)
            .filter(album => album != null)
            .map(album => {
              return {
                ...album,
                createTime: currentTime,
              }
            })
        }
        console.warn('collect downloadCollection: ', downloadCollection)
        databaseStore.insertDownloadCollection(downloadCollection)
          .then(res => {
            console.warn('insertDownloadCollection: ', res)
          })
      })
    })
}
</script>

<template>
  <div class="tab-container">
    <div class="main-container" :style="{ border: `solid 2px ${aria2RpcStore.aria2rpcStatusColor}` }">
      <h2>wnacg download helper</h2>
      <p v-show="aria2RpcStore.aria2rpcStatus !== 'connected'">
        You need to start an aria2 rpc server first. If you don't have one, check README.md to get more information.
      </p>
      <div class="rpc-option-container">
        <div class="option-item">
          <div>aria2 rpc server url: (required)</div>
          <input v-model="aria2RpcStore.aria2Options.rpcUrl" />
        </div>
        <div class="option-item">
          <div>aria2 rpc server secret:</div>
          <input v-model="aria2RpcStore.aria2Options.secret" />
        </div>
        <div class="option-item">
          <div>download path:</div>
          <input v-model="aria2RpcStore.aria2Options.downloadPath" />
        </div>
        <div class="option-item">
          <div>
            aria2 rpc server state:
          </div>
          <div style="display: flex; align-items: center;">
        <span
          style="font-weight: bold;"
          :style="{ color: aria2RpcStore.aria2rpcStatusColor }"
        >
          {{ aria2RpcStore.aria2rpcStatus }}
        </span>
            <button style="margin-left: auto;" @click="aria2RpcStore.connect()">reconnect</button>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; margin-top: 24px;">
        <button class="action-btn" @click="collectAlbumData">collect all download links</button>
        <button class="action-btn" @click="databaseStore.exportDatabase()">export database</button>
        <button class="action-btn" @click="testInsert">test insert</button>
        <button class="action-btn" @click="testExportDownloadCollection">test export download collection</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
}

.rpc-option-container {
  font-size: 16px;
  padding: 12px;
}

.option-item {
  margin-bottom: 6px;
}

.action-btn {
  width: 90%;
}
</style>
