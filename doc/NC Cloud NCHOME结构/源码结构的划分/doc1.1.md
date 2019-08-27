# 1.1	源码结构的划分
 ## 1.1.1	NC端源码结构
 ![图片]("image/1.1-01.jpg")
* public:公共接口， VO对象等 
* private:接口实现，业务逻辑处理类
* client:为web界面和处理业务逻辑组件之前桥梁，是MVC的C端. 其职责是为业务逻辑类转换请求参数，为前端页面转换为符合要求的对象模型。
*注: client， private 都可以引用 public中的类， client private的类不能互相引用。

 ## 1.1.2	前端代码结构
 ![图片]("image/1.1-02.jpg")
*下载NCC前端脚手架:
*    http://git.yonyou.com/nc-pub/ncpub-multipage-demo
*下载前端代码：
*    http://20.12.4.52:7070/gerrit/#/admin/projects/{你的工程}到脚手架src/uapbd目录.此时使用uapbd工程。


 ## 注意事项

 暂无

 ## 更新日志