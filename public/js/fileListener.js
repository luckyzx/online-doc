const chokidar = require('chokidar');
const path = require('path');
const moveMD = require('./moveMdFromdocToStatic');
const parseMDMenu = require('./parseMDMenu');

const {moveToStatic} = moveMD;
const {rewriteMenuJson} = parseMDMenu;

console.log('__dirname--->',__dirname)
console.log(path.join(__dirname,'..','..','doc'))
console.log(process.cwd())
const watcher = chokidar.watch(path.join(__dirname,'..','..','doc'),{
    persistent:true,//默认为 true，设置为 true，保持文件监听，为 false 的情况下，会在 ready 事件后不再触发事件
    ignoreInitial:true,//默认为false， 设置为 true ，避免在 chokidar 自身初始化的过程中触发 add、addDir 事件
    //followSymlinks:默认为 true，设置为 false，对 link 文件不监听真实文件内容的变化
    //ignored:/(^|[\/\\])\..//所要忽略监听的文件或者文件夹
    //cwd:string类型，没有默认值，类似于appBasepath，监听的paths所相对的路径。
    usePolling:false// 表示是否使用前面提到的fs.watchFile()进行轮询操作，由于轮询会导致cpu飙升，所以此选项通常在需要通过网络监视文件的时候才设置为true即使用fs.watchFile()，默认值为false
    //ignorePermissionErrors：默认为 false，设置为 true，忽略权限错误的提示
    //alwaysStat：默认为false，设置为 true，保持传递 fs.Stats，即使可能存在不存在的情况
    //depth： 设置为 0 ，表明对子文件夹不进行递归监听
    //atomic：默认为 false，设置为 false，关闭对同一文件删除后 100ms 内重新增加的行为触发 change 事件，而不是 unlink、add 事件的默认行为
});
//监听doc文件夹下 add addDir unlink（删除文件） unlinkDir（删除文件夹） change（文件内容改变）
watcher.on('all',(event,path)=>{
    //屏蔽删除
    if('unlink,unlinkDir'.includes(event))
        return;
    console.log('文件变化--->',path);
    //修改doc path后会默认追加___jb_tmp___
    if(path.includes('___jb_tmp___'))
        return;
    path = path.split('___jb_tmp___').shift();
    rewriteMenuJson({
        srcpath:path,
        callback:()=>{
            //moveToStatic(path);
        }
    });
});