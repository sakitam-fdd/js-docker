/**
 * Created by FDD on 2016/11/17.
 */

var contentWidth = 0, contentHeight = 0, isOpen = 0, isFull = 0;editor = null;//获取浏览器高度和宽度,高亮代码编辑器
var url = "tpl/demo/";
var isInt = 0;      //判断源码是否已经获取过，如果获取过，则直接显示当前页面源码，否则从服务器获取
var isTab = 1;
var description = ["a1_1","a1_2","a1_3","a1_4","a1_5","a1_6","a1_7",
    "a2_1","a2_2","a2_3",
    "a3_1","a3_2","a3_3",
    "a4_1","a4_2","a4_3",
    "a5_1","a5_2","a5_3",
    "a6_1","a6_2","a6_3","a7_1",
    "b0_1","b0_2","b0_3","b0_4","b0_5","b0_6","b0_7",
    "c1_1","c1_2","c1_3","c1_4","c1_5","c1_6","c1_7","c1_8","c1_9","c1_10","c1_11","c1_12","c1_13","c1_14","c1_15","c1_16","c1_17","c1_18","c1_19",
    "c2_1","c2_2","c2_3","c2_4","c2_5","c2_6","c2_7","c2_8","c2_9",
    "d0_1","d0_2","d0_3","d0_4","d0_5",
    "e0_1","e0_2","e0_3","e0_4",
    "f0_1","f0_2","f0_3","f0_4","f0_5","f0_6","f0_7",
    "g0_1","g0_2","g0_3","g0_4","g0_5",
    "h0_1","h0_2","h0_3","h0_4","h0_5","h0_6",
    "i1_1","i1_2","i1_3","i1_4","i1_5","i1_6","i2_1","i3_1","i3_2","i3_3","i3_4",
    "i4_1","i4_2","i4_3","i4_4","i4_5","i4_6","i4_7","i4_8","i4_9","i4_10",
    "i5_1","i5_2","i5_3","i5_4","i5_5","i5_6","i5_7","i5_8",
    "i6_1","i6_2",
    "i7_1","i7_2","i7_3","i7_4",
    "i8_1","i8_2","i8_3","i8_4",
    "j1_0","j1_1","j1_2","j1_3","j2_0","j3_0","j4_0","j5_3","j5_4","j5_5","j5_7","j5_8","j5_9",
    "k0_1","k0_2","k0_3"
];
/**
 * 页面初始化
 */
(function(){
    setTimeout(downLoadHtml,2);
    // menuLocation();
    getresource();
    dragCode();
    codeChange();
    // navigation();
    // init();
    screenResize();
})();
/**
 * 页面自适应
 */
function screenResize(){
    if(typeof( $(window).innerWidth()) == 'number' ) {
        //Non-IE
        contentWidth = $(window).innerWidth();
        contentHeight = $(window).innerHeight();
    }
    else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
        //IE 6+ in 'standards compliant mode'
        contentWidth = document.documentElement.clientWidth;
        contentHeight = document.documentElement.clientHeight;
    }
    window.onresize = function ()
    {
        if( typeof( $(window).innerWidth() ) == 'number' ) {
            //Non-IE
            contentWidth = window.innerWidth;
            contentHeight = window.innerHeight;
        }
        else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
            //IE 6+ in 'standards compliant mode'
            contentWidth = document.documentElement.clientWidth;
            contentHeight = document.documentElement.clientHeight;
        }
        mapheight();
    }
}

/**
 * 设置地图容器宽度
 */
function mapheight(){
    $("#container").width(contentWidth - $(".menu")[0].offsetWidth - $(".codeContent")[0].offsetWidth -5);
    $("#container").height(contentHeight - 50);
}
/**
 * 开关代码编辑器
 */
function togglebar () {
    var codeContent = $('.codeContent');
    var map = $('#container');
    var toggleImg = $('.toggle-img');
    if(codeContent[0].offsetWidth <=0){//如果已经关闭，则打开
        codeContent.animate({
            width: 500
        }, 200);
        map.animate({
            width: contentWidth - 785
        },200);
    }else{
        codeContent.animate({
            width: 0
        }, 200);
        map.animate({
            width: contentWidth - 285
        },200);
    }
    setTimeout(function(){codeChange()},200);
}
/**
 * 代码变化
 */
function codeChange(){
    if($(".codeContent")[0].offsetWidth >0){
        $(".codeContent_open").hide();
        $(".codeContent_close").show();
    }else{
        $(".codeContent_close").hide();
        $(".codeContent_open").show();
    }
}
/**
 * 刷新页面
 */
