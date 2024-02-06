import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useLocalStorage } from '@vueuse/core'
import type { Album, DownloadCollectionQueryResult } from '../types'

const COLOR_SET = {
  connected: "green",
  disconnected: "orange",
  error: "#f56c6c"
} as const

export const useAria2RpcStore = defineStore("aria2rpc", () => {
  let aria2rpc: null | WebSocket = null
  const aria2rpcStatus = ref<'connected' | 'disconnected' | 'error'>("disconnected")
  const aria2rpcStatusColor = computed(() => COLOR_SET[aria2rpcStatus.value])
  const aria2Options = useLocalStorage("aria2Options", {
    rpcUrl: 'ws://localhost:6800/jsonrpc',
    secret: '',
    downloadPath: ''
  })

  const validateAria2Server = () => {
    if (aria2rpcStatus.value === "connected") {
      aria2rpc?.send(JSON.stringify({
        jsonrpc: "2.0",
        id: "validate",
        method: "aria2.getVersion",
        params: []
      }))
    }
  }
  const connect = () => {
    aria2rpc = new WebSocket(aria2Options.value.rpcUrl)
    aria2rpc.onopen = () => {
      aria2rpcStatus.value = "connected"
      setDefaultGlobalOption()
    }
    aria2rpc.onclose = () => {
      aria2rpcStatus.value = "disconnected"
    }
    aria2rpc.onerror = () => {
      aria2rpcStatus.value = "error"
    }
    aria2rpc.onmessage = (event) => {
      console.log(event)
    }
  }

  // region aria2 rpc methods
  const callAria2Method = (rpcOptions: { method: string, params: any[], id: string }) => {
    if (aria2rpcStatus.value === "connected") {
      aria2rpc?.send(JSON.stringify({
        jsonrpc: "2.0",
        ...rpcOptions
      }))
    }
  }

  const addUri = (rpcOptions: { uri: string[], options: any, id: string }) => {
    callAria2Method({
      method: "aria2.addUri",
      params: [rpcOptions.uri, rpcOptions.options],
      id: rpcOptions.id
    })
  }
  // endregion

  // because of wnacg's download speed and process limit,
  // we set aria2's max-concurrent-downloads to 1 and max-overall-download-limit to 3M
  const setDefaultGlobalOption = () => {
    callAria2Method({
      method: "aria2.changeGlobalOption",
      params: [{
        "max-concurrent-downloads": "1",
        "max-overall-download-limit": "3M",
      }],
      id: 'set-global-options'
    })
  }

  const startDownloadAlbum = (album: Album) => {
    addUri({
      uri: [album.downloadLinks[0]],
      options: {
        dir: aria2Options.value.downloadPath,
        out: `${album.name}.zip`
      },
      id: `${album.id}_${Date.now()}`
    })
  }

  const startDownloadCollection = (collection: DownloadCollectionQueryResult) => {
    collection.albumList.forEach(album => {
      startDownloadAlbum(album)
    })
  }

  return {
    // state
    aria2rpc,
    aria2rpcStatus,
    aria2rpcStatusColor,
    aria2Options,
    // aria2 rpc methods
    callAria2Method,
    addUri,
    // custom methods
    connect,
    validateAria2Server,
    startDownloadAlbum,
    startDownloadCollection
  }
})