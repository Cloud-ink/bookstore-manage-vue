import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/product/list',
    method: 'get',
    params: query
  })
}

//分页查询
export function fetchListPage(page, limit, query) {
  return request({
    url: `product/list/${page}/${limit}`,//反引号
    method: 'get',
    params: query
  })
}

export function filterList(query) {
  return request({
    url: '/product/filterList',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/product/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/product/pv',
    method: 'get',
    params: { pv }
  })
}

//添加
export function saveUser(data) {
  return request({
    url: '/product/save',
    method: 'post',
    data
  })
}

export function getById(id){
  return request({
    url: `/product/get/${id}`,
    method: 'get'
  })
}

export function updateById(data) {
  return request({
    url: '/product/update',
    method: 'put',
    data
  })
}

//删除
export function deleteById(id) {
  return request({
    url: `/product/delete/${id}`,
    method: 'delete',
  })
}

//批量删除
export function batchDelete(idList) {
  return request({
    url: '/user/batchDelete',
    method: 'delete',
    data: idList
  })
}

//自动补全
export function selectNameByKey(key) {
  return request({
    url: `/user/list/name/${key}`,
    method: 'get'
  })
}
