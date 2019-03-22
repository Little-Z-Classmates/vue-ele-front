/**
 *@作者 : 小Z同学
 *@TheFileFunction ：
 *@CreatedDate : 2019/3/9
 **/
/**
 * 获取当前定位城市
 */
export  const cityGuess = async ( vmObj ) =>{
    return vmObj.$http.get('v1/cities?type=guess')
}

/**
 * 获取火热城市
 */
export  const hotCityGuess = async ( vmObj ) =>{
    return vmObj.$http.get('v1/cities?type=hot')
}

/**
 * 获取所有城市
 */
export  const groupCityGuess = async ( vmObj ) =>{
    return vmObj.$http.get('v1/cities?type=group')
}
/**
 * 根据 id 获取 城市信息
 */
export  const currentCityGuess = async ( vmObj,id ) =>{
    return vmObj.$http.get('v1/cities/' + id )
}
/**
 * 根据 城市id , 搜索关键词 获取地址
 */
export  const getPlaceToKey = async ( vmObj,id,value ) =>{
    return vmObj.$http.get(`v1/pois?city_id=${id}&keyword=${value}&type=search`)
}
/**
 * 根据 经纬度获取 详细定位
 */
export  const getDetailedLocation   = async ( vmObj,geohash ) => {
    return  vmObj.$http.get(`v2/pois/${geohash}`)
}

/**
 * 获取 食品分类列表 v2/index_entry
 */
export const getFootEntry  = async ( vmObj ) =>{
    return  vmObj.$http.get(`v2/index_entry`)
}
/**
 * 获取 商铺列表 shopping/restaurants
 */
export const getRestaurants = async ( vmObj,latitude,longitude,offset='0',restaurant_category_id ,order_by,support_ids ) =>{
    var RstObj = {
        latitude,
        longitude,
        offset,
        restaurant_category_id,
        order_by,
        support_ids
    }
    //support_ids[]
    var str = 'shopping/restaurants?'
    var valueKeyArr = []
    for ( let key in RstObj ) {
        if ( RstObj[key] ){
            if ( Array.isArray( RstObj[key]) ){
                RstObj[key].forEach( item =>{
                    valueKeyArr.push( key+'[]='+ item )
                })
            }else{
                valueKeyArr.push( key + '='+ RstObj[key] )
            }
        }
    }
    var newValueKeyArr = valueKeyArr.join('&')
    str = str + newValueKeyArr
    return vmObj.$http.get( str )
}
/**
 * 获取 所有商铺分类列表
 */
export const getAllSellerClassify = async ( vmObj ) =>{
    return  vmObj.$http.get(`shopping/v2/restaurant/category`)
}
/**
 * 获取 商家属性活动列表
 */
export  const getSellerActivityAttributes = async ( vmObj ) =>{
    return  vmObj.$http.get(`shopping/v1/restaurants/activity_attributes`)
}