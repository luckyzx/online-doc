const fs = require('fs');
const path = require('path');
const menuJson = require('../json/menu');
const common = require('./common');

const {writeFile,loadFileContent,isDir,isMD} = common;

/**
 * 获取md中菜单项配置
 * @param mdContent
 */
function getMenuCfg(mdContent){
    return mdContent.split('<menu>').pop().split('</menu>').shift().replace(/\n/g,'').replace(/\'/g,'\"');
}

/**
 * 获取md文件路径
 * @param srcpath
 * @returns {*}
 */
function getDocPath(srcpath){
    return isDir(srcpath) ? path.join(srcpath,srcpath.split(path.sep).pop()) : srcpath;
}
/**
 * 将md中菜单配置 更新到menu.json文件中
 * @param param
 */
function rewriteMenuJson(param){
    let {srcpath,callback} = param;
    //只有md走菜单注册
    if(!isMD(srcpath)){
        callback && callback();
        return;
    }
    srcpath = getDocPath(srcpath);
    let filename = srcpath.split(path.sep).pop();
    console.log('filename--->',filename)
    let mdContent = loadFileContent(srcpath);
    if(mdContent){
        let menucfgstr = getMenuCfg(mdContent);
        console.log('菜单配置--->',menucfgstr);
        let menucfg = JSON.parse(menucfgstr);
        console.log('替换前menuJson------->',menuJson)
        //已存在父级节点
        if(menuJson[menucfg.parent]){
            menuJson[menucfg.parent][menucfg.name] = {
                version: "0.1.0",
                component: filename.split(".md").shift()
            }
        }else{
            menuJson[menucfg.parent] = {
                [menucfg.name] : {
                    version: "0.1.0",
                    component: filename.split(".md").shift()
                }
            }
        }
        let newMenuJson = JSON.stringify(menuJson);
        console.log('替换后menuJson------>',newMenuJson)
        writeFile({
            file:path.join(__dirname,'..','..','public','json','menu.json'),
            content:newMenuJson,
            callback:()=>{
                console.log('菜单json已更新');
                callback && callback();
            }
        });
    }
}
module.exports = {
    rewriteMenuJson:rewriteMenuJson
}