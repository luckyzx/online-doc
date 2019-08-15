var fs = require('fs');
var path = require('path');
var swig = require("swig-templates");

/**
 * 判断文件是否存在
 * @param filepath
 * @returns {*}
 */
function isFileExist(filepath){
    return fs.existsSync(filepath);
}

/**
 * 文件内容填充
 * @param param
 */
function writeFile(param) {
    let {content, file,callback} = param;
    fs.writeFile(file, content, (err)=> {
        if (err) throw err;
        callback && callback();
    });
}

/**
 * 读取文件内容
 * @param filepath
 * @returns {*}
 */
function loadFileContent(filepath){
    if(isFileExist(filepath)){
        return fs.readFileSync(filepath,'utf-8');
    }
}

/**
 * 判断是否是文件夹
 * @param filepath
 */
function isDir(filepath){
    let stas = fs.lstatSync(filepath);
    return stas.isDirectory();
}

/**
 * 获取文件后缀名
 * @param filepath
 * @returns {*}
 */
function getFileExt(filepath){
    return path.extname(filepath);
}

/**
 * 判断是否为MD文件
 * @param filepath
 * @returns {boolean}
 */
function isMD(filepath){
    return '.md' == getFileExt(filepath).toLowerCase();
}

/**
 * 获取json对象指定属性值
 * @param curDoc
 * @param menuJson
 * @returns {*}
 */
function activeCurMenu(curDoc,menuJson){
    let val;
    for(let key in menuJson){
        val = menuJson[key];
        if(typeof val == 'object'){
            if(val.hasOwnProperty('component')){
                if(val.component == curDoc)
                    val.active = true;
                else
                    val.active = false;
            }else
                activeCurMenu(curDoc,val);
        }
    }
}
module.exports = {
    writeFile:writeFile,
    isFileExist:isFileExist,
    loadFileContent:loadFileContent,
    isDir:isDir,
    getFileExt:getFileExt,
    isMD:isMD,
    activeCurMenu:activeCurMenu
};