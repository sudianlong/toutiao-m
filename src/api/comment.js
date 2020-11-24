/* 评论请求模块 */
import request from '@/utils/request'

//  获取文章评论列表
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    //  get 参数 使用 params 进行传递参数
    // 写的时候是对象, axios会把params 对象转为key=value?key=vlue2 格式放到url中
    params
  })
}

//  给评论点赞
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target
    }
  })
}

//  取消对评论的点赞
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: '/app/v1_0/comments/likings/' + target
  })
}

/* 添加评论或评论回复
基本信息
Path： /app/v1_0/comments */

export const addComment = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}
