<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/index'
import { userPutInfoService } from '@/api/user'

const userStore = useUserStore()

const userFormModel = ref({
  ...userStore.userInfo
})

// 表单验证规则
const rules = {
  nickname: [
    { required: true, message: '请输入用户名称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 表单引用
const formRef = ref(null)

// 表单提交
const onSubmit = async () => {
  const valid = await formRef.value.validate()
  if (valid) {
    // 调用接口修改用户信息
    await userPutInfoService(userFormModel.value)
    // 修改本地用户信息
    await userStore.setUserInfo(userFormModel.value)
    ElMessage.success('修改成功')
  }
}
</script>
<template>
  <PageContainer title="基本资料">
    <!-- 表单内容 -->
    <el-form
      :rules="rules"
      ref="formRef"
      :model="userFormModel"
      label-width="100px"
    >
      <el-form-item label="登录名称">
        <el-input
          style="width: 200px"
          v-model="userFormModel.username"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item prop="nickname" label="用户名称">
        <el-input
          v-model="userFormModel.nickname"
          style="width: 200px"
        ></el-input>
      </el-form-item>
      <el-form-item prop="email" label="用户邮箱">
        <el-input v-model="userFormModel.email" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </PageContainer>
</template>
<style scoped></style>
