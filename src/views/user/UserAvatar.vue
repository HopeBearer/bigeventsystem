<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { userPatchAvatarService } from '@/api/user'

const userStore = useUserStore()

const imgUrl = ref(userStore.userInfo.user_pic)
const onUploadFile = (file) => {
  // 预览图片 第一种方式
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    imgUrl.value = reader.result
  }
  // 第二种方式
  // imgUrl.value = URL.createObjectURL(file.raw)
}

const uploadRef = ref(null)

// 上传头像
const updateAvatar = async () => {
  await ElMessageBox.confirm('确定更换头像吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    // 发送请求更换头像
    await userPatchAvatarService(imgUrl.value)
    // 更新本地用户信息
    userStore.setUserInfo({ ...userStore.userInfo, user_pic: imgUrl.value })
    ElMessage.success('更换头像成功')
  })
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" width="278" />
        </el-upload>
        <br />
        <el-button
          @click="uploadRef.$el.querySelector('input').click()"
          type="primary"
          :icon="Plus"
          size="large"
        >
          选择图片
        </el-button>
        <el-button
          @click="updateAvatar"
          type="success"
          :icon="Upload"
          size="large"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
