//商品属性模块

import request from '@/utils/request'

// 一级分类
export const Category1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })

// 二级分类并携带一级分类的id
export const Category2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })

// 三级分类并携带二级分类的id
export const Category3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

// 携带三个id参数获取商品属性列表
export const reqAttrList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' });

//添加属性与属性值的接口/admin/product/saveAttrInfo  
// "attrName": "string", 属性名
//   "attrValueList": [  属性值
//     {
//       "attrId": 0,            属性id
//       "valueName": "string"   属性值
//     }
//   ],
//   "categoryId": 0, category3Id
//   "categoryLevel": 3,
export const reqAddAttrOrUpdata = (data) => request({ url: `/admin/product/saveAttrInfo`, method: 'post', data })