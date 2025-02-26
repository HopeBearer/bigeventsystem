<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { ref } from 'vue'
import { artDelService, artGetListService } from '@/api/article.js'
import { formatTime } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
// 定义请求参数对象
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
// 添加loading效果
const loading = ref(false)
const articleList = ref([])
const articleTotal = ref(0)
// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  articleTotal.value = res.data.total
  loading.value = false
}
getArticleList()

// 处理分页逻辑

const onSizeChange = (size) => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}

// 处理搜索逻辑
const onSearch = () => {
  // 从第一页展示
  params.value.pagenum = 1
  getArticleList()
}
// 处理重置逻辑
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = ''
  params.value.state = ''
  getArticleList()
}

const articleEditRef = ref()

// 编辑文章
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}

// 添加文章
const onAddArticle = () => {
  // visibileDrawer.value = true
  articleEditRef.value.open({})
}

// 删除文章
const onDelArticle = async (row) => {
  // 弹出确认框
  await ElMessageBox.confirm(
    `确认要删除 <b>${row.title}</b> 吗？`,
    '温馨提示',
    {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  )
  await artDelService(row.id)
  ElMessage.success('删除成功')
  getArticleList()
}

// 添加或者编辑 成功的回调
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页
    const lastPage = Math.ceil((articleTotal.value + 1) / params.value.pagesize)
    // 更新为最大页码数
    params.value.pagenum = lastPage
  }
  // 刷新列表
  getArticleList()
}
</script>
<template>
  <pageContainer title="文章管理">
    <template #extra>
      <el-button @click="onAddArticle" type="primary">添加文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类:">
        <!-- vue2 : v-model => :value 和 @input  -->
        <!-- vue3 : v-model => :modelValue 和 @update:modelValue -->
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态:">
        <el-select v-model="params.state" style="width: 150px">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset" type="danger">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="articleList">
      <el-table-column align="center" label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="分类"
        prop="cate_name"
      ></el-table-column>
      <el-table-column align="center" label="发表时间" prop="pub_date">
        <template #default="{ row }">{{ formatTime(row.pub_date) }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        prop="state"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDelArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :size="size"
      :disabled="disabled"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next "
      :total="articleTotal"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <!-- 抽屉 -->
    <ArticleEdit ref="articleEditRef" @publishSuccess="onSuccess"></ArticleEdit>
  </pageContainer>
</template>
<style scoped></style>
