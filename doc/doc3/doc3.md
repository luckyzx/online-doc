<menu>
{'parent':'测试',
'name':'test3'}
</menu>
# base-affix
将页面元素钉在可视范围。

 ## 何时使用
当内容区域比较长，需要滚动页面时，这部分内容对应的操作或者导航需要在滚动范围内始终展现。常用于侧边菜单和按钮组合。页面可视范围过小时，慎用此功能以免遮挡页面内容。

 ## 如何使用
import {base} from 'nc-lightapp-front';

const {NCAffix: Affix} = base;

 ## 代码演示

 ## API

 |参数|说明|类型|默认值|
|:---|:-----|:----|:------|
offsetTop | 固定被触发距离，默认是0 ，可选的属性 | number | 0
container| 固定元素所属容器| object| document.body
horizontal| 被固定时是否可以左右滑动，默认是false，可选的属性| boolean| false
target| 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数，默认值() => window| function| () => window
onChange| 触发固定或者固定取消时的回调函数,返回值{ affixed: true, event: evt}| function| -
onTargetChange| 时刻获取Affix的状态值,返回值{state}| function| -

 ## 注意事项

 暂无

 ## 更新日志
 <img src='注解.jpg'/>