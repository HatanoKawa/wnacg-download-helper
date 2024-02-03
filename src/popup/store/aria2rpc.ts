import { defineStore } from "pinia";
import { computed, ref } from "vue";

const COLOR_SET = {
  connected: "green",
  disconnected: "orange",
  error: "red"
} as const

export const useAria2RpcStore = defineStore("aria2rpc", () => {
  let aria2rpc: null | WebSocket = null
  const aria2rpcStatus = ref<'connected' | 'disconnected' | 'error'>("disconnected")
  const aria2rpcStatusColor = computed(() => COLOR_SET[aria2rpcStatus.value])
  const aria2rpcUrl = ref("ws://localhost:6800/jsonrpc")
  const aria2rpcSecret = ref("")

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
    aria2rpc = new WebSocket(aria2rpcUrl.value)
    aria2rpc.onopen = () => {
      aria2rpcStatus.value = "connected"
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

  return {
    aria2rpc,
    aria2rpcUrl,
    aria2rpcStatus,
    aria2rpcStatusColor,
    aria2rpcSecret,

    connect,
    validateAria2Server,
    callAria2Method,
    addUri,
  }
})