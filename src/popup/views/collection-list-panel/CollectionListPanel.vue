<script setup lang="ts">
import { useDatabaseStore } from "../../store/database";
import type { DownloadCollectionToSave } from "../../types";
import dayjs from "dayjs";
import { useAria2RpcStore } from "../../store/aria2rpc";
import { sendActionToAllTabsAtAlbumMainLocation } from "../../utils";
import DangerAnchor from "../../components/DangerAnchor.vue";

const databaseStore = useDatabaseStore()
const rpcStore = useAria2RpcStore()

const checkIsLegalAlbum = (album: any) => album && album.id && album.name && album.url
  && album.downloadLinks && Array.isArray(album.downloadLinks)
  && (album.downloadLinks.length > 0)
const collectAlbumData = () => {
  sendActionToAllTabsAtAlbumMainLocation('getAlbumData')
    .then(res => {
      const currentTime = Date.now()
      const downloadCollection: DownloadCollectionToSave = {
        createTime: currentTime,
        albumList: res
          .map(r => r.status === 'fulfilled' && checkIsLegalAlbum(r.value.result) ? r.value.result : null)
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
}

const startDownloadCollectionById = (collectionId: number) => {
  databaseStore.getDownloadCollection(collectionId)
    .then(collectionData => {
      if (collectionData) {
        collectionData.albumList.forEach(album => {
          rpcStore.startDownloadAlbum(album)
        })
      } else {
        console.error('can not find collectionData by id: ', collectionId)
      }
    })
}

const closeAllPagesHaveBeenCollected = () => {
  sendActionToAllTabsAtAlbumMainLocation('checkHasCollected')
    .then(res => {
      const tabIdListToClose = res
        .map(r => r.status === 'fulfilled' && r.value.result ? r.value.tabId : null)
        .filter(tabId => tabId != null)
      // @ts-ignore
      chrome.tabs.remove(tabIdListToClose)
    })
}
</script>

<template>
  <div class="tab-container" style="display: flex; flex-direction: column;">
    <div style="margin-bottom: 12px; display: flex;">
      rpc server state:
      <span style="margin-left: auto;" :style="{ color: rpcStore.aria2rpcStatusColor }">
        {{ rpcStore.aria2rpcStatus }}
      </span>
    </div>
    <div style="margin-bottom: 12px; display: flex; align-items: center; justify-content: flex-end;">
      <button @click="closeAllPagesHaveBeenCollected">close all pages have been collected</button>
    </div>
    <div
      class="collection-item create-collection-button"
      @click="collectAlbumData"
    >
      + Create Collection
    </div>
    <div style="flex: 1; overflow-y: auto;">
      <div
        v-for="collectionData in databaseStore.allCollectionList"
        :key="collectionData.createTime"
        class="collection-item"
      >
        <div style="flex: 1;">
          <div>
            createTime： {{ dayjs(collectionData.createTime).format('YYYY-MM-DD HH:mm:ss')}}
          </div>
          <div>
            new album count: {{ collectionData.albumIdList.length }}
          </div>
          <div>
            all album count: {{ collectionData.albumIdFullList.length }}
          </div>
        </div>
        <div>
          <div
            class="action-anchor"
            style="color: skyblue;"
            @click="startDownloadCollectionById(collectionData.createTime)"
          >
            DOWN
          </div>
          <div
            class="action-anchor"
            style="color: orange;"
            @click="databaseStore.exportDownloadCollection(collectionData.createTime)"
          >
            EXPORT
          </div>
          <!--<div
            class="action-anchor"
            style="color: #f56c6c;"
            @click="databaseStore.removeDownloadCollectionById(collectionData.createTime)"
          >
            REMOVE
          </div>-->
          <DangerAnchor
            @confirm="databaseStore.removeDownloadCollectionById(collectionData.createTime)"
          >
            REMOVE
          </DangerAnchor>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.collection-item {
  display: flex;
  width: 100%;
  padding: 12px;
  border: solid 2px #99999988;
  border-radius: 12px;
  margin-bottom: 12px;
}

.create-collection-button {
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: dashed 2px #99999988;
  transition: background-color .3s, border-color .3s;
}
.create-collection-button:hover {
  border-color: #999999aa;
  background-color: #99999922;
}

.action-anchor {
  cursor: pointer;
  transition: background-color .3s;
}
.action-anchor:hover {
  text-decoration: underline;
  background-color: #99999922;
}
</style>