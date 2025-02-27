import request from '@/utils/request'

// 获取文章分类列表接口
export const artGetChannelService = () => request.get('/my/cate/list')

// 添加文章分类接口
export const artAddChannelService = (data) => request.post('/my/cate/add', data)

// 编辑文章分类接口
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

// 删除文章分类接口
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: {
      id
    }
  })

// 获取文章列表接口
export const artGetListService = ({ pagenum, pagesize, cate_id, state }) =>
  request.get('/my/article/list', {
    params: {
      pagenum: pagenum,
      pagesize: pagesize,
      cate_id,
      state
    }
  })

// 获取文章详情接口
export const artGetDetailService = (id) =>
  request.get('/my/article/info', { params: { id } })

// 添加文章接口
// 注意：data需要是一个formData格式的对象
export const artPublishService = (data) => request.post('/my/article/add', data)

// 编辑文章接口
export const artEditService = (data) => request.put('/my/article/info', data)

// 删除文章接口
export const artDelService = (id) =>
  request.delete('/my/article/info', {
    params: {
      id
    }
  })
