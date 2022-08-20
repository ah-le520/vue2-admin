import request from '@/utils/request'

// 请求spu列表数据接口/admin/product/{page}/{limit}
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });


// 获取spu信息
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

//获取spu品牌信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' })

// 获取spu图片
export const reqSpuImage = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台销售属性---一共就3个
export const reqSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: 'get' })

// 更新或添加spu数据
export const reqUpdataOrSaveSpu = (spuInfo) => {
    // 根据是否携带id判断是更新(有id)还是添加（无id） 
    if (spuInfo.id) {
        // 更新
        return request({ url: `/admin/product/updateSpuInfo`, method: 'post', data: spuInfo })
    } else {
        // 添加
        return request({ url: `/admin/product/saveSpuInfo`, method: 'post', data: spuInfo })
    }
}

// 删除Spu  /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })




// 添加SKU的模块

// 获取图片数据 /admin/product/spuImageList/{spuId}
export const reqSpuImgList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取销售属性的数据 /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })


// 获取平台属性的数据 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })

// 添加SKU /admin/product/saveSkuInfo
export const reqSaveSkuInfo = (skuInfo) => request({ url: `/admin/product/saveSkuInfo`, method: 'post', data: skuInfo })

//获取sku列表信息 /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({ url: `/admin/product/findBySpuId/${spuId}`, method: 'get' })