const express = require('express');
const marked = require('marked');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const menuJson = require('../public/json/menu');
const swig = require("swig-templates");
const common = require('../public/js/common');
const generateMDNavTree = require('../public/js/generateMDNavTree');
require('../public/js/fileListener');

let {activeCurMenu,batchDealImgPath,isFileExist,loadFileContent} = common;
let {getRightNavTree} = generateMDNavTree;
/**
 * 加载md内容，返回html
 * @param docName
 * @returns {*}
 */
function loadTemplateHtml(docName,parent){
    var docHtml;
    let docPath = path.join(__dirname,'..', 'doc',parent || docName,docName+'.md');
    if(!parent)
        docPath = path.join(__dirname,'..', 'doc', docName+'.md');
    if(!fs.existsSync(docPath))
        docHtml = "";
    else{
        /*不使用此种方式，因此种方式会有缓存
        let template = swig.compileFile(docPath);
        docHtml = template();*/
        docHtml = loadFileContent(docPath);
        docHtml = docHtml.split('</menu>').pop();
    }
    return batchDealImgPath(marked(docHtml),parent || docName).replace(/\<table/gi, '<div class="table-container">\n<table')
        .replace(/<\/table>/gi, "</table>\n</div>\n");
}
router.get('/', function(req, res, next) {
    activeCurMenu('',menuJson);
    res.render('index', {
        title: 'Express',
        content:'将Markdown文档转换为HTML显示',
        rightNav:[],
        menu:menuJson
    });
});
function renderPage(param){
    let {req,res,flag} = param;
    var doc = '';
    let parent = '';
    if(flag == 'second'){
        parent = req.params.parent;
    }else if(flag == 'third'){
        parent = req.params.parent.concat(path.sep + req.params.menuname);
    }
    doc = loadTemplateHtml(req.params.docName ,parent);

    console.log('doc------->',doc)
    console.log('menuJson--------->',menuJson);
    if(flag == 'first')
        activeCurMenu(req.params.docName,menuJson);
    else
        activeCurMenu(parent.concat(path.sep).concat(req.params.docName),menuJson);
    console.log('激活当前选中菜单后menuJson---------',menuJson)
    let mdPath = path.join(__dirname,'..', 'doc',parent,req.params.docName+'.md');
    if(flag == 'first'){
        mdPath = path.join(__dirname,'..', 'doc',req.params.docName,req.params.docName+'.md');
        if(!isFileExist(mdPath))
            mdPath = path.join(__dirname,'..', 'doc',req.params.docName+'.md');
    }
    let mdTree = getRightNavTree(mdPath);
    res.render('doc',{
        title:'markdown测试-',
        content:'测试------',
        rightNav:mdTree,
        menu:menuJson,
        doc:doc
    });
}
router.get('/:parent/:menuname/:docName', function(req, res, next) {
    renderPage({req,res,flag:'third'});
});
router.get('/:parent/:docName', function(req, res, next) {
    renderPage({req,res,flag:'second'});
});
router.get('/:docName',(req, res, next)=>{
    renderPage({req,res,flag:'first'});
});
module.exports = router;