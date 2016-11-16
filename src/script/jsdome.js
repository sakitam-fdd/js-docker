/**
 * Created by FDD on 2016/11/16.
 */
var isInt = 0;      //判断源码是否已经获取过，如果获取过，则直接显示当前页面源码，否则从服务器获取
var isTab = 1;
var myWidth = 0, myHeight = 0, isOpen = 0, isFull = 0;editor = null;//获取浏览器高度和宽度,高亮代码编辑器
// var url = "http://developer.baidu.com/map/jsdemo/demo/";
var url = "tpl/demo/";
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
function screenResize(){
    if(typeof( $(window).innerWidth()) == 'number' ) {
        //Non-IE
        myWidth = $(window).innerWidth();
        myHeight = $(window).innerHeight();
    }
    else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    }
    window.onresize = function ()
    {
        if( typeof( $(window).innerWidth() ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        }
        else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)){
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        }
        mapheight();
    }
}

function codeChange(){
    if($("#code_area")[0].offsetWidth >0){
        $("#code_open").hide();
        $("#code_close").show();
    }else{
        $("#code_close").hide();
        $("#code_open").show();
    }
}
/**开关代码编辑器**/
function toggleFooter () {
    var code_area = $('#code_area');
    var map = $('#container');
    var toggleImg = $('#toggle-img');
    if(code_area[0].offsetWidth <=0){//如果已经关闭，则打开
        code_area.animate({
            width: 500
        }, 200);
        map.animate({
            width: myWidth - 785
        },200);
    }else{
        code_area.animate({
            width: 0
        }, 200);
        map.animate({
            width: myWidth - 285
        },200);
    }
    setTimeout(function(){codeChange()},200);
}
/**将用户修改过的代码加载到iframe中**/
function run(){
    var iframeContent=$("#myresource").val();
    if(editor){
        iframeContent=editor.getValue();
    }
    iframeContent = iframeContent.replace('您的密钥','E4805d16520de693a3fe707cdc962045');
    var nr=iframeContent.indexOf("<body>");
    var iframeHead=iframeContent.slice(0,nr);
    iframeHead = iframeHead.replace('您的密钥','E4805d16520de693a3fe707cdc962045');
    var iframeFooter=iframeContent.slice(nr,iframeContent.length);
    var iFrame=document.getElementById("container").contentWindow;
    iFrame.document.open();
    iFrame.document.write(iframeHead);
    iFrame.document.write(iframeFooter);
    iFrame.document.close();
}

/** 设置地图容器宽度 **/
function mapheight(){
    $("#container").width(myWidth - $("#menu")[0].offsetWidth - $("#code_area")[0].offsetWidth -5);
    $("#container").height(myHeight - 50);
}
function getresource(){
    init();
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
        mylink = url+"a1_2.htm";
    }else{
        mylink = url+window.location.toString().split("#")[1]+".htm";
    }
    var xmlHttp = createXmlHttpRequest();
    xmlHttp.open("get",mylink,false);
    xmlHttp.send();
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        str = xmlHttp.responseText;//str即为返回的html内容
        localStorage.content = str;
        str = str.replace('E4805d16520de693a3fe707cdc962045', '您的密钥');
        str = str.replace('63ebcdc7ae2791e5c03acda6aca6de52', '您的密钥');
        $("#myresource").val(str);
        initEditor();
        isInt = 1;
        isTab = 0;
    }
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
 * 刷新页面
 */
function refresh(){
    $("#myresource").val(localStorage.content);
    initEditor();
    run();
    $("#myresource").val(localStorage.content.replace('E4805d16520de693a3fe707cdc962045', '您的密钥'));
    initEditor();
}

function setIntro(id){
    $('#container').attr("src",'tpl/demo/'+id+'.htm');
    var location = window.location.toString();
    if (location.indexOf('#') > 0) {
        location = location.substr(0, location.indexOf('#'));
    }
    window.location = location += '#' + id;
    isTab = 1;
    getresource();
}

/** 复制功能 **/
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

/**左侧导航**/
function navigation(){
    var menu_head = $('#menu ul>li>a');
    var menu_body = $('#menu ul>li>.submenu');
    var menu_i = $('#menu ul>li>a>i');
    var flag = 0;
    menu_head.on('click',function(event){
        if(!$(this).hasClass("open clickState")){
            var des = ($(this).attr("listid")-1) * 52;
            $("#menu").animate({scrollTop:des},200);
            //slideToggle
            menu_body.slideUp('fast');
            $(this).next().stop(true,true).slideToggle('fast');
            menu_head.removeClass('open clickState');
            menu_i.removeClass('t_open');
            menu_i.addClass('t_close');
            $(this).addClass('open clickState');
            $(this).find('i').addClass('t_open');
        }else{
            if(flag == $(this).attr("listid")){
                $(this).removeClass('open');
            }else{
                $(this).removeClass('open clickState');
            }
            $(this).find("i").removeClass('t_open').addClass('t_close');
            $(this).parents("li").find(".submenu").slideUp('fast');
        }
    });
    $(".submenu a").on('click',function(){
        flag = $(this).parents("li").find(".one_head").attr("listid");
        if(!$(this).hasClass("clickState")){
            $(".submenu a").removeClass("clickState");
            $(this).addClass("clickState");
        }
        //代码宽度还原
        $("#code_area").width(500);
        mapheight();
    });
}
/**设置显示源码的拖拽效果**/
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
            $("#code_area").width(bottomX);
            $("#myresource").width(bottomX*0.8);
            $("#container").width(myWidth - bottomX -287);
            $("#overiframe").width(myWidth - bottomX -287);
        };
        document.onmouseup=function(){
            document.onmousemove=null;
            $("#overiframe").hide();
            codeChange();
            init();
        };
    });
}
/**跳转到对应的html页面**/
function downLoadHtml(){
    var location = window.location.toString();
    var page;
    var index = location.indexOf('#');
    if (index > 0) {
        page = location.substr(index + 1, location.length - 1);
        for(var i=0;i<description.length;i++){
            if(page == description[i]){
                $('container').src = 'tpl/demo/' + page + '.htm';
                mapheight();
                setIntro(page);
            }
        }
    }else{
        page = "a1_2";
        $('#container').attr("src",'tpl/demo/a1_2.htm');
        mapheight();
        setIntro(page);
        menuLocation();
    }
}
/**刷新页面保证menu的定位**/
function menuLocation(){
    var id = window.location.toString().split("#")[1];
    localStorage.id = id;
    $("#menu a[href$='"+localStorage.id+".htm']").parents("li").find(".one_head").addClass("open clickState");
    $("#menu a[href$='"+localStorage.id+".htm']").parents("li").find("i").removeClass("t_close").addClass("t_open");
    $("#menu a[href$='"+localStorage.id+".htm']").parents(".submenu").show();
    $("#menu a[href$='"+localStorage.id+".htm']").addClass("clickState");
    var des = (($("#menu a[href$='"+localStorage.id+".htm']").parents("li").find(".one_head").attr("listid"))-1) * 52;
    $("#menu").animate({scrollTop:des},0);
}
/**页面初始化**/
(function(){
    setTimeout(downLoadHtml,2);
    menuLocation();
    getresource();
    dragCode();
    codeChange();
    navigation();
    init();
    screenResize();
})();
