import { defineStore } from "pinia";
import { ref } from "vue";

export const useAria2RpcStore = defineStore("aria2rpc", () => {
  let aria2rpc: null | WebSocket = null
  const aria2rpcStatus = ref<'connected' | 'disconnected' | 'error'>("disconnected")
  const aria2rpcUrl = ref("ws://localhost:6800/jsonrpc")

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

  return {
    aria2rpc,
    aria2rpcUrl,
    connect,
    validateAria2Server,
    callAria2Method,
  }
})