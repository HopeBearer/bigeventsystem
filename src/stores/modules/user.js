import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    // token相关
    const token = ref('')
    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 移除token
    const removeToken = () => {
      token.value = ''
    }
    // 用户信息相关
    const userInfo = ref({})
    const getUserInfo = async () => {
      const {
        data: { data }
      } = await userGetInfoService()
      userInfo.value = data
    }
    const setUserInfo = (newInfo) => {
      userInfo.value = newInfo
    }
    return {
      token,
      setToken,
      removeToken,
      userInfo,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
