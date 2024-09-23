<template>
  <div>
    <n-space :size="[20,20]" vertical>
      <n-card>
        <template #header>
          <div class="flex items-center">
            <n-icon :size="30" color="#fff" @click="router.go(-1);">
              <Icon icon="mingcute:left-fill" />
            </n-icon>
            <span class="font-bold text-lg ml-2">{{ codeName }} 记录</span>
          </div>
        </template>
        <template #header-extra>
          上次记录时间 {{ updateTime }}
        </template>
      </n-card>
      <div>
        <n-card title="java-类型">
          <template #header-extra>
            <div>
              <n-button size="tiny" @click="copyJavaTypeCode()">
                <template #icon>
                  <n-icon color="#fff">
                    <Icon icon="ph:copy-fill" />
                  </n-icon>
                </template>
                复制
              </n-button>
            </div>
          </template>
          <div style="overflow: auto">
            <n-code :code="javaTypeCode" language="typescript" show-line-numbers />
          </div>
        </n-card>
      </div>
      <div>
        <n-card title="typescript-类型">
          <template #header-extra>
            <div>
              <n-button size="tiny" @click="copyinterfaceTypeCode()">
                <template #icon>
                  <n-icon color="#fff">
                    <Icon icon="ph:copy-fill" />
                  </n-icon>
                </template>
                复制
              </n-button>
            </div>
          </template>
          <div style="overflow: auto">
            <n-code :code="interfaceTypeCode" language="typescript" show-line-numbers />
          </div>
        </n-card>
      </div>
    </n-space>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useMessage } from "naive-ui";
import { useClipboard } from "@vueuse/core";
import { useRouter } from "vue-router";

const router = useRouter();
const { copy } = useClipboard();
const message = useMessage();
const codeId = ref();
const codeName = ref("");
const javaTypeCode = ref("");
const interfaceTypeCode = ref("");
const updateTime = ref("");
const copyJavaTypeCode = () => {
  copy(javaTypeCode.value);
  message.success("复制成功！");
};
const copyinterfaceTypeCode = () => {
  copy(interfaceTypeCode.value);
  message.success("复制成功！");
};

const getJsonCode = async (id) => {
  const res = await window.electron.ipcRenderer.invoke("read-json-data");
  res.forEach((item) => {
    if (parseInt(id) === item.id) {
      codeName.value = item.interfaceName;
      javaTypeCode.value = item.javaCode;
      updateTime.value = item.updateTime;
      interfaceTypeCode.value = item.typescriptCode;
    }
  });
};

onMounted(async () => {
  codeId.value = router.currentRoute.value.params.codeId;
  if (codeId.value !== 0) {
    await getJsonCode(codeId.value);
  }
});
</script>
<style scoped>

</style>
