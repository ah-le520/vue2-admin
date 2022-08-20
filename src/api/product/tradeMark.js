//获取品牌管理数据模块

//引入二次封装的axios
import request from '@/utils/request'

//获取品牌列表接口
// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

//新增品牌的接口 /admin/product/baseTrademark/save 携带两个参数"logoUrl": "string","tmName": "string"
// 因为对于新增品牌的id是由服务器生成的

//修改品牌的接口 /admin/product/baseTrademark/update  携带三个参数 id ，logoUrl": "string","tmName": "string"
// 对于修改品牌的操作，前端需要携带上id

// 因为新增和修改携带的参数区别就在于有没有携带id，所以可以将接口封装成一个函数
export const reqAddOrUpdataTradesMark = (tradeMark) => {
    //判断携带参数是否带有id————修改
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        // 新增品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

//删除数据
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })