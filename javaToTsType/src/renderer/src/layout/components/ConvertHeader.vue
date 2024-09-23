<template>
  <n-layout-header>
    <div class="flex justify-between justify-items-center h-2">
      <div class="flex items-center">
        <n-icon :size="30" color="#3cb0e2">
          <Icon icon="ph:windmill" />
        </n-icon>
      </div>
      <div class="flex items-center ">
        <n-menu
          :options="menuOptions"
          :value="activeKey"
          mode="horizontal"
          responsive
          @update:value="handleUpdateValue"
        />
      </div>
      <div class="flex items-center gap-2 ">
        <n-space>
          <n-icon :size="15" @click="minimizeWim">
            <Icon icon="mdi:minimize" />
          </n-icon>
          <n-icon :size="15" @click="maxWin">
            <Icon v-if="isIconMax" icon="mdi:maximize" />
            <Icon v-else icon="tabler:box-multiple" />
          </n-icon>
          <n-icon :size="15" @click="closeWin">
            <Icon icon="material-symbols:close" />
          </n-icon>
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>
<script setup>
import { h, ref } from "vue";
import { NIcon } from "naive-ui";
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";

const activeKey = ref("home");


const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "Home"
          }
        },
        { default: () => "首页" }
      ),
    key: "home",
    icon: renderIcon("ic:twotone-home")
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: "History"
          }
        },
        { default: () => "历史记录" }
      ),
    key: "record",
    icon: renderIcon("iconamoon:history-bold")
  }
];

const isIconMax = ref(true);
const closeWin = () => {
  window.electron.ipcRenderer.send("window-close");
};
const minimizeWim = () => {
  window.electron.ipcRenderer.send("window-min");
};
const maxWin = () => {
  window.electron.ipcRenderer.send("window-max");
  isIconMax.value = !isIconMax.value;

};
const handleUpdateValue = (key) => {
  activeKey.value = key;
};

function renderIcon(icon) {
  return () =>
    h(Icon, {
      icon
    });
}


</script>
<style scoped>

</style>