function refresh(){
    $("#myresource").val(localStorage.content);
    initEditor();
    run();
}
/**
 * 从服务器获取html页面
 */
function getresource(){
    //初始化剪切板
    // init();
    //创建ajax连接
    function createXmlHttpRequest(){
        try {
            return new XMLHttpRequest();
        }
        catch(e){
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    var mylink;
    if(window.location.toString().indexOf("#") == -1){
        mylink = url+"a1_2.html";
    }else{
        mylink = url+window.location.toString().split("#")[1]+".html";
    }
    var xmlHttp = createXmlHttpRequest();
    xmlHttp.open("get",mylink,false);
    xmlHttp.send();
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        str = xmlHttp.responseText;//str即为返回的html内容
        localStorage.content = str;
        $("#myresource").val(str);
        initEditor();
        isInt = 1;
        isTab = 0;
    }
}
/**
 * 跳转到对应的html页面
 */
function downLoadHtml(){
    var location = window.location.toString();
    var page;
    var index = location.indexOf('#');
    if (index > 0) {
        page = location.substr(index + 1, location.length - 1);
        for(var i=0;i<description.length;i++){
            if(page == description[i]){
                $('#container').src = 'tpl/demo/' + page + '.html';
                mapheight();
                setIntro(page);
            }
        }
    }else{
        page = "a1_2";
        $('#container').attr("src",'tpl/demo/a1_2.html');
        mapheight();
        setIntro(page);
        // menuLocation();
    }
}
function setIntro(id){
    $('#container').attr("src",'tpl/demo/'+id+'.html');
    var location = window.location.toString();
    if (location.indexOf('#') > 0) {
        location = location.substr(0, location.indexOf('#'));
    }
    window.location = location += '#' + id;
    isTab = 1;
    getresource();
}
/**
 * 初始化文本编辑器
 */
function initEditor(){
    if(!editor){
        editor = CodeMirror.fromTextArea(document.getElementById("myresource"), {
            lineWrapping:true, //是否显示scroll
            lineNumbers: false, //是否显示number
            styleActiveLine: true,
            matchBrackets: true,
            mode:"htmlmixed",
            viewportMargin: Infinity
        });
    }else{
        editor.setValue($("#myresource").val());
    }
}

/**
 * 设置显示源码的拖拽效果
 */
function dragCode(){
    $("#drag").mousedown(function(){
        document.onselectstart = function(){return false;};
        document.onmousemove = function(e){
            var bottomX = (e||window.event).clientX -281;
            if($("#overiframe").is(":hidden")==true){
                $("#overiframe").show();
            }
            if(bottomX <=0){
                bottomX = 0;
            }
            if(bottomX >= myWidth - 287){
                bottomX = myWidth - 287;
            }
            $(".codeContent").width(bottomX);
            $("#myresource").width(bottomX*0.8);
            $("#container").width(myWidth - bottomX -287);
            $("#overiframe").width(myWidth - bottomX -287);
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            $("#overiframe").hide();
            codeChange();
            // init();
        };
    });
}

/**
 * 复制功能
 * @type {null}
 */
var clip = null;
var copyTimer = null;   //显示复制成功的定时器
function init() {
    // debugger;
    clip = new ZeroClipboard.Client();
    clip.setHandCursor( true );
    clip.addEventListener('load', function (client) {
        debugstr("Flash movie loaded and ready.");
    });
    clip.addEventListener('mouseOver', function (client) {
        // update the text on mouse over
        $("#d_clip_button").css({fontWeight:"bold"});
        var iframeContent=$("#myresource").val();
        if(editor){
            iframeContent=editor.getValue();
        }
        clip.setText( iframeContent );
    });
    clip.addEventListener('mouseOut', function (client) {
        $("#d_clip_button").css({fontWeight:"normal"});
        // $("#d_clip_button").style.fontWeight = "normal";
    });
    clip.addEventListener('complete', function (client, text) {
        debugstr("Copied text to clipboard: " + text );
    });
    clip.glue('d_clip_button');
}
/**
 * 运行代码
 */
function run(){
    var iframeContent=$("#myresource").val();
    if(editor){
        iframeContent=editor.getValue();
    }
    var nr=iframeContent.indexOf("<body>");
    var iframeHead=iframeContent.slice(0,nr);
    var iframeFooter=iframeContent.slice(nr,iframeContent.length);
    var iFrame=document.getElementById("container").contentWindow;
    iFrame.document.open();
    iFrame.document.write(iframeHead);
    iFrame.document.write(iframeFooter);
    iFrame.document.close();
}