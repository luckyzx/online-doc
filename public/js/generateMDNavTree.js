const common = require('./common');

const {isMD,loadFileContent} = common;

/**
 * 获取md文件所有一级和二级标题
 * @param filepath
 */
function getTopTwoTitle(filepath){
    if(!isMD(filepath))
        return;
    let content = loadFileContent(filepath);
    let nav = [];
    if(content){
        content.replace(/(#+)[^#][^\n]*?(?:\n)/g,(match,m1,m2)=>{
            let title = match.replace('\n', '');
            let level = m1.length;
            nav.push({
                title: title.replace(/^#+/, '').replace(/\([^)]*?\)/, ''),
                level: level,
                children: [],
            });
        });
        return nav.filter(item =>item.level<4).map((item,index)=>{
            item.index = index+1;
            return item;
        });
    }
}

/**
 * 获取指定目录的上级目录下标
 * @param arr
 * @param childindex
 * @returns {number | ((name: string) => IDBIndex)}
 */
function getParentIndex(arr,childindex){
    for(let i=childindex-1;i>=0;i--){
        if (arr[childindex-1].level > arr[i].level) {
            return arr[i].index;
        }
    }
}

/**
 * 组装右侧导航栏数据--将下级存入父级的children
 * @param param
 * @returns {boolean}
 */
function generateNavData(param){
    let {allData,maxLevel,dealData} = param;
    let maxLevelData = dealData ? dealData : allData.filter(item=>item.level==maxLevel);
    let preParentData = allData.filter(item=>item.level==maxLevel-1);
    if(maxLevel == 1){
        console.log('maxLevelData---------------1',maxLevelData)
        return maxLevelData;
    }else{
        maxLevelData.forEach(item=>{
            let parentIndex = getParentIndex(allData,item.index);
            preParentData.forEach(temp=>{
                if(temp.index !== parentIndex)
                    return false;
                temp.children = temp.children.concat(item);
            });
        });
        return generateNavData({
                    allData:allData,
                    dealData:preParentData,
                    maxLevel:--maxLevel
                })
    }
}
/**
 * 将md目录处理成树结构
 * @param filepath
 * @returns {boolean}
 */
function getRightNavTree(filepath){
    let nav = getTopTwoTitle(filepath);
    if(nav){
        let h1 = generateNavData({
            allData:nav,
            maxLevel:3
        });
        console.log('md目录----',h1);
        return h1;
    }
}
module.exports={
    getRightNavTree:getRightNavTree
}