<menu>
{'parent':'测试',
'name':'后端组件'}
</menu>
# 3. NC Cloud后端组件

## 3.1 请求实现类Action与配置

请求处理类都需要实现接口ICommonAction，并添加请求处理配置文件。
<img src='NC Cloud后端组件 (1).png'>
UAPBD模块的代码可以直接继承类NCCAction，此类封装了数据权限，异常处理等功能。
<img src='NC Cloud后端组件 (2).png'>
添加配置文件: 配置文件包路径结构为 yyconfig.modules.模块名.节点名.config.action。
<img src='NC Cloud后端组件 (3).png'>
其中请求名称必须填写，并且名称表述的职责清晰。以便监控模块监测。

## 3.2 鉴权配置

NC鉴权是指用户请求是否拥有访问模块的权利。每个功能节点都有鉴权配置文件。
鉴权文件包路径结构: yyconfig.modules.模块名.节点名.config.authorize。
鉴权文件名建议结构为:节点编码_authorize.xml
实例：
<img src='NC Cloud后端组件 (4).png'>
鉴权文件配置格式(dtd,  schema)：当前版本平台未提供xml文件的dtd或schema，开发时需要确保格式正确性
格式要求如下：
<img src='NC Cloud后端组件 (5).png'>
```<action>```标签中的请求，可以访问```<appcode>```值配置的节点功能，如果```<action>```中的请求是通用功能，需要所有节点访问，可以在```<appcode>```中配置为“*”

## 3.3	异常处理

平台提供了通用异常的处理方法ExceptionUtils.wrapBusinessException()，能够处理绝大部分异常，开发时应该在ICommonAction实现类的doAction()方法中try-catch所有的业务代码，并处理异常的错误信息，这样可以保证所错误信息可以展现在前端界。当然你需要注意一些敏感信息不能提示，比如SQL判断代码堆栈等，我们只应该显示那些对用户有帮助的信息。
其中，由于历史问题，NC Cloud中DAOException 继承子BusinessException，所以会把SQL片段显示到前端。(还有其他的历史异常类也存在需要注意)

## 3.4	json与VO转换和公式翻译

单据分为四种类型Form（卡片），Grid（表格），BillCard（一主一子），ExtBillCard（一主多子），前后端需要通过接口对不同类型的数据进行转换。平台提供了仅供参考的转换方式，地址为：
[http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%90%8E%E7%AB%AF%E6%A1%86%E6%9E%B6/%E5%8D%95%E6%8D%AE%E8%BD%AC%E5%8C%96%E8%AF%B4%E6%98%8E.md](http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%90%8E%E7%AB%AF%E6%A1%86%E6%9E%B6/%E5%8D%95%E6%8D%AE%E8%BD%AC%E5%8C%96%E8%AF%B4%E6%98%8E.md)

### 3.4.1	Form 与VO 转换

#### 3.4.1.1	Json转换成Form

前端通过getAllFormValue方法获得Form信息，其中this.config.formId是当前form的areacode，如下图：
<img src='NC Cloud后端组件 (6).png'>
构造ajax请求参数，pageid必传，如下图：
<img src='NC Cloud后端组件 (7).png'>
通过ajax传给后端，后端接收request参数，可以通过两种方式转换成Form：
方法一：
<img src='NC Cloud后端组件 (8).png'>
方法二：
<img src='NC Cloud后端组件 (9).png'>

#### 3.4.1.2	Form转换成VO

平台提供了FormConvertor接口进行Form转换VO，如下图：
<img src='NC Cloud后端组件 (10).png'>

#### 3.4.1.3	VO转换成Form

由于有显示公式，所以VO转换Form用FormOperator，如下图：
<img src='NC Cloud后端组件 (11).png'>
转换成Form之后还需要对Form进行翻译，因为Form中可能有引用的照者下拉等类型数据，使用Translator接口进行翻译，如下图：
<img src='NC Cloud后端组件 (12).png'>
到此，form就可以返回到前端了，前端使用setAllFormValue把数据铺到卡片上，如下图：
<img src='NC Cloud后端组件 (13).png'>
其中this.config.formId是当前Form的areacode， result是ajax成功返回的参数，返回的form数据放在result.data[当前Form的areacode]中。

