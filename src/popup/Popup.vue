<template>
  <div style="width: 360px;">
    <div class="tab-title-container">
      <div
        class="tab-title"
        :class="{ active: currentTabIndex === 0 }"
        @click="currentTabIndex = 0"
      >
        collection list
      </div>
      <div
        class="tab-title"
        :class="{ active: currentTabIndex === 1 }"
        @click="currentTabIndex = 1"
      >
        settings
      </div>
    </div>
    <div style="overflow-x: hidden; position: relative; height: 480px;">
      <div
        style="display: flex; position: absolute; top: 0; transition: left .3s;"
        :style="{
          left: `-${currentTabIndex * 360}px`,
        }"
      >
        <CollectionListPanel />
        <SettingsPanel />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAria2RpcStore } from "./store/aria2rpc";
import SettingsPanel from "./views/SettingsPanel.vue";
import CollectionListPanel from "./views/collection-list-panel/CollectionListPanel.vue";
import { ref } from "vue";

const aria2RpcStore = useAria2RpcStore()
aria2RpcStore.connect()

const currentTabIndex = ref(0)
</script>

<style scoped>
.tab-title-container {
  display: flex;
  padding: 2px;
}
.tab-title {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color .3s;
  user-select: none;
}
.tab-title:hover {
  background-color: #99999988;
}
.tab-title.active {
  background-color: #999999dd;
}

:deep(.tab-container) {
  width: 360px;
  min-width: 360px;
  padding: 12px;
  box-sizing: border-box;
  height: 480px;
}
</style>
