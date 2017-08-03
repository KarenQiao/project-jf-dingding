/**
 * Created by Administrator on 2016/2/3.
 * 嘉福ui组件
 */

//增加active事件
document.addEventListener('touchstart',function(){},false);


//判断浏览器和设备
var browser = {
    os: function () {
        var u = navigator.userAgent;
        return {// 操作系统
            linux: !!u.match(/\(X11;( U;)? Linux/i), // Linux
            windows: !!u.match(/Windows/i), // Windows
            android: !!u.match(/Android/i), // Android
            iOS: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // iOS
        };
    }(),
    device: function () {
        var u = navigator.userAgent;
        return {// 设备
            mobile: !!u.match(/AppleWebKit/i), // mobile
            iPhone: !!u.match(/iPhone/i), // iPhone
            iPad: !!u.match(/iPad/i), // iPad
        };
    }(),
    supplier: function () {
        var u = navigator.userAgent;
        return {// 浏览器类型
            qq: !!u.match(/QQ\/\d+/i), // QQ
            wechat: !!u.match(/MicroMessenger/i), // WeChat
            weixin: u.match(/MicroMessenger/i) == 'MicroMessenger',
            ios: u.indexOf('_JFiOS') > -1,
            android: u.indexOf('_jfAndroid') > -1,
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        };

    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase(),

    androidVersion: function () {//判断安卓版本
        var userAgent = navigator.userAgent;
        var index = userAgent.indexOf("Android")
        if (index >= 0) {
            return parseFloat(userAgent.slice(index + 8));

        }
    }(),

    IosVersion:function () {//ios版本
        var str= navigator.userAgent.toLowerCase();
        var ver=str.match(/cpu iphone os (.*?) like mac os/);
        if(!ver){

            return -1;

        }else{

            return ver[1].replace(/_/g,".");
        }
    }()
    //browser.supplier.wechat
};
//判断结束


//禁止所有事件

var windowBanEvent = {

    bundling: function () {
        var _self = this;
        _self.bundingEvent(1)

    },

    unbundling: function () {
        var _self = this;
        _self.bundingEvent(0)


    },

    Canceling: function (evt) {

        var evt = evt || window.event; //阻止事件
        if (evt.preventDefault) {
            evt.preventDefault();
            evt.stopPropagation();
        } else {
            evt.returnValue = false;
            evt.cancelBubble = true;
        }
    },

    bundingEvent:function (num) {

        if(num) {
            window.addEventListener('click', windowBanEvent.Canceling, false);
            window.addEventListener('touchstart', windowBanEvent.Canceling, false);
            window.addEventListener('touchmove', windowBanEvent.Canceling, false);
            window.addEventListener('touchend', windowBanEvent.Canceling, false);
        }
        else{
            window.removeEventListener('click', windowBanEvent.Canceling, false);
            window.removeEventListener('touchstart', windowBanEvent.Canceling, false);
            window.removeEventListener('touchmove',windowBanEvent.Canceling, false);
            window.removeEventListener('touchend', windowBanEvent.Canceling, false);
        }

    }
};


var jfShowTips = {

    //弱提示toast出现的方法
    //谯丹
    //2017.1.17
    toastShow: function (details) {

        var _this = this;

        if(!details){//如果details未输入，则防止报错
            details={};
        }

        var thisText = details.text || 'null';

        var thisInnerHtml = '<span>' + thisText + '</span>';//插入元素的主题内容

        _this.toastRemove();//插入元素前，先删除一次，防止多次添加

        var className='';


        if(browser.os.iOS){//如果当前是IOS系统

            var thisActiveEle=document.activeElement;//当前获取焦点的元素

            if(thisActiveEle.tagName=='INPUT') {//如果当前元素是input

                var thisActiveEleType=thisActiveEle.getAttribute('type');//获取当前元素的type属性

                var inputType=['checkbox','radio','button','image','range','reset','submit','week'];//定义type类型不会发生变化的数组

                if(inputType.indexOf(thisActiveEleType)==-1){//如果当前type类型不存在，则添加Class

                    className='tip_input';
                }

            }

        }

        var thisAddToast = this.addNode('div', thisInnerHtml, 'tip_toast',className);//添加元素

        setTimeout(function () {//延迟2s后，自动删除

            _this.remove(thisAddToast)

        }, 2000);

    },

    //弱提示toast删除的方法
    //谯丹
    //2017.1.17
    toastRemove: function () {

        if (document.getElementById('tip_toast')) {//删除之前，先判断当前元素是否存在

            this.remove(document.getElementById('tip_toast'))

        }

    },


    //loading方法
    //陈羽翔
    //2017.2.3
    loadingShow:function (details) {

        var _this=this;

        if(!details){//为空时初始化数据
            details={};
        }

        windowBanEvent.bundling();//页面禁止事件

        _this.loadingRemove();//先删除页面上loading元素

        var thisText = details.text || 'LOADING..';//初始值

        var overtimeFn= details.overtimeFn || function () {

                _this.toastShow({'text':'等待超时'})

            };

        var thisInnerHtml='<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><i>'+thisText+'</i>';//html内容

        _this.addBlur();

        var thisBg=_this.addBg('loading_bg');

        var thisAddEle=_this.addNode('div',thisInnerHtml,'tip_loading');//增加节点

        document.activeElement.blur();//页面控件失焦

        thisAddEle.focus();//loading元素获得焦点

        setTimeout(function () {

            if(document.getElementById('tip_loading')){

                overtimeFn();

                _this.remove(thisAddEle);//删除该元素

                windowBanEvent.unbundling();//解绑页面禁止事件

                _this.removeBlur();

                _this.transitionEndFn(thisBg,function () {

                    _this.removeBg('loading_bg');

                });

                thisBg.style.opacity='0';

            }

        },30000);//30s后自动删除



    },

    //loading删除方法
    //陈羽翔
    //2017.2.3
    loadingRemove:function () {//卸载loading

        var _this=this;

        if (document.getElementById('tip_loading')) {//删除之前，先判断当前元素是否存在

            windowBanEvent.unbundling();//解绑页面禁止事件

            _this.remove(document.getElementById('tip_loading'))//删除该元素

            _this.removeBlur();

            _this.removeBg('loading_bg');

        }

    },
    //新建元素的方法
    addNode: function (tag, innerHtml, id, className) {

        var obj = document.createElement(tag);

        if (id) {

            obj.id = id;

        }

        if(className){

            obj.className=className

        }

        obj.innerHTML = innerHtml;

        document.body.appendChild(obj);

        return obj;


    },


    //模糊增加方法
    //陈羽翔
    //2017.2.4
    addBlur:function () {
        /*
         var thisEle=this.returnAllBodyChildNode();

         var addClass='';

         if(browser.os.iOS){

         addClass=' body_blur_transition_ios';

         }
         else{

         addClass=' body_blur_transition_other';

         }

         for(var i=0;i<thisEle.length;i++){

         thisEle[i].className+=addClass;
         }
         */
    },

    removeBlur:function () {
        /*
         var addClass='';

         if(browser.os.iOS){

         addClass='body_blur_transition_ios';

         }
         else{

         addClass='body_blur_transition_other';

         }

         var thisEle=document.getElementsByClassName(addClass);

         for(var i=thisEle.length-1;i>=0;i--){

         thisEle[i].className=thisEle[i].className.replace(addClass,'');
         }
         */
    },

    dialogShow:function (details) {

        if(!details){//如果details未输入，则防止报错
            details={};
        }

        var mainText = details.mainText || 'null';

        var minText = details.minText || 'null';

        var hasCheck = details.noCheck|| false;

        var hasCancel = details.noCancel || false;

        var checkFn = details.checkFn || null;

        var checkBtnText=details.checkBtnText ||'确认';

        var cancleBtnText=details.cancleBtnText ||'取消';

        var thisUrl=details.thisUrl||'#';


        var _this=this;

        _this.addBlur();

        var thisBg=_this.addBg('dialog_bg');

        var thisInnerHtml='<div class="text_dialog_container"><div class="text_big">'+mainText+'</div><div class="text_small">'+minText+'</div><div class="dialog_button">';

        if(!hasCheck){
            thisInnerHtml+='<a class="dialog_check" href='+thisUrl+'>'+checkBtnText+'</a>'
        }

        if(!hasCancel){
            thisInnerHtml+='<a class="dialog_cancel" href="#">'+cancleBtnText+'</a>'

        }

        thisInnerHtml+='</div></div>';

        var thisAddDialog = _this.addNode('div', thisInnerHtml, 'tip_dialog');//添加元素

        if(thisAddDialog.getElementsByClassName('dialog_cancel')[0]) {

            thisAddDialog.getElementsByClassName('dialog_cancel')[0].addEventListener('click', _this.dialogRemove.bind(_this), false);

        }

       // thisBg.addEventListener('click',_this.dialogRemove.bind(_this),false);

        if(checkFn) {

            thisAddDialog.getElementsByClassName('dialog_check')[0].addEventListener('click',checkFn,false);

        }


    },

    dialogRemove:function () {

        var _this=this;

        var thisDialogEle= document.getElementById('tip_dialog');

        _this.removeBlur();


       _this.settimeoutFn(function(){

            _this.remove(thisDialogEle);//删除该元素

       })

        thisDialogEle.style.opacity='0';


        var thisBgEle=document.getElementById('dialog_bg');


        _this.settimeoutFn(function(){

            _this.removeBg('dialog_bg');//删除背景
        })


        thisBgEle.style.opacity='0';

    },

    //增加背景
    //陈羽翔
    //2017.2.4
    addBg:function (thisId) {

        var _this=this;

        _this.removeBg();

        return _this.addNode('div','',thisId,'tip_bg');//增加节点

    },

    removeBg:function (thisId) {

        if(document.getElementById(thisId)){

            document.getElementById(thisId).click();

            this.remove(document.getElementById(thisId));

        }

    },

    //自动删除的方法
    remove: function (_element) {

        var _parentElement = _element.parentNode;//找到父元素，然后删除

        if (_parentElement) {

            _parentElement.removeChild(_element);

        }

    },

    //批量增加平滑过渡后监听方法
    transitionEndFn:function (thisEle,myFn) {

        thisEle.addEventListener("webkitTransitionEnd", myFn);

        thisEle.addEventListener("transitionend", myFn);




    },

    settimeoutFn:function(myFn){

        setTimeout(myFn,500);

    }

};


/*丁丁页面通用js*/
/*下拉插件*/
var jfDragDown={
    Eleshow:function(details){

        var _this=this;
        _this.distance = details.distance || '45px';//向下移动的距离

        _this.showFn = details.showFn || 0;//同时出现的函数

        _this.hideFn = details.hideFn || 0;//同时关闭的函数

        _this.hideButton = details.hideButton || 0;//关闭的按钮

        _this.otherHideButton = details.otherHideButton || 0;//其他关闭的按钮

        _this.newDragName = details.newDragName || 0;//如果页面有多个弹出框，防止出现异常

        var $main = document.getElementsByClassName('frame-main')[0];//主体

        var $drag = document.getElementsByClassName('mask_drag')[0];//阴影


        if (_this.newDragName) {//如果当前页面有多个上拉框，则选择器需要的哪个

            var $main = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('frame-main')[0];//主体

            var $drag = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('mask_drag')[0]; //阴影

        }

        if ($main.style.display = "none") {//如果为隐藏，下拉框收起中

             document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动
             document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动

            $drag.style.display = "block";
            $main.style.display = 'block';

            setTimeout(function () {

                $drag.style.opacity = "0.6";
                $main.style.transform = "translate3d(0," + _this.distance + ",0)";//到指定展现位置
                $main.style.webkitTransform = "translate3d(0," + _this.distance + ",0)";

            }, 0);


            if (_this.showFn) {
                _this.showFn(); //执行 弹出时加入的函数参数
            }

        }

        //关闭弹出层

        if($main.getElementsByClassName(_this.otherHideButton)[0]){
            $main.getElementsByClassName(_this.otherHideButton)[0].onclick = function () {
                _this.EleHide()
            };
        }

        $main.getElementsByClassName(_this.hideButton)[0].onclick = function () {
            _this.EleHide()
        };

        $drag.onclick = function () {
            _this.EleHide()
        }
    },
    EleHide: function () {/*隐藏方法*/

        var _this = this;

        var $main = document.getElementsByClassName('frame-main')[0];//主体

        var $drag = document.getElementsByClassName('mask_drag')[0];//阴影

        if (_this.newDragName) {//如果当前页面有多个上拉框，则选择器需要的哪个

            var $main = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('frame-main')[0];//主体

            var $drag = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('mask_drag')[0]; //阴影

        }


        if ($main.style.display = "block") {

            $main.style.transform = "translate3d(0,-100%,0)";//到达平滑过渡开始位置
            $main.style.webkitTransform = "translate3d(0,-100%,0)";

            //阴影透明度变化之后再发生效果
            $drag.style.opacity = "0";


            $drag.addEventListener('webkitTransitionEnd', opacityChange, false);
            $drag.addEventListener('transitionend', opacityChange, false);

              document.getElementsByTagName("body")[0].className = "";//页面可以滚动
              document.getElementsByTagName("html")[0].className = "";//页面可以滚动


            if (_this.hideFn) {
                _this.hideFn(); //执行 关闭时加入的函数参数
            }
        }

        function opacityChange() {

            $drag.style.display = "none";

            $drag.removeEventListener('webkitTransitionEnd', opacityChange, false);
            $drag.removeEventListener('transitionend', opacityChange, false); //取消平滑过渡后的绑定事件

        } //事件解绑


        $main.addEventListener('webkitTransitionEnd', listChange, false);
        $main.addEventListener('transitionend', listChange, false); //主体的过渡事件


        function listChange() {

            $main.style.display = "none";

            $main.removeEventListener('webkitTransitionEnd', listChange, false);
            $main.removeEventListener('transitionend', listChange, false); //事件解绑

        }

    }

}

/*上拉插件*/
var jfDragup = {

    Eleshow: function (details) {/*出现方法*/

        var _this = this;

        _this.distance = details.distance || 0;//向上移动的距离

        _this.showFn = details.showFn || 0;//同时出现的函数

        _this.hideFn = details.hideFn || 0;//同时关闭的函数

        _this.hideButton = details.hideButton || 0;//关闭的按钮

        _this.otherHideButton = details.otherHideButton || 0;//其他关闭的按钮

        _this.newDragName = details.newDragName || 0;//如果页面有多个弹出框，防止出现异常


        var $main = document.getElementsByClassName('frame-main')[0];//主体

        var $drag = document.getElementsByClassName('mask_drag')[0];//阴影


        if (_this.newDragName) {//如果当前页面有多个上拉框，则选择器需要的哪个

            var $main = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('frame-main')[0];//主体

            var $drag = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('mask_drag')[0]; //阴影

        }

        if ($main.style.display = "none") {//如果为隐藏，下拉框收起中

             document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动
             document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动

            $drag.style.display = "block";
            $main.style.display = 'block';

            setTimeout(function () {

                $drag.style.opacity = "0.6";

                $main.style.transform = "translate3d(0," + _this.distance + ",0)";//到指定展现位置
                $main.style.webkitTransform = "translate3d(0," + _this.distance + ",0)";

            }, 0);


            if (_this.showFn) {
                _this.showFn(); //执行 弹出时加入的函数参数
            }

        }

        //关闭弹出层

        if($main.getElementsByClassName(_this.otherHideButton)[0]){
            $main.getElementsByClassName(_this.otherHideButton)[0].onclick = function () {
                _this.EleHide()
            };
        }

        $main.getElementsByClassName(_this.hideButton)[0].onclick = function () {
            _this.EleHide()
        };

        $drag.onclick = function () {
            _this.EleHide()
        }

    },

    EleHide: function () {/*隐藏方法*/

        var _this = this;

        var $main = document.getElementsByClassName('frame-main')[0];//主体

        var $drag = document.getElementsByClassName('mask_drag')[0];//阴影

        if (_this.newDragName) {//如果当前页面有多个上拉框，则选择器需要的哪个

            var $main = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('frame-main')[0];//主体

            var $drag = document.getElementsByClassName(_this.newDragName)[0].getElementsByClassName('mask_drag')[0]; //阴影

        }


        if ($main.style.display = "block") {

            $main.style.transform = "translate3d(0,100%,0)";//到达平滑过渡开始位置
            $main.style.webkitTransform = "translate3d(0,100%,0)";

            //阴影透明度变化之后再发生效果
            $drag.style.opacity = "0";


            $drag.addEventListener('webkitTransitionEnd', opacityChange, false);
            $drag.addEventListener('transitionend', opacityChange, false);

              document.getElementsByTagName("body")[0].className = "";//页面可以滚动
              document.getElementsByTagName("html")[0].className = "";//页面可以滚动


            if (_this.hideFn) {
                _this.hideFn(); //执行 关闭时加入的函数参数
            }
        }

        function opacityChange() {

            $drag.style.display = "none";

            $drag.removeEventListener('webkitTransitionEnd', opacityChange, false);
            $drag.removeEventListener('transitionend', opacityChange, false); //取消平滑过渡后的绑定事件

        } //事件解绑


        $main.addEventListener('webkitTransitionEnd', listChange, false);
        $main.addEventListener('transitionend', listChange, false); //主体的过渡事件


        function listChange() {

            $main.style.display = "none";

            $main.removeEventListener('webkitTransitionEnd', listChange, false);
            $main.removeEventListener('transitionend', listChange, false); //事件解绑

        }

    }


}


/*侧拉页面*/

var jfFrameFlyShow = {

    mainFrameShow: function (details) {/*侧拉出现*/
        var _this = this

        _this.hideButton = details.hideButton || 0;//关闭的按钮

        _this.flyTime = details.flyTime || '0.3s';//侧拉飞入平滑过度时间

        _this.flyEleArea = details.flyEleArea || 0;//侧拉飞入的元素CLASS选择器

        _this.hideFn = details.hideFn || 0;//关闭时发生的事件

        _this.otherHideButton = details.otherHideButton || 0;//其他关闭的按钮


        /*设置飞入元素的显示样式*/

        var  thisFlyArea = document.getElementsByClassName(_this.flyEleArea)[0];//当前飞入的模块

        var  hideButton = thisFlyArea.getElementsByClassName(_this.hideButton)[0];//关闭的元素

        var thisFlyWidth = window.innerWidth;//当前浏览区的宽度

        var thisFlyHeight = window.innerHeight;//当前浏览器的高度


        thisFlyArea.style.display = "block";

        setTimeout(function () {

            thisFlyArea.style.position = "absolute";
            thisFlyArea.style.left = "0";
            thisFlyArea.style.top = "0";
            thisFlyArea.style.width = thisFlyWidth + "px";
            thisFlyArea.style.height = thisFlyHeight + "px";

            thisFlyArea.style.transform = "translate3d(0,0,0)";
            thisFlyArea.style.webkitTransform = "translate3d(0,0,0)";
            thisFlyArea.style.transition = "" + _this.flyTime + " transform";
            thisFlyArea.style.webkitTransition = "" + _this.flyTime + " transform";

        }, 5);

        document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动
        document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动

        //关闭页面
        $(hideButton).bind("click",function(){

            mainFrameHide()
        })


        //其他关闭按钮
        if(_this.otherHideButton){
            var otherHideButton = document.getElementsByClassName(_this.otherHideButton)[0];//关闭的元素
            //关闭页面
            otherHideButton.onclick = function () {

                mainFrameHide()
            }
        }

       //关闭方法（用于侧拉页面里面，还有多个侧拉页面）
        function mainFrameHide(){

            $(hideButton).unbind("click");//关闭的时候，事件解除绑定

            if (_this.hideFn) {
                _this.hideFn(); //执行 关闭时加入的函数参数
            }


            thisFlyArea.addEventListener('webkitTransitionEnd', pageHide, false);
            thisFlyArea.addEventListener('transitionend', pageHide, false); //绑定过渡事件

            thisFlyArea.style.transform = "translate3d(100%,0,0)";
            thisFlyArea.style.webkitTransform = "translate3d(100%,0,0)";


            //页面隐藏（用于侧拉页面里面，还有多个侧拉页面）
            function pageHide() {

                thisFlyArea.style.display = "none";

                thisFlyArea.removeEventListener('webkitTransitionEnd', pageHide, false);
                thisFlyArea.removeEventListener('transitionend', pageHide, false); //解除过渡事件
            }

            setTimeout(function(){


                //针对侧拉页面里面包含侧拉页面，添加收款页面
                var allFirstFlypage=document.getElementsByClassName('getmoney_details_page');

                if(allFirstFlypage){

                    var allstyle="";

                    for(var i=0;i<allFirstFlypage.length;i++){

                        allstyle+=allFirstFlypage[i].style.display;
                    }

                    if(allstyle.indexOf('block')>-1){

                        document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动
                        document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动

                    }else {

                        document.getElementsByTagName("body")[0].className = "";//页面滚动
                        document.getElementsByTagName("html")[0].className = "";//页面滚动

                    }

                }

            },500)



            if (_this.hideFn) {
                _this.hideFn(); //执行 关闭时加入的函数参数
            }

        }

    },
    //用于外面元素点击时，关闭
    mainFrameHide: function () {

        var _this = this;

        var hideButton = document.getElementsByClassName(_this.hideButton)[0];//关闭的元素

        $(hideButton).unbind("click");//关闭的时候，事件解除绑定

        if (_this.hideFn) {
            _this.hideFn(); //执行 关闭时加入的函数参数
        }

        var thisFlyArea = document.getElementsByClassName(_this.flyEleArea)[0];//当前飞入的模块

        thisFlyArea.addEventListener('webkitTransitionEnd', pageHide, false);
        thisFlyArea.addEventListener('transitionend', pageHide, false); //绑定过渡事件

        thisFlyArea.style.transform = "translate3d(100%,0,0)";
        thisFlyArea.style.webkitTransform = "translate3d(100%,0,0)";

        //页面隐藏
        function pageHide() {

            thisFlyArea.style.display = "none";

            thisFlyArea.removeEventListener('webkitTransitionEnd', pageHide, false);
            thisFlyArea.removeEventListener('transitionend', pageHide, false); //解除过渡事件
        }

        setTimeout(function(){

            //针对侧拉页面里面包含侧拉页面，添加收款页面
            var allFirstFlypage=document.getElementsByClassName('getmoney_details_page');

            if(allFirstFlypage){

                var allstyle="";

                for(var i=0;i<allFirstFlypage.length;i++){

                    allstyle+=allFirstFlypage[i].style.display;
                }

                if(allstyle.indexOf('block')>-1){

                    document.getElementsByTagName("body")[0].className = "ovfHiden";//页面禁止滚动
                    document.getElementsByTagName("html")[0].className = "ovfHiden";//页面禁止滚动

                }else {

                    document.getElementsByTagName("body")[0].className = "";//页面滚动
                    document.getElementsByTagName("html")[0].className = "";//页面滚动

                }

            }

        },500)

    }
}


/*搜索框清除内容*/

function searchDeleteText(thisEle) {

    var _thisInput = document.getElementsByClassName('search_input')[0];

    _thisInput.value = "";//清除内容

}



/*选手开票项目*/

function chooselists(chooseEle) {

    var namelists = document.getElementsByClassName(chooseEle)[0].getElementsByTagName('P');

    for (var i = 0; i < namelists.length; i++) {

        namelists[i].addEventListener("click", function () {

            for (var j = 0; j < namelists.length; j++) {

                namelists[j].className = "";
            }

            this.className = "list_choose";

        }, false)
    }
}



/*侧拉单独返回，无弹出*/
function chooseCompanyName(companyNameELe,thisChoosePage) {//参数一是当前需要填写的元素的ID值，参数二是当前侧拉页面的ID选择器

    var checkCompanyName = document.getElementById(thisChoosePage).getElementsByClassName('aui-radio');//当前input标签

    var companyName = document.getElementById(companyNameELe);//当前公司名称的input元素

    function getrightIndex(ThisELe) {


        for (var i = 0; i < checkCompanyName.length; i++) {

            if (checkCompanyName[i].checked == true) {

                return i
            }
        }
    }

    var j = getrightIndex();

    if(document.getElementById('sale_input')&&j>-1&&checkCompanyName[j].getAttribute('data-sale')!=null){//如果当前需要选择销售代表

        document.getElementById('sale_input').value=checkCompanyName[j].getAttribute('data-sale')
    }

    if(j>-1){//当前是否有选中

        //companyName.value = checkCompanyName[j].nextElementSibling.innerText;//获取当前公司的名字

      if(checkCompanyName[j].parentElement.nextElementSibling.firstElementChild.childElementCount>1){

          companyName.value = checkCompanyName[j].parentElement.nextElementSibling.firstElementChild.firstElementChild.innerText;//获取当前公司的名字

      }else {
          companyName.value = checkCompanyName[j].parentElement.nextElementSibling.firstElementChild.innerText;//获取当前公司的名字
      }



    }

}


/*详情页下拉展开*/

function upShowInfo(thisele, showEle, eleAddClass) {//参数一是选择的当前元素，参数二是出现的元素class,参数三是增加的class选择器

    $(showEle).toggleClass(eleAddClass);
    $(thisele).find('.jf_list_down').toggleClass('jf_list_up')

}



//input 获得焦点 placeholder消失
$('input[type="date"]').on("input",function(){


    if($(this).val().length>0)
    {
        $(this).addClass("data_finish");//输入日期不显示placeholder
    }

    else{

        $(this).prop('placeholder',"请输入日期");

        $(this).removeClass("data_finish");//否则显示placeholder

    }
});





/*筛选条件选择*/
$('div.approval_status,div.getmoney_status,div.kaipiao_status,div.welfare_type').find('.sorts_list>div').on("click",function(){

    $(this).siblings('.sorts_selected').removeClass('sorts_selected');

    $(this).addClass('sorts_selected');

})

$('div.frame_drag_down').find('.choose_cancle').on("click",function(){

    var thisChooseALL=$('div.choose_all');

    thisChooseALL.siblings('.sorts_selected').removeClass('sorts_selected');

    thisChooseALL.addClass('sorts_selected');

})


/*select框选择*/
var selectinput=document.getElementsByTagName('select');
for(var i=0;i<selectinput.length;i++){
    selectinput[i].onchange=function(){
        this.style.color="#4d4d4d"
    }
}



/*页面滚动时，自动失去焦点*/
if(browser.os.android){
    document.addEventListener('touchmove', function () {

        var thisActiveEle = document.activeElement;//当前获取焦点的元素

        if (thisActiveEle.tagName == 'INPUT') {//如果当前元素是input

            var thisActiveEleType = thisActiveEle.getAttribute('type');//获取当前元素的type属性

            var inputType = ['checkbox', 'radio', 'button', 'image', 'range', 'reset', 'submit', 'week'];//定义type类型不会发生变化的数组

            if (inputType.indexOf(thisActiveEleType) == -1) {//如果当前type类型不存在，则添加Class


                thisActiveEle.blur();
            }

        }


    }, false)
}



//获取所有的发票抬头相关信息，并导入申请页面
function getInvoiceTilte(ele){

    var thisSelect=$(ele).parents('.cards');

    getRightText('#invoice_tilte',thisSelect.find('.title_text').text());

    getRightText('#identify_number',thisSelect.find('.num').text());

    getRightText('#address',thisSelect.find('.address').text());

    getRightText('#tel',thisSelect.find('.tel').text());

    getRightText('#bank',thisSelect.find('.bankname').text());

    getRightText('#account',thisSelect.find('.account').text());


    function getRightText(ele,text){

        if(text==""||text=="暂无"){

            $(ele).parents('.litter_show').css('display','none')
        }else {
            $(ele).val(text);

            $(ele).parents('.litter_show').css('display','')
        }

    }

}



