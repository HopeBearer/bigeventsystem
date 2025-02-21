import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    // 设置token
    const setToken = (newToken) => {
      token.value = newToken
    }
    // 移除token
    const removeToken = () => {
      token.value = ''
    }
    return {
      token,
      setToken,
      removeToken,
    }
  },
  {
    persist: true,
  },
)
