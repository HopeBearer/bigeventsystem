<script setup>
import { ref } from 'vue'
import { artDelChannelService, artGetChannelService } from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const channelList = ref([])
const loading = ref(false)
const getChannelList = async () => {
  loading.value = true
  const {
    data: { data }
  } = await artGetChannelService()
  channelList.value = data
  loading.value = false
}
getChannelList()

const dialog = ref()
// 添加
const onAddChannel = () => {
  dialog.value.open({})
}
// 修改
const onEditChannel = (row) => {
  dialog.value.open(row)
}
// 删除文章分类
const onDelChannel = async (row) => {
  await ElMessageBox.confirm(
    `确认要删除 <b>${row.cate_name}</b> 分类吗？`,
    '温馨提示',
    {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  )
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}

const handleSuccess = () => getChannelList()
</script>
<template>
  <PageContainer title="文章分类">
    <template #extra>
      <el-button @click="onAddChannel" type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="cate_name"
        align="center"
        label="分类名称"
      ></el-table-column>
      <el-table-column
        prop="cate_alias"
        align="center"
        label="分类别名"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template #default="{ row, $index }">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            @click="onEditChannel(row, $index)"
          >
          </el-button>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            @click="onDelChannel(row, $index)"
          >
          </el-button>
        </template>
      </el-table-column>

      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>

    <ChannelEdit ref="dialog" @success="handleSuccess"></ChannelEdit>
  </PageContainer>
</template>
<style scoped></style>