### 3.4.2	Grid 与 VO转换

#### 3.4.2.1	Json转换成Grid

表格转换VO大部分都是editTable（编辑表格），保存数据时使用。下图是获取表格数据的部分接口：
<img src='NC Cloud后端组件 (14).png'>
<img src='NC Cloud后端组件 (15).png'>
具体获取表格数据的方式请参考：
[http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6/%E8%A1%A8%E6%A0%BC%E7%B1%BB/editTable%E5%8F%AF%E7%BC%96%E8%BE%91%E8%A1%A8%E6%A0%BC%E7%BB%84%E4%BB%B6%E7%89%B9%E6%80%A7.md](http://git.yonyou.com/nc-pub/Public_Document/blob/master/%E5%89%8D%E7%AB%AF/%E5%89%8D%E7%AB%AF%E6%A1%86%E6%9E%B6/%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6/%E8%A1%A8%E6%A0%BC%E7%B1%BB/editTable%E5%8F%AF%E7%BC%96%E8%BE%91%E8%A1%A8%E6%A0%BC%E7%BB%84%E4%BB%B6%E7%89%B9%E6%80%A7.md)
构造ajax请求参数，格式如下图：
<img src='NC Cloud后端组件 (16).png'>
通过ajax传给后端，后端接收request参数，可以通过两种方式转换成Grid：
方法一：
<img src='NC Cloud后端组件 (17).png'>
方法二：
<img src='NC Cloud后端组件 (18).png'>

#### 3.4.2.2	Grid转换成VO

Grid转换成VO，一般也是在保存的时候需要。
我们提供GridModelConvertUtils接口转换：
<img src='NC Cloud后端组件 (19).png'>
平台提供的GridConvertor和GridOperator接口转换
<img src='NC Cloud后端组件 (20).png'>
<img src='NC Cloud后端组件 (21).png'>

#### 3.4.2.3	VO转换成Grid

三种表格（simpleTable、cardTable、editTable）都需要进行转换，由于有显示公式，所以VO转换Grid用GridOperator
<img src='NC Cloud后端组件 (22).png'>
如果使用GridConvertor进行转换需要自己实现显示公式的转换，如下图：
<img src='NC Cloud后端组件 (23).png'>
<img src='NC Cloud后端组件 (24).png'>
转换成Grid之后还需要对Grid进行翻译，因为Grid中可能有引用的参照或者下拉等类型数据，使用Translator接口进行翻译，情况与3.4.1.3VO转换成Form描述的翻译类似

### 3.4.3	BillCard与 VO 转换

#### 3.4.3.1	Json 转换成VO

前端通过createMasterChildData获得一主一子数据信息，createMasterChildData接受三个参数：当前页面编码pagecode，Form的areacode和table的areacode；如下图：
<img src='NC Cloud后端组件 (25).png'>
通过ajax请求参数传递到后端，转换方法如下：
<img src='NC Cloud后端组件 (26).png'>

#### 3.4.3.2	VO转换成BillCard

通过BillCardOperator把VO转换成BillCard，实例化BillCardOperator时需要传当前界面编码，如下图：
<img src='NC Cloud后端组件 (27).png'>

#### 3.4.4	ExtBillCard与 VO转换

##### 3.4.4.1	Json转换成VO

前端通过平台提供的createExtCardData方法获得一主多子数据，createExtCardData接受三个参数：当前页面编码pagecode，Form的areacode和tables的areacode的数组；如下图：
<img src='NC Cloud后端组件 (28).png'>
通过ajax请求参数传递到后端，通过
<img src='NC Cloud后端组件 (29).png'>
转换成ExtBillCard，然后通过ExtBillCardConvertProcessor接口把ExtBillCard转换成VO，如下图：
<img src='NC Cloud后端组件 (30).png'>
实例化ExtBillCardConvertProcessor时参数为不在一主多子范围内的area集合。转换成的ExtSpecilAggBill中含有head和bodys属性，可以取出对应的VO;
平台提供了直接从Json转换成VO的方式，如下图：
<img src='NC Cloud后端组件 (31).png'>

#### 3.4.4.2	VO转换成ExtBillCard

VO换换成ExtBillCard的方式，如下图：
<img src='NC Cloud后端组件 (32).png'>
平台提供的转换方法如下图：
<img src='NC Cloud后端组件 (33).png'>

### 3.4.5	特殊需要转换

我们在实现业务功能时很多时候不仅需要完整的Form、Grid、BillCard、ExtBillCard的Json数据，同时还需要传递别的参数，例如节点类型等等，这时候就需要我们自定义javabean进行转换。
前端自己构造一个参数对象，如下图：
<img src='NC Cloud后端组件 (34).png'>
后端对应创建一个接受参数的bean，如下图：
<img src='NC Cloud后端组件 (35).png'>
转换时使用JsonFactory进行转换，如下图：
<img src='NC Cloud后端组件 (36).png'>
这样转换之后从bean中既可以获得Form等完整数据对象，又可以获得我们自定义的参数值。

## 3.5	多语转换

### 3.5.1	参照多语

#### 3.5.1.1	一般参照前端多语适配
在参照js文件中，加入如下配置
<img src='NC Cloud后端组件 (37).png'>
domainName 为领域文件夹名，currentLocales为默认语种名，moduleid对应多语json文件名。
将需要多语的字段替换为多语json文件中对应字符串即可。
参照前端多语文件位于：src/uapbd/public/lang/simpchn/refer_uapbd.json

#### 3.5.1.2	特殊参照前端多语适配

##### 3.5.1.2.1	标题等多语适配

1. 在继承自PopRefer的js中引入平台的多语包装类
<img src='NC Cloud后端组件 (38).png'>
2. export之前用该方法包装一下自己的特殊参照
<img src='NC Cloud后端组件 (39).png'>
3. index.js中正常引入即可
<img src='NC Cloud后端组件 (40).png'>
这样参照的标题、树参照的搜索框、树参照的根都实现多语了

##### 3.5.1.2.2	内容区表格、表单、等自定义组件的多语适配

4. 如果特殊参照里还有别的多语，平台把多语json 传给了参照
<img src='NC Cloud后端组件 (41).png'>
这样，在我们特殊参照构造函数中就拿到这个multiLang对象了，
然后就和在小应用中设置多语一样，去设置其他的多语
<img src='NC Cloud后端组件 (42).png'>
5. 特殊参照多语适配完成
<img src='NC Cloud后端组件 (43).png'>

##### 3.5.1.2.3	说明

1. 可能出现直接在属性中写this.props.multiLang[‘refer-xxx’]时，获取不到多语的情况，因为 js中函数也是对象，对象也是函数，所以我就写成一个函数，执行一下就有了
<img src='NC Cloud后端组件 (44).png'>
使用的时候，先执行该函数
<img src='NC Cloud后端组件 (45).png'>
2. 由于平台给的多语对象的key就叫multiLang，所以只能写成this.props.multiLang[‘refer-xxx’]的形式。

#### 3.5.1.3	后端数据多语

以参照name字段为例，有两种方式：
第一种是平台于晓龙给出的，sql中把name~name6全查出来；需要在参照类的getRefMeta方法中调用meta如下方法：
<img src='NC Cloud后端组件 (46).png'>
平台在查询的时候，若检测到该标志量为true，便会取当前语种下标拼到name字段后。（该种方法适用于meta的refName字段多语）
第二种是我们uapbd自己提供的，调用方法直接返回当前多语对应的序号，拼到sql中多语字段后。（该方法适用于meta的ExtraFields中字段多语，需要在sql语句中查出多语字段）
在nccloud.web.refer.RefHelper中给出一个获得多语序号的方法：
<img src='NC Cloud后端组件 (47).png'>
若参照action类在private端，语种下标需要通过参数传递到private端
<img src='NC Cloud后端组件 (48).png'>
在private端拼sql时拼接上该序号，并且AS为NAME 即可
<img src='NC Cloud后端组件 (49).png'>

### 3.5.2	前端多语

详细文档请查阅：
[http://172.16.50.46/nc-pub/Public_Document/blob/master/前端/前端框架/this.props.MultiInit.getMultiLang多语方案的说明文档.md](http://172.16.50.46/nc-pub/Public_Document/blob/master/前端/前端框架/this.props.MultiInit.getMultiLang多语方案的说明文档.md)
优化方案说明请查阅：
http://172.16.50.46/nc-pub/Public_Document/blob/master/前端/前端框架/多语优化方案(已确定).md

## 3.6	快捷键适配

快捷键组件基本通过平台配置即可.

### 3.6.1	组件切换

组件的切换快捷键是Tab， Tab键会依次聚焦到可聚焦的元素并触发元素onFocus事件。平台内的常见组件均已经做处理，Tab跳转操作是浏览器效果。使用平台的nc_*组件，则不需要做任何控制操作。
Tab键顺序是根据tabindex的值来顺序跳转的，目前平台默认都是tabindex=0，tabindex=-1时就会不可跳转。

### 3.6.2	表格表体间快捷键使用说明

<img src='NC Cloud后端组件 (50).png'>
通过在createPage配置orderOfHotKey参数排脂跳转顺序
<img src='NC Cloud后端组件 (51).png'>

### 3.6.3	功能按钮

通过在注册按钮处注册快捷键即可
<img src='NC Cloud后端组件 (52).png'>

### 3.6.4	模态窗口

createModal、CreateNCModal、PromptBox、nc_Popconfirm 这些组件内部添加了确定和取消按钮的快捷键，如果不想启用快捷键，使用配置项hotKeyboard:false。

### 3.6.5	单元组件

高阶组件已经由平台支持，基础组件中，可参看钉耙文档，
注意事项：
所有的键注册不区分大小写，但是组合键不能有空格，还要注意del、ins这种简写，详细见按钮#单体键章节。
错误示例：
['ctrl + e']、'ctrl + e'。
正确示例：
'ctrl+e'、['ctrl+e']、['ctrl+shift+del']

## 3.7	审批流、工作流以及影像处理

审批流主要是用于申请提交的过程当中，指定审核步骤，然后系统将会按照指定的审核步骤逐步发送到相关人员手中进行审批操作。
工作流与审批流有相似之处，其实是工作流当中可以包含审批流，同时还附加了额外的操作步骤，例如影像扫描等内容。
影像扫描主要是用于将纸质的发票信息等通过扫描的方式转换为图像信息然后存储到系统当中，可以独立工作，但通常都是同审批相关的操作结合起来，用于后续审批过程当中查阅核对单据信息。当然影响扫描也可以直接上传图片信息。

### 3.7.1	审批流

审批流主要是指定审批流程的步骤以及各个步骤之间的顺序关系。本小节主要讲述审批流的注意事项。

#### 单据动作注册主要是定义审批流当中的各个关键环节：提交、审批、收回等，同时配合相应的后台Java类指定该环节需要执行的具体操作。
单据动作注册的操作在NC当中有专门的节点负责，节点名称为单据动作管理。在该节点的左树当中选中相应的单据类型，然后在点击按钮区域的增行按钮增加记录即可。详情如下图所示:
<img src='NC Cloud后端组件 (53).png'>
此处需要注意的几点内容：
1.	动作代码，严格按照已有的样例编写；即，审批的动作代码应为APPROVE，提交的动作代码应为SAVE。
2.	动作名称也按照已有样例填写即可，清晰明了，便于后期维护。

#### 3.7.1.2	后台相关Java类编写

注册完成了单据动作之后，还需要开发人员编写相关的后台Java类；这些后台Java类在审批流程的关键环节将由平台调用，然后完成特定的校验以及其他业务逻辑。
后台Java类的编写要遵循几个规则：
1.	类名称有规范要求：应为N_单据类型编码_动作编码的形式命名类。供
应商申请单这个节点为例，供应商申请单的单据类型编码为10GY，审批动作的动作编码为APPROVE，所以审批时具体执行的业务动作类即为N_10GY_APPROVE。开发人员可以在开发环境当中找一下这个类文件。同时单据类型编码可以在NC节点——单据类型管理——当中找到，动作编码亦即上文单据动作注册小节当中提到的动作代码。
2.	后台类需要继承自nc.bs.pub.compiler.AbstractCompiler2，然后重新
实现父类的方法：public Object runComClass(PfParameterVO vo) throws BusinessException，这个方法当中包含了具体的业务操作逻辑，在相关动作触发时——如提交单据时——将由平台调用该方法。
实际上审批流相关的后台类沿用的就是原先的NC的，如果是NC原有的单据需要做轻量化的话，那么这些后台类就不需要重新编写了，沿用原NC的即可。如果是新做单据的话，就需要实现相关的后台类。

#### 3.7.1.3	提交收回动作的实现

虽然平台帮忙屏蔽了大部分审批流程的细节，但是提交以及收回动作还是需要业务开发人员具体实现。提交动作即为用户点击提交按钮时触发的相关操作，收回类似，都需要业务人员编码相关的Action。一旦提交完成之后，后续的审批等内容将会在NC Cloud的审批中心当中进行（对于轻量化来说是如此，对于传统的NC来说审批等按钮也需要业务开发人员编码相关代码）。
提交了之后，后续流程当中将会由平台调用相关的单据动作类，即上文后台相关Java类编写小节当中提到的Java后台类。
下面详细讲述一下提交以及收回动作的具体编码。
提交的动作类需要实现具体的提交操作。提交的编码过程如下：
1.	nccloud.pubitf.riart.pflow.CloudPFlowContext，new一个该类的对
象，然后填入动作代码，单据类型，以及VO等数据。
2.	调用nccloud.pubitf.riart.pflow.ICloudScriptPFlowService的
exeScriptPFlow方法，并将第一步创建的对象作为参数传入即可实现提交操作。
3.	还存在一种特殊情况，即不存在审批流的情况，这个时候需要调用另外
一个方法实现提交操作。是否有审批流可以通过下面的方法进行判定，返回boolean类型的值，方法为：nccloud.web.workflow.approve.util.NCCFlowUtils.hasApproveflowDef。如果不存在审批流，调用nccloud.pubitf.riart.pflow.ICloudScriptPFlowService的exeScriptPFlow_CommitNoFlowBatch方法
收回的动作同提交类似，同样是实现一个Java类，具体的收回操作如下：
1.	有审批流的收回操作同提交操作一样，只不过是动作编码不同。
2.	无审批流的收回操作，需要调用nccloud.pubitf.riart.pflow.ICloudScriptPFlowService的exeScriptPFlow_UnSaveNoFlowBatch方法
3.	判定是否有审批流的操作提交相同。
提交当中还有一个比较重要的点就是指派，指派是指当有多个第一轮审批人可供选择的时候，要选定一个审批人的操作。
1.	首先是提交的动作类当中，如果存在指派信息，那么nccloud.pubitf.riart.pflow.ICloudScriptPFlowService的exeScriptPFlow方法会返回相关的指派信息，后台类需要将这个指派信息返回到前端。
2.	前端当中需要一个指派组件ApprovalTrans，这个组件是现有的一个组件我们只需要调用即可。

#### 3.7.1.4	前端审批小应用实现

NC Cloud当中所有的审批操作都在审批中心当中进行，需要添加一个小应用用于在审批中心当中展示单据详情。通常情况下审批小应用可以使用单据卡片界面，但是其中的操作按钮需要进行相关的修正。此外就是需要在应用注册当中新注册一个小应用。
另外需要在NC Cloud的单据类型管理当中配置该小应用，将其作为审批展示界面，如下图所示：
<img src='NC Cloud后端组件 (54).png'>
是否轻量化单据勾选为是。

#### 3.7.1.5	审批详情

审批详情组件是现有组件，该组件可显示目前的审批进度以及总的审批流程，供提交人等查看审批的进度。
审批详情组件只需要导入ApproveDetail组件即可。

### 3.7.2	工作流以及共享服务接入

工作流是包含审批流的一种流程模式，同时附加了一些其他内容。工作流可以同共享服务中心相互沟通。共享服务中心是共享产品部完成的一个实现统一审批的功能，可以看做是工作流的延伸。

#### 3.7.2.1	工作流的适配

单纯的工作流是比较简单的，同审批流的开发流程极其接近，只是在单据动作注册的环境需要新加几个单据动作。以供应商申请单为例，如下图所示：
<img src='NC Cloud后端组件 (55).png'>
适配工作流需要注意的几个点：
1.	如果想要实现工作流，首先需要实现审批流。
2.	工作流相关的单据动作，如上图所示红框当中的动作选择都是“推式动作”
3.	动作代码和动作名称需要与上图一致。
如果是实现了审批流，那么适配工作流只是需要将上述的几个新增的单据动作实现Java后台类。

#### 3.7.2.2	共享服务接入

本小节主要讲述共享服务中心的接入工作。共享服务中心的接入主要是脚本的配置，另外包含了一部分的编码工作。
共享服务可以看做是工作流的一部分，同时共享服务有比较特殊的一点：如果接入共享服务，那么提交的时候会根据一种预置的映射关系，将提交单据的数据复制一份出来保存到共享服务中心的相关数据库表当中，也就是下面要提到的单据映射。

##### 3.7.2.2.1	脚本注册

首先是脚本注册，需要将一部分的预置数据做进数据库然后导出为预置脚本。此处需要注意的一个点为：需要注意各个模块之间的依赖关系；例如如果是uapbd模块的单据需要进共享，那么就不能将脚本做到uapbd的工程当中，而是应当交给共享服务维护，不然会导致升盘报错等问题的出现。需要添加预置数据的几个表为：sscrp_busiclass、sscrp_busiclass_b、sscrp_fieldmap，sscrp_fieldmap_b、pub_workflowgadget、pub_wf_participantex、org_sscbusiunitclientage、BD_SHAREBILLTYPE。下面详细讲述需要注册的几个表。
1.	sscrp_busiclass，需要注意的点：如果该单据不包含交易类型的话，那么该表的includesub字段应当为N
2.	sscrp_busiclass_b，如果要适配的单据不包含交易类型，那么不需要插入数据。该表包含条目1当中的主键，是条目1的子表。
3.	sscrp_fieldmap，单据映射的主表，该表的pk_group字段需要修正为GLOBLE00000000000000。后续升级环境时有共享的升级程序自动生成相关集团的数据。
4.	sscrp_fieldmap_b，单据映射的子表，该表当中起码应当预置如下字段的映射关系：单据类型、交易类型编码、单据编号、制单人、申请组织、单据主键、交易类型。如果缺少其中的任何映射字段，都会导致提交时报错或者流程走不通。
5.	剩余的几张表可以参考单据类型编码为10GY的数据进行预置，没有什么需要注意的内容。
此外类似于审批流当中定义的审批小应用，共享服务中心有我的报账跳转到单据界面的工作，所以需要一个新的小应用。在NC Cloud的单据类型管理界面为关联小应用添加一条记录，应用编码为业务单据应用编码，页面编码为卡片界面编码（在应用注册当中可查）。
此外还有一项额外工作，需要在关联小应用的数据库表当中将scope字段修正为10，执行一条如下所示的样例SQL：update bd_relatedApp set sence='10' where pk_billtypecode='10GY' and sence='6'。

##### 3.7.2.2.2	编码工作

本小节主要讲述适配共享服务需要做的编码工作。
在上一小节脚本注册当中提到了sscrp_busiclass这张数据库表，其中有一个字段是PK_BUSICLASS，需要填一个类的全路径名，这个主要是用于在NC Cloud轻量化节点我的报账当中跳转业务节点以及其他展示单据处使用，该类文件需要继承nccloud.pubitf.sscrp.rpbill.BasePortal，同时实现下面描述的几个方法：
1.	public JSONObject getURL4MakeBill(QryConditionVO param)方法，返回有一个URL用于在我的报账节点点击超链接跳转到业务单据卡片界面用。
2.	public JSONObject getURL4Show(QryConditionVO param)，用于共享服务中心审批时展示用。
提交的过程需要做修正，共享服务中心当中可以配置指定组织的单据接入共享服务中心，所以在提交的时候我们需要坐下判定：该单据所在组织是否已经需要走共享服务中心，也就是是否需要走工作流。详情可参考类文件：
需要注意的点：
1.	注意模块之间的依赖，像是此次UAPBD的单据接入共享，但是UAPBD并不依赖共享，在调用共享的相关接口之前需要首先判定下是否已安装并启用了共享。相关代码如下：InitGroupQuery.isEnabled(InvocationInfoProxy.getInstance().getGroupId(), "7010");

##### 3.7.2.2.3	元数据问题

开发过程当中需要注意元数据，如果元数据存在问题可能导致流程出错。下面是一个需要注意的点，无交易类型的单据其交易类型的映射属性应为单据类型：
<img src='NC Cloud后端组件 (56).png'>

##### 3.7.2.2.4	工作流配置

完成上述的脚本以及编码工作之后，可以尝试性配置一下工作流然后看是否能够走通。
1.	配置简单审批流（包含审批子流程）并启用
<img src='NC Cloud后端组件 (57).png'>
<img src='NC Cloud后端组件 (58).png'>
2.	配置工作流
<img src='NC Cloud后端组件 (59).png'>
<img src='NC Cloud后端组件 (60).png'>
<img src='NC Cloud后端组件 (61).png'>
<img src='NC Cloud后端组件 (62).png'>
<img src='NC Cloud后端组件 (63).png'>
<img src='NC Cloud后端组件 (64).png'>
3.	配置共享服务中心
<img src='NC Cloud后端组件 (65).png'>
<img src='NC Cloud后端组件 (66).png'>
<img src='NC Cloud后端组件 (67).png'>
<img src='NC Cloud后端组件 (68).png'>
<img src='NC Cloud后端组件 (69).png'>
<img src='NC Cloud后端组件 (70).png'>
4.	提交单据并且走一下审批流程。具体流程为：现在审批中心审批，然后到我的任务当中提取任务做审批。如下图所示：
<img src='NC Cloud后端组件 (71).png'>
<img src='NC Cloud后端组件 (72).png'>
<img src='NC Cloud后端组件 (73).png'>

### 3.7.3	影像扫描适配

影像扫描是为纸质单据生成影像数据，保存到系统当中，便于后续的审核流程查看原始的纸质单据影像。影像扫描有两个功能，分别为影像扫描以及影像查看，下文为方便描述统一称之为影像扫描。影像扫描需要三个步骤，分别是：脚本注册、代码适配以及影像服务器搭建。最繁琐的一点在于影像服务器的搭建。

#### 3.7.3	影像扫描适配

影像扫描是为纸质单据生成影像数据，保存到系统当中，便于后续的审核流程查看原始的纸质单据影像。影像扫描有两个功能，分别为影像扫描以及影像查看，下文为方便描述统一称之为影像扫描。影像扫描需要三个步骤，分别是：脚本注册、代码适配以及影像服务器搭建。最繁琐的一点在于影像服务器的搭建。

#### 3.7.3.1	脚本注册

向数据库当中插入若干原始记录并提取为预置脚本。
1.	bd_scanbilltypeinfo：VO路径参照表。
2.	bd_scanconvertor：字段映射表。
3.	bd_imagescantype：扫描方式注册表。按单据类型注册扫描方式配置，配置信息映射到NC“扫描方式设置”节点，按树形展示，树形节点编码code，pk_parent为父节点pk。
4.	bd_billtype2
上述的脚本注册可以按照10GY编码搜索供应商申请单参考、进行注册。

#### 3.7.3.2	代码适配

前端导入相关的方法然后调用即可实现影像扫描以及影像查看。代码如下：
1. 影像查看代码适配：
<img src='NC Cloud后端组件 (74).png'>
2.	影像扫描代码适配：
<img src='NC Cloud后端组件 (75).png'>
3.	影像组件导入方式：
import {imageScan,  imageView} from "sscrp/rppub/components/image";
同时在单据的根目录下增加一个config.json文件，里面内容如下所示：
{
    "dependjs": ["../../../../sscrp/rppub/components/image/index.js"],
    "dependModuleName": ["sscrp/rppub/components/image"]
}
此外需要注意的是，单页应用缓存方案需要将config.json放到路由
面下的文件夹当中，最终里列表和卡片界面都是需要走这个文件夹下编译出来的HTML的。

#### 3.7.3.3	影像服务器搭建

影像扫描的具体实现并非属于NC，而是通过webservice的方式调用其他公司提供的接口。因此需要搭建一个专门的影像服务器。
影像服务器的搭建步骤如下：
1.	首先需要新建一个数据库并且执行脚本，具体脚本文件见附件。改脚本文件最好使用SQLdeveloper执行，否则会有执行过程出错导致最终不可用的情况。
2.	配置tomcat服务器TIMShome_x64\apache-tomcat-6.0.26\conf\server.xml，注意两个端口号，最好同下面截图想一致。
<img src='NC Cloud后端组件 (76).png'>
<img src='NC Cloud后端组件 (77).png'>
3.	配置影像与NC沟通接口等，如下图所示：
<img src='NC Cloud后端组件 (78).png'>
4.	配置影像服务器的数据库连接，配置文件地址：TIMShome_x64\apache-tomcat-6.0.26\webapps\TIMS-Server\WEB-INF\classes\db.properties，将数据库配置为第一步当中建立的数据库。如下图所示：
<img src='NC Cloud后端组件 (79).png'>
5.	NC端也需要做相关的配置以便NC和影像服务器能够沟通。首先是${NCHome}\modules\imag\META-INF\ImagFactory.xml文件。配置如下图：
<img src='NC Cloud后端组件 (80).png'>
6.	配置${NCHome}\modules\imag\META-INF\ImagFactory.xml文件。配置如下图：
<img src='NC Cloud后端组件 (81).png'>
7.	配置home下的 ${NCHome}\ierp\sf\busiCenterConfig.xml文件。修改文件中数据源信息：
<img src='NC Cloud后端组件 (82).png'>
8.	删除webservice临时文件：${NCHome}\temp\wsgen，删除此文件夹。
9.	配置影像服务器控件参数：
<img src='NC Cloud后端组件 (83).png'>
10.	接下来就是在影像服务器当中同步单据类型以及NC组织等内容，首先是同步单据类型，如下图所示：
<img src='NC Cloud后端组件 (84).png'>
11.	同步NC组织：
<img src='NC Cloud后端组件 (85).png'>
12.	上传天创的影像组件：
<img src='NC Cloud后端组件 (86).png'>
至此影像服务器配置完成。
