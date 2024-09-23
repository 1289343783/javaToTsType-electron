<template>
  <div>
    <n-space :size="[20,20]" vertical>
      <div>
        <n-card title="java-类型">
          <template #header-extra>
            <div>
              <n-button size="tiny" @click="() => {
              copyCodeValue = ''
            }">
                <template #icon>
                  <n-icon color="#fff">
                    <Icon icon="ant-design:clear-outlined" />
                  </n-icon>
                </template>
                清空
              </n-button>
            </div>
          </template>
          <div>
            <n-input
              v-model:value="copyCodeValue"
              placeholder="请粘贴java代码
              示例代码：
              private String name;
              private int age;
              private boolean isStudent;"
              style="height: 350px"
              type="textarea"
            />
          </div>
        </n-card>
      </div>
      <n-input v-model:value="interfaceName" placeholder="请输入typescript类型名称，不输入默认为IDefaultName"
               type="text" />
      <n-button :disabled="isShowLoading" class="w-full" type="success" @click="javaToInterface">
        <template #icon>
          <n-icon v-if="isShowLoading" color="#fff">
            <Icon icon="eos-icons:loading" />
          </n-icon>
        </template>
        转换成typescript
      </n-button>
      <div v-if="interfaceTypeCode.length !== 0">
        <n-card title="typescript-类型">
          <template #header-extra>
            <div>
              <n-button size="tiny" @click="copyCode()">
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
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useMessage } from "naive-ui";
import { useClipboard } from "@vueuse/core";

const { copy } = useClipboard();
const message = useMessage();
const interfaceName = ref("");
const interfaceTypeCode = ref("");
const copyCodeValue = ref("");
const isShowLoading = ref(false);
const copyCode = () => {
  copy(interfaceTypeCode.value);
  message.success("复制成功！");
};
let findType = [];
const javaToInterface = () => {
  if (copyCodeValue.value.length === 0) {
    return message.error("请输入java代码");
  }
  isShowLoading.value = true;
  interfaceTypeCode.value = "";
  findType = [];
  if (interfaceName.value.length === 0) {
    interfaceName.value = "IDefaultName";
  }
  copyCodeValue.value.split("\n").map((item) => {
    if (item.includes("private")) {
      let InterfaceName = new RegExp("private", "g");
      let newTypeValue = item.replace(InterfaceName, "");
      let findType = javaToInterfaceType(newTypeValue);
      let typeValue = "";
      if (findType.length > 0) {
        findType.map((item) => {
          typeValue += " " + item;
        });
      }
      interfaceTypeCode.value = "interface " + interfaceName.value + "{\n" + typeValue + "}";
    }else {
      return message.error("请输入正确的java代码");
    }
  });
  if (interfaceTypeCode.value.length === 0 || interfaceTypeCode.value === "") {
    isShowLoading.value = false;
    interfaceName.value = "";
    return message.error("请输入正确的java代码");
  }
  addCodeJson();
  message.success("转换成功！");
  isShowLoading.value = false;
};

const javaToInterfaceType = (typeValue) => {
  const noeType = typeValue.trim().split(" ");
  const typeString = typeJudgment(noeType[0]);
  let nameValue = noeType[noeType.length - 1].replace(";", "");
  findType.push(nameValue + typeString + ";\n");
  return findType;
};
const addCodeJson = async () => {
  const jsonData = {
    id: null,
    interfaceName: interfaceName.value,
    javaCode: copyCodeValue.value,
    typescriptCode: interfaceTypeCode.value,
    createTime: null,
    updateTime: null
  };
  let isNotNull = true;
  let res = await window.electron.ipcRenderer.invoke("read-json-data");
  console.log(res);
  if (res.length + 1 >= 20) {
    res[0].interfaceName = interfaceName.value;
    res[0].javaCode = copyCodeValue.value;
    res[0].typescriptCode = interfaceTypeCode.value;
    res[0].createTime = formTime();
    res[0].updateTime = formTime();
    isNotNull = false;
  }
  res.forEach((item) => {
    if (item.interfaceName === interfaceName.value) {
      item.interfaceName = interfaceName.value;
      item.javaCode = copyCodeValue.value;
      item.typescriptCode = interfaceTypeCode.value;
      item.updateTime = formTime();
      isNotNull = false;
    }
  });
  if (isNotNull) {
    jsonData.id = res.length + 1;
    jsonData.createTime = formTime();
    jsonData.updateTime = formTime();
    res.push(jsonData);
  }
  window.electron.ipcRenderer.send("save-json-data", res);
};


const typeJudgment = (javaType) => {
  // javaType 模拟数据 id;
  if (javaType.includes("String") || javaType.includes("Date")) {
    return ": string";
  } else if (javaType.includes("Boolean") || javaType.includes("boolean")) {
    return ": boolean";
  } else if (javaType.includes("Long") || javaType.includes("Integer")) {
    return ": number";
  } else {
    return ": " + javaType;
  }
};

const formTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const formattedTime = year + "年" + month + "月" + day + "日 " + hours + ":" + minutes;
  return formattedTime;
};
</script>
