<script setup>
import {
  artEditService,
  artGetDetailService,
  artPublishService
} from '@/api/article.js'
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const visibileDrawer = ref(false)
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({
  ...defaultForm
})

const imgUrl = ref('')

const onSelectFile = (uploadFile) => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  formModel.value.cover_img = uploadFile.raw
}

// 将网络图片地址转换为File对象
async function imageUrlToFile(url, fileName) {
  try {
    // 第一步：使用axios获取网络图片数据
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const imageData = response.data

    // 第二步：将图片数据转换为Blob对象
    const blob = new Blob([imageData], {
      type: response.headers['content-type']
    })

    // 第三步：创建一个新的File对象
    const file = new File([blob], fileName, { type: blob.type })

    return file
  } catch (error) {
    console.error('将图片转换为File对象时发生错误:', error)
    throw error
  }
}

// 要暴露出去的方法
const editorRef = ref()
const open = async (row) => {
  visibileDrawer.value = true
  console.log(editorRef.value)
  if (row.id) {
    // 需要基于 row.id 发送请求，获得数据回显
    const {
      data: { data }
    } = await artGetDetailService(row.id)
    formModel.value = data
    // 图片需要单独处理
    imgUrl.value = baseURL + formModel.value.cover_img
    // 提交给后台的图片数据格式是file对象格式
    // 需要将网络图片地址 => 转换成file对象存储
    const file = await imageUrlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    imgUrl.value = ''
    editorRef.value.setText('')
  }
}

const emit = defineEmits(['publishSuccess'])

// 提交添加的数据
const onPublish = async (state) => {
  formModel.value.state = state

  // 将formModel普通对象转换为FormData对象
  const fd = new FormData()
  for (let key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 发送请求
  if (formModel.value.id) {
    await artEditService(fd)
    ElMessage.success('修改成功！')
    emit('publishSuccess', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('添加成功！')
    // 通知父组件，添加成功了
    emit('publishSuccess', 'add')
  }
  visibileDrawer.value = false
}
defineExpose({
  open
})
</script>
<template>
  <el-drawer
    v-model="visibileDrawer"
    size="40%"
    :title="formModel.id ? '编辑文章' : '添加文章'"
  >
    <!-- 发表文章表单 -->
    <el-form
      :model="formModel"
      ref="formRef"
      label-width="100px"
      style="margin-right: 30px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formModel.title"
          placeholder="请输入标题..."
        ></el-input>
      </el-form-item>
      <el-form-item prop="cate_id" label="文章分类">
        <ChannelSelect v-model="formModel.cate_id" width="100%"></ChannelSelect>
      </el-form-item>
      <el-form-item prop="cover_img" label="文章封面">
        <!-- 本地预览，不需要element-plus的自动上传 -->
        <!-- 本地预览api：URL.createObjectURL(...)创建本地预览的地址 -->
        <el-upload
          :auto-upload="false"
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item prop="content" label="文章内容">
        <div class="editor">
          <QuillEditor
            ref="editorRef"
            v-model:content="formModel.content"
            content-type="html"
            theme="snow"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onPublish('已发布')" type="primary">发布</el-button>
        <el-button @click="onPublish('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
