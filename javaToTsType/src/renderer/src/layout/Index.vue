<template>
  <div class="titlebar bg-amber-300 h-5"></div>
  <n-layout class="h-screen w-screen" position="absolute">
    <ConvertHeader />
    <n-scrollbar style="max-height: 90vh">
      <n-layout-content class="bg-transparent" >
        <div class="m-2">
          <router-view v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </router-view>
        </div>
      </n-layout-content>
    </n-scrollbar>
    <!--    <ConvertFooter />-->
  </n-layout>
</template>
<script setup>
import ConvertHeader from "./components/ConvertHeader.vue";
</script>

<style scoped>
.n-layout-header,
.n-layout-footer {
  background: rgba(244, 244, 244, 0.2);
  padding: 24px;
}


n-layout {
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 /var(--tw-bg-opacity));
}

.titlebar {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}

</style>
