var fs = require('fs');
var path = require('path');
const common = require('./common');

const {isFileExist,isDir,getFileExt,isMD} = common;

/**
 * 初始化目录结构
 * @param param
 */
function initDir(param){
    let {srcPath,destFolder,styleFolder,imgFolder,filename} = param;
    if(!isMD(srcPath) && !isImg(srcPath))
        return;
    if(isImg(srcPath)){
        destFolder = path.join(__dirname,'..','..','public','doc',srcPath.split(path.sep + filename).shift().split(path.sep).pop());
        styleFolder = path.join(destFolder,'style');
        imgFolder = path.join(destFolder,'images');
        console.log('最新参数---》',destFolder,styleFolder,imgFolder)
    }
    console.log('开始创建目的目录---->',destFolder)
    !isFileExist(destFolder) && fs.mkdirSync(destFolder);
    !isFileExist(styleFolder) && fs.mkdirSync(styleFolder);
    !isFileExist(imgFolder) && fs.mkdirSync(imgFolder);
    console.log('目的目录创建成功')
}

/**
 * 拷贝文件
 * @param param
 */
function copyFile(param){
    let {srcPath,destFolder,filename,imgFolder} = param;
    let destPath = path.join(destFolder,filename);
    console.log('拷贝文件')
    if(isImg(srcPath))
        destPath = path.join(imgFolder,filename);
    console.log('destPath---->',destPath)
    fs.copyFileSync(srcPath,destPath);
    console.log('拷贝成功')
}

/**
 * 判断是否为图片
 * @param filepath
 * @returns {*}
 */
function isImg(filepath){
    console.log('后缀-----------',getFileExt(filepath).toLowerCase());
    return ".jpg,.png,.gif,.bmp".includes(getFileExt(filepath).toLowerCase());
}
/**
 * 将doc/下  新增的md文件拷贝到public/doc/下
 * @param srcPath
 */
function moveToStatic(srcPath){
    let filename = srcPath.split(path.sep).pop();
    if(!isFileExist(srcPath)){
        console.log(`${filename}不存在！`)
        return;
    }
    let destFolder = path.join(__dirname,'..','..','public','doc',filename.split('.').shift());
    let destPath = path.join(destFolder,filename);
    let styleFolder = path.join(destFolder,'style');
    let imgFolder = path.join(destFolder,'images');
    initDir({
        srcPath,
        destFolder,
        filename,
        styleFolder,
        imgFolder
    });
    console.log('isDir()---------->',isDir(srcPath))
    if(isDir(srcPath)){
        let srcdir = fs.readdirSync(srcPath);
        srcdir.forEach((item)=>{
            console.log(item)
            let filePath = path.join(srcPath,item);
            copyFile({
                srcPath,
                destFolder,
                filename,
                imgFolder
            });
        });
    }else{
        if(isImg(srcPath)){
            destFolder = path.join(__dirname,'..','..','public','doc',srcPath.split(path.sep + filename).shift().split(path.sep).pop());
            imgFolder = path.join(destFolder,'images');
        }
        copyFile({
            srcPath,destFolder,filename,imgFolder
        });
    }

}
module.exports = {
    moveToStatic:moveToStatic
}