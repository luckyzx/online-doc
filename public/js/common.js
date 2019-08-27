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
 * 删除文件
 * @param param
 */
function deleteFile(param){
    let {file,callback} = param;
    fs.unlink(file, (err)=> {
        if (err) throw err;
        console.log(isFileExist(file))
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
    let stas;
    try{
        stas = fs.lstatSync(filepath);
    }catch(e){
        throw e;
    }
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

/**
 * 批量替换图片路径
 * @param mdContent
 * @param mdName
 */
function batchDealImgPath(mdContent,mdName){
    if(mdContent){
        mdContent = decodeURI(mdContent);
        mdContent = mdContent.replace(/<(img|IMG).*?(?:>|\/>)/g,(matchStr,m1,m2)=>{
            console.log("matchStr------>",matchStr);
            let imgName='';
            let imgPath='';
            matchStr.replace(/(src|SRC).*?[=](\'|\")?.+(\'|\")?[^\/>]/g,(str,regStr,index)=>{
                //说明有多个属性
                if(str.split('src=').pop().includes('=')){
                    imgName = str.split('src=').pop().split(' ').shift().replace(/\'/g,'').replace(/\"/g,'');
                    imgPath =str.split('src=').pop().split(' ').shift().replace(/\'/g,'').replace(/\"/g,'');
                }else{
                    imgName = str.split('src=').pop().replace(/\'/g,'').replace(/\"/g,'');
                    imgPath = str.split('src=').pop().replace(/\'/g,'').replace(/\"/g,'');
                }
                if(imgPath.includes('./')){
                    imgPath = path.join(mdName,imgPath.split('./').pop());
                }else if(imgPath.includes('.\\'))
                    imgPath = path.join(mdName,imgPath.split('.\\').pop());
                else
                    imgPath = path.join(mdName,imgPath);

                if(str.includes('/') || str.includes('\\')){
                    imgName = str.split('src=').pop().split(' ').shift().split('/').pop().replace(/\"/g,'');
                    if(str.includes('\\'))
                        imgName = str.split('src=').pop().split(' ').shift().split('\\').pop().replace(/\"/g,'');
                    str = str.replace(/\"/g,'\'');
                    //兼容图片名称包含空格
                    if(!imgName.includes('.') && str.split('src=').pop().split('\'').length>2)
                        imgName = str.split('src=').pop().split('\'')[1].split('/').pop();
                }
            });
            imgPath = imgPath.split(imgName).shift();
            /*let newStr = matchStr.split('=').shift().concat("='"+path.join(path.sep,'static','doc',mdName,'images'))
                .concat(path.sep+imgName+'\'').concat(' width="100%" />');*/
            let newStr = matchStr.split('src=').shift().concat('src=\'').concat(path.join(path.sep,'doc',imgPath,imgName))
                .concat('\' width="100%"  ').concat(matchStr.split(imgName).pop().replace(/\'/g,'').replace(/\"/g,''));
            console.log('newStr--------',newStr)
            return newStr;
        });
        return mdContent;
    }
}

/**
 * 获取第一层目录
 * @param srcpath
 * @returns {T | undefined}
 */
function getFirstDir(srcpath){
    if(isDir(srcpath)){
        let relativePath = srcpath.split('doc'.concat(path.sep)).pop();
        let folderName = relativePath.split(path.sep).shift();
        return srcpath.split(folderName).shift().concat(folderName);
    }
}

/**
 * 读取目录
 * @param param
 */
function readDir(param){
    let {dirpath,callback} = param;
    if(isDir(dirpath)){
        let files = fs.readdirSync(dirpath,{
            encoding:'utf8'
        });
        files.forEach(item=>{
            let filepath = path.join(dirpath,item);
            if(isDir(filepath)){
                readDir({
                    dirpath:filepath,
                    callback
                })
            }else
                callback && callback(filepath);
        });
    }
}
module.exports = {
    writeFile:writeFile,
    isFileExist:isFileExist,
    loadFileContent:loadFileContent,
    isDir:isDir,
    getFileExt:getFileExt,
    isMD:isMD,
    activeCurMenu:activeCurMenu,
    batchDealImgPath:batchDealImgPath,
    getFirstDir:getFirstDir,
    readDir:readDir,
    deleteFile:deleteFile
};