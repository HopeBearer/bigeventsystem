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
