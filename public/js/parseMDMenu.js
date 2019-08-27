const fs = require('fs');
const path = require('path');
var menuJson = require('../json/menu');
const common = require('./common');

const {writeFile,loadFileContent,isDir,isMD,readDir,deleteFile} = common;
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
 * 解析doc目录结构，重新生成menuJson
 * @param callback
 */
function generateMenuJson(callback){
    let reloadMenu = ()=>{
        let a =fs.readFileSync(path.join(__dirname,'..','..','public','json','menu.json'));
        setTimeout(()=>{
            readDir({
                dirpath:path.join(process.cwd(),'doc'),
                callback:(filepath)=>{
                    if(isMD(filepath))
                        setMenuJson({
                            srcpath:filepath,
                            isreload:false
                        });
                }
            });
        });
        setTimeout(()=>{
            writeMenu();
        });
    }
    if(Object.keys(menuJson).length>0){
        deleteFile({
            file:path.join(__dirname,'..','..','public','json','menu.json'),
            callback:()=>{
                writeFile({
                    file:path.join(__dirname,'..','..','public','json','menu.json'),
                    content:"{}",
                    callback:()=>{
                        menuJson = reloadMenuJson();
                        reloadMenu();
                    }
                });
            }
        });

    }else{
        reloadMenu();
    }
}
function reloadMenuJson(){
    let data = fs.readFileSync(path.join(__dirname,'..','..','public','json','menu.json'));
    return JSON.parse(data);
}
/**
 * 将指定md生成菜单插入menujson中
 * @param param
 */
function setMenuJson(param){
    let {srcpath} = param;
    let filename = srcpath.split(path.sep).pop();
    let parent = srcpath.split(path.sep.concat(filename)).shift().split('doc'+path.sep).pop().split(path.sep).shift();
    let component = srcpath.split('doc'.concat(path.sep)).pop().split('.md').shift();
    let strc = component.split(path.sep);
    let name = filename.split('.md').shift();
    if(strc.length>=2)
        name = strc[strc.length-2];
    let menucfg = {
        parent,name
    };
    //已存在父级节点
    if(menuJson[menucfg.parent]){
        menuJson[menucfg.parent][menucfg.name] = {
            version: "0.1.0",
            component: component
        }
    }else{
        menuJson[menucfg.parent] = {
            [menucfg.name] : {
                version: "0.1.0",
                component: component
            }
        }
    }
}

/**
 * 写入menu.json
 * @param callback
 */
function writeMenu(callback){
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
        /*let menucfgstr = getMenuCfg(mdContent);
        console.log('菜单配置--->',menucfgstr);
        let menucfg = JSON.parse(menucfgstr);
        console.log('替换前menuJson------->',menuJson)*/
        setMenuJson({srcpath});

    }
}
module.exports = {
    rewriteMenuJson:rewriteMenuJson,
    generateMenuJson:generateMenuJson
}