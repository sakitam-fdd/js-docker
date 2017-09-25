/**
 * Created by FDD on 2016/11/17.
 */

var contentWidth = 0, contentHeight = 0, isOpen = 0, isFull = 0;
editor = null;//获取浏览器高度和宽度,高亮代码编辑器
var url = "tpl/demo/";
var isInt = 0;      //判断源码是否已经获取过，如果获取过，则直接显示当前页面源码，否则从服务器获取
var isTab = 1;
var description = [
  {
    name: '简单地图',
    link: 'sampleMap.html'
  }
];
/**
 * 页面初始化
 */
(function () {
  setTimeout(downLoadHtml, 2);
  // menuLocation();
  getresource();
  dragCode();
  codeChange();
  navigation();
  // init();
  screenResize();
  getNavList();
})();

/**左侧导航**/
function navigation(){
  var menu_head = $('.menu ul>li>a');
  var menu_body = $('.menu ul>li>.submenu');
  var menu_i = $('.menu ul>li>a>i');
  var flag = 0;
  menu_head.on('click',function(event){
    if(!$(this).hasClass("open clickState")){
      var des = ($(this).attr("listid")-1) * 52;
      $(".menu").animate({scrollTop:des},200);
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

/**
 * 获取列表
 */
function getNavList () {
  $.ajax({
    url: 'http://openlayers.org/en/latest/examples/index.js',
    type: 'GET',
    dataType: 'text',
    // 如果请求成功时执行回调
    success: function (res) {
      var json = JSON.parse(res)
      console.log(json)
    },
    // 如果请求失败时执行回调
    error: function (error) {
      console.log(error)
    }
  })
}

/**
 * 页面自适应
 */
function screenResize () {
  if (typeof( $(window).innerWidth()) == 'number') {
    //Non-IE
    contentWidth = $(window).innerWidth();
    contentHeight = $(window).innerHeight();
  }
  else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    contentWidth = document.documentElement.clientWidth;
    contentHeight = document.documentElement.clientHeight;
  }
  window.onresize = function () {
    if (typeof( $(window).innerWidth() ) == 'number') {
      //Non-IE
      contentWidth = window.innerWidth;
      contentHeight = window.innerHeight;
    }
    else if (document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight)) {
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
function mapheight () {
  $("#container").width(contentWidth - $(".menu")[0].offsetWidth - $(".codeContent")[0].offsetWidth - 5);
  $("#container").height(contentHeight - 50);
}

/**
 * 开关代码编辑器
 */
function togglebar () {
  var codeContent = $('.codeContent');
  var map = $('#container');
  var toggleImg = $('.toggle-img');
  if (codeContent[0].offsetWidth <= 0) {//如果已经关闭，则打开
    codeContent.animate({
      width: 500
    }, 200);
    map.animate({
      width: contentWidth - 785
    }, 200);
  } else {
    codeContent.animate({
      width: 0
    }, 200);
    map.animate({
      width: contentWidth - 285
    }, 200);
  }
  setTimeout(function () {
    codeChange()
  }, 200);
}

/**
 * 代码变化
 */
function codeChange () {
  if ($(".codeContent")[0].offsetWidth > 0) {
    $(".codeContent_open").hide();
    $(".codeContent_close").show();
  } else {
    $(".codeContent_close").hide();
    $(".codeContent_open").show();
  }
}

/**
 * 刷新页面
 */
function refresh () {
  $("#myresource").val(localStorage.content);
  initEditor();
  run();
}

/**
 * 从服务器获取html页面
 */
function getresource () {
  //初始化剪切板
  // init();
  //创建ajax连接
  function createXmlHttpRequest () {
    try {
      return new XMLHttpRequest();
    }
    catch (e) {
      return new ActiveXObject("Microsoft.XMLHTTP");
    }
  }

  var mylink;
  if (window.location.toString().indexOf("#") == -1) {
    mylink = url + "a1_2.html";
  } else {
    mylink = url + window.location.toString().split("#")[1] + ".html";
  }
  var xmlHttp = createXmlHttpRequest();
  xmlHttp.open("get", mylink, false);
  xmlHttp.send();
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
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
function downLoadHtml () {
  var location = window.location.toString();
  var page;
  var index = location.indexOf('#');
  if (index > 0) {
    page = location.substr(index + 1, location.length - 1);
    for (var i = 0; i < description.length; i++) {
      if (page == description[i]) {
        $('#container').src = 'tpl/demo/' + page + '.html';
        mapheight();
        setIntro(page);
      }
    }
  } else {
    page = "a1_2";
    $('#container').attr("src", 'tpl/demo/a1_2.html');
    mapheight();
    setIntro(page);
    // menuLocation();
  }
}

function setIntro (id) {
  $('#container').attr("src", 'tpl/demo/' + id + '.html');
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
function initEditor () {
  if (!editor) {
    editor = CodeMirror.fromTextArea(document.getElementById("myresource"), {
      lineWrapping: true, //是否显示scroll
      lineNumbers: false, //是否显示number
      styleActiveLine: true,
      matchBrackets: true,
      mode: "htmlmixed",
      viewportMargin: Infinity
    });
  } else {
    editor.setValue($("#myresource").val());
  }
}

/**
 * 设置显示源码的拖拽效果
 */
function dragCode () {
  $("#drag").mousedown(function () {
    document.onselectstart = function () {
      return false;
    };
    document.onmousemove = function (e) {
      var bottomX = (e || window.event).clientX - 281;
      if ($("#overiframe").is(":hidden") == true) {
        $("#overiframe").show();
      }
      if (bottomX <= 0) {
        bottomX = 0;
      }
      if (bottomX >= myWidth - 287) {
        bottomX = myWidth - 287;
      }
      $(".codeContent").width(bottomX);
      $("#myresource").width(bottomX * 0.8);
      $("#container").width(myWidth - bottomX - 287);
      $("#overiframe").width(myWidth - bottomX - 287);
    };
    document.onmouseup = function () {
      document.onmousemove = null;
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
function init () {
  // debugger;
  clip = new ZeroClipboard.Client();
  clip.setHandCursor(true);
  clip.addEventListener('load', function (client) {
    console.log("Flash movie loaded and ready.");
  });
  clip.addEventListener('mouseOver', function (client) {
    // update the text on mouse over
    $("#d_clip_button").css({fontWeight: "bold"});
    var iframeContent = $("#myresource").val();
    if (editor) {
      iframeContent = editor.getValue();
    }
    clip.setText(iframeContent);
  });
  clip.addEventListener('mouseOut', function (client) {
    $("#d_clip_button").css({fontWeight: "normal"});
    // $("#d_clip_button").style.fontWeight = "normal";
  });
  clip.addEventListener('complete', function (client, text) {
    console.log("Copied text to clipboard: " + text);
  });
  clip.glue('d_clip_button');
}

/**
 * 运行代码
 */
function run () {
  var iframeContent = $("#myresource").val();
  if (editor) {
    iframeContent = editor.getValue();
  }
  var nr = iframeContent.indexOf("<body>");
  var iframeHead = iframeContent.slice(0, nr);
  var iframeFooter = iframeContent.slice(nr, iframeContent.length);
  var iFrame = document.getElementById("container").contentWindow;
  iFrame.document.open();
  iFrame.document.write(iframeHead);
  iFrame.document.write(iframeFooter);
  iFrame.document.close();
}