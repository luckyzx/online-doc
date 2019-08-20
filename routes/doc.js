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

let {activeCurMenu,batchDealImgPath} = common;
let {getRightNavTree} = generateMDNavTree;
/**
 * 加载md内容，返回html
 * @param docName
 * @returns {*}
 */
function loadTemplateHtml(docName){
    var docHtml;
    let docPath = path.join(__dirname,'..','public', 'doc',docName,docName+'.md');
    if(!fs.existsSync(docPath))
        docHtml = "";
    else{
        let template = swig.compileFile(docPath);
        docHtml = template();
        docHtml = docHtml.split('</menu>').pop();
        //docHtml = batchDealImgPath(docHtml,docName);
    }
    return batchDealImgPath(marked(docHtml),docName).replace(/\<table/gi, '<div class="table-container">\n<table')
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
router.get('/:docName',(req, res, next)=>{
    console.log('req.params.docName:' + req.params.docName);
    var doc = loadTemplateHtml(req.params.docName || 'doc');
    console.log('doc------->',doc)
    console.log('menuJson--------->',menuJson);
    activeCurMenu(req.params.docName,menuJson);
    console.log('激活当前选中菜单后menuJson---------',menuJson)
    let mdTree = getRightNavTree(path.join(__dirname,'..','public', 'doc',req.params.docName,req.params.docName+'.md'));
    res.render('doc',{
        title:'markdown测试-',
        content:'测试------',
        rightNav:mdTree,
        menu:menuJson,
        doc:doc
    });
});
module.exports = router;