module.exports.version = '2.0.00'
module.exports.aid = "sxps_buyer_001"
module.exports.apiUrl = 'https://yixing01.applinzi.com/'
module.exports.cosImageHost = 'http://sxps-1253299728.cossh.myqcloud.com/'
module.exports.youImageHost = 'http://sxps-1253299728.picsh.myqcloud.com/'
module.exports.youImageMode = '?imageMogr2/thumbnail/200x'
module.exports.youImageMode_v2 = '?imageMogr2/thumbnail/200x'
module.exports.youImageMode_v5 = '?imageMogr2/thumbnail/500x'

/**
 * 1.0.29 - 20171229
 * 改进了wode页面中mobile和address的css样式
 * 
 * 1.0.30 - 20180102
 * 在采买弹出框中，增加点击菜品图片放大功能
 * 
 * 1.0.31 - 20180128
 * 改变cates、items的缓存方式，由localStorage改为app内存中
 * 
 * 2.0.00 - 20180327
 * 增加商品属性选购
 */


/**
 * 开发规范
 * 
 * 商品备注：显示在商品购买弹出框和订单列表中，只允许显示一行，最多14个汉字
 * 
 * 买家留言：在商品购买弹出框中输入，只允许单行输入，最多27个汉字。
 * 
 * 购买数量：在商品购买弹出框中输入，只允许整数，最多4个数字。
 * 
 */