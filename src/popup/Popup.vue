<template>
  <div style="width: 200px; height: 200px;">
    wnacg dl helper
    <button @click="logChrome">copy all download link</button>
    <div>{{ dlList }}</div>
    <button @click="connectWebsocket">connect websocket</button>
    <button @click="sendMsg">send msg</button>
    <button @click="sendNativeMsg">native message test</button>
    <button @click="sendLinkListToNativeApp">send link list to native app</button>
    <button @click="testDirectlyConnectToAria2">connect aria2</button>
    <button @click="validateAria2Rpc">check aria2 service</button>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import { useAria2RpcStore } from "./store/aria2rpc";

const dlList = ref<string[][]>([])
const logChrome = () => {
  dlList.value = []
  chrome.tabs.query({
    url: 'https://www.wnacg.com/photos-index-aid-*.html'
  })
    .then(tabs => {
      Promise.allSettled(
        tabs.map(tabData => {
          return chrome.tabs.sendMessage(
            tabData.id!,
            { type: 'getDownloadLinks' }
          )
        })
      ).then(res => {
        dlList.value = res
          .map(r => r.status === 'fulfilled' ? r.value : [])
          .filter(urlList => urlList?.length > 0)
        navigator.clipboard.writeText(
          dlList.value
            .map(urlList => urlList[0])
            .join('\n')
        )
      })
    })
}

let ws: WebSocket|undefined = undefined
const connectWebsocket = () => {
  ws = new WebSocket('ws://localhost:9550')
  ws.addEventListener('open', () => {
    console.warn('ws opened')
    ws?.send('connection established')
  })
}
const sendMsg = () => {
  ws?.send('test msg')
}

const sendNativeMsg = () => {
  chrome.runtime.sendNativeMessage(
    'com.river_quinn.wnacg_dl_helper_service',
    { text: 'test req' },
  ).then(res => {
    console.log(res)
  })

  // const port = chrome.runtime.connectNative('com.river_quinn.wnacg_dl_helper_service')
  // /*
  // Listen for messages from the app.
  // */
  // port.onMessage.addListener((response) => {
  //   console.log("Received: " + response);
  // });
  //
  // console.log("Sending:  ping");
  // port.postMessage("test reqs");
}

const sendLinkListToNativeApp = () => {
  chrome.tabs.query({
    url: 'https://www.wnacg.com/photos-index-aid-*.html'
  })
    .then(tabs => {
      Promise.allSettled(
        tabs.map(tabData => {
          return chrome.tabs.sendMessage(
            tabData.id!,
            { type: 'getDownloadLinks' }
          )
        })
      ).then(res => {
        const dlList = res
          .map(r => r.status === 'fulfilled' ? r.value : undefined)
          .filter(urlList => !!urlList)
        console.warn(res)
        console.warn(dlList)
        chrome.runtime.sendNativeMessage(
          'com.river_quinn.wnacg_dl_helper_service',
          { albumList: dlList },
        ).then(res => {
          console.log(res)
        })
      })
    })
}

const aria2RpcStore = useAria2RpcStore()
const testDirectlyConnectToAria2 = () => {
  aria2RpcStore.connect()
}
const validateAria2Rpc = () => {
  aria2RpcStore.validateAria2Server()
}
</script>
