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