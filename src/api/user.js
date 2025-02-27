import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

// 获取用户基本信息接口
export const userGetInfoService = () => request.get('/my/userinfo')

// 修改基本信息接口
export const userPutInfoService = (data) => request.put('/my/userinfo', data)

// 更换头像接口
export const userPatchAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更换密码接口
export const userPatchPasswordService = (data) =>
  request.patch('/my/updatepwd', data)
