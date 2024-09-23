<template>
  <div>
    <n-space vertical>
      <div>
        <n-card size="small">
          <template #header>
            <span class="text-lg" style="text-decoration: none; color: inherit">转换记录</span>
            <span class="ml-5 text-[12px] text-gray-400">最多记载20条记录</span>
          </template>
          <template #header-extra>
            上次记录时间 {{ createTime }}
          </template>
        </n-card>
      </div>
      <div>
        <n-card :title="`${codeListLength} 条记录`" size="huge">
          <template #header-extra>
            <n-button size="small" @click="getJsonCode">
              <template #icon>
                <n-icon color="#fff">
                  <Icon icon="material-symbols:refresh" />
                </n-icon>
              </template>
              刷新记录
            </n-button>
          </template>
          <n-space vertical>
            <n-card v-for="item in jsonCodeValue" :key="item.id" :title="`类型名：${item.interfaceName}`" size="huge">
              <template #header-extra>
                <div class="flex items-center justify-between">
                  <n-space>
                    <div class="flex items-center">
                      <n-icon color="#fff">
                        <Icon icon="ri:time-fill" />
                      </n-icon>
                      <span class="ml-2">{{ item.createTime }}</span>
                    </div>
                    <router-link :to="{ name: 'CodeInfo', params: { codeId: item.id } }">
                      <n-button size="tiny">
                        <!--                        @click="toCodeInfo(item.id)"-->
                        <template #icon>
                          <n-icon color="#fff">
                            <Icon icon="mdi:show" />
                          </n-icon>
                        </template>
                        查看
                      </n-button>
                    </router-link>
                    <n-button size="tiny" @click="deleteJsonCodeById(item.id)">
                      <template #icon>
                        <n-icon color="#fff">
                          <Icon icon="gravity-ui:delete" />
                        </n-icon>
                      </template>
                      删除
                    </n-button>
                  </n-space>
                </div>
              </template>
              <div>
                <n-scrollbar style="max-height: 120px">
                  <n-code :code="item.javaCode" language="java" show-line-numbers />
                </n-scrollbar>
              </div>
            </n-card>
          </n-space>
        </n-card>
      </div>
    </n-space>
  </div>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import { useRouter } from "vue-router";

const router = useRouter();
//首先在setup中定义
const message = useMessage();
const jsonCodeValue = ref();
const createTime = ref();
const codeListLength = ref(0);
/**
 * 获取Joan文件数据
 * @returns {Promise<void>}
 */
const getJsonCode = async () => {
  const res = await window.electron.ipcRenderer.invoke("read-json-data");
  jsonCodeValue.value = res;
  createTime.value = res[0].createTime;
  codeListLength.value = res.length;
};
/**
 * 删除Joan文件数据
 * @param id
 * @returns {Promise<void>}
 */
const deleteJsonCodeById = async (id) => {
  await window.electron.ipcRenderer.send("del-json-data", id);
  const res = await window.electron.ipcRenderer.invoke("read-json-data");
  jsonCodeValue.value = res;
  createTime.value = res[0].createTime;
  codeListLength.value = res.length;
  message.success("删除成功");
};

const toCodeInfo = (id) => {
  router.push({
    name: "CodeInfo",
    query: {
      testId: id
    }
  });
};

onMounted(() => {
  getJsonCode();
});
</script>
<style scoped>

</style>
