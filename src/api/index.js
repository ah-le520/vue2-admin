//将四个模块统一起来对外暴露
import * as tradeMark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'
import role from './acl/role'
import * as user from './acl/user'
import permission from './acl/permission'


// 对外暴露
export default {
    tradeMark,
    attr,
    sku,
    spu,
    role,
    user,
    permission
}