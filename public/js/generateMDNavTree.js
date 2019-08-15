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
        return nav.filter(item =>item.level<3).map((item,index)=>{
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
 * 将md目录处理成树结构
 * @param filepath
 * @returns {boolean}
 */
function getRightNavTree(filepath){
    let nav = getTopTwoTitle(filepath);
    if(nav){
        let h1 = nav.filter(item=>item.level==1);
        let h2 = nav.filter(item=>item.level==2);
        console.log('h1---------',h1)
        console.log('h2---------',h2)
        h2.forEach(item=>{
            let parentIndex = getParentIndex(nav,item.index);
            h1.forEach(temp=>{
                if(temp.index !== parentIndex)
                    return false;
                temp.children = temp.children.concat(item);
            });
        });
        console.log('md目录----',h1);
        return h1;
    }
}
module.exports={
    getRightNavTree:getRightNavTree
}