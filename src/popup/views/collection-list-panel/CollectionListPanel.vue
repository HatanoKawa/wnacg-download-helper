<script setup lang="ts">
import { useDatabaseStore } from "../../store/database";

const databaseStore = useDatabaseStore()
</script>

<template>
  <div class="tab-container">
    List Panel
    <div
      v-for="collectionData in databaseStore.allCollectionList"
      :key="collectionData.createTime"
    >
      {{ collectionData.createTime }}
    </div>
  </div>
</template>

<style scoped>

</style>