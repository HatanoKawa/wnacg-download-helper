<script lang="ts" setup>
import { useAria2RpcStore } from "../store/aria2rpc";
import { useDatabaseStore } from "../store/database";

const rpcStore = useAria2RpcStore()
const databaseStore = useDatabaseStore()
</script>

<template>
  <div class="tab-container">
    <div class="main-container" :style="{ border: `solid 2px ${rpcStore.aria2rpcStatusColor}` }">
      <h2>wnacg download helper</h2>
      <p v-show="rpcStore.aria2rpcStatus !== 'connected'">
        You need to start an aria2 rpc server first. If you don't have one, check README.md to get more information.
      </p>
      <div class="rpc-option-container">
        <div class="option-item">
          <div>aria2 rpc server url: (required)</div>
          <input v-model="rpcStore.aria2Options.rpcUrl" />
        </div>
        <div class="option-item">
          <div>aria2 rpc server secret:</div>
          <input v-model="rpcStore.aria2Options.secret" />
        </div>
        <div class="option-item">
          <div>download path:</div>
          <input v-model="rpcStore.aria2Options.downloadPath" />
        </div>
        <div class="option-item">
          <div>
            aria2 rpc server state:
          </div>
          <div style="display: flex; align-items: center;">
        <span
          style="font-weight: bold;"
          :style="{ color: rpcStore.aria2rpcStatusColor }"
        >
          {{ rpcStore.aria2rpcStatus }}
        </span>
            <button style="margin-left: auto;" @click="rpcStore.connect()">reconnect</button>
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; margin-top: 24px;">
        <button class="action-btn" @click="databaseStore.exportDatabase()">export database</button>
        <button class="action-btn" @click="rpcStore.validateAria2Server()">check rpc state</button>
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
