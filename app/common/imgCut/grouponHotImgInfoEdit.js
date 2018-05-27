/**
 * Created by wangliang3 on 2014/10/15.
 * 打点切图
 */
var HotImgInfo = {};

(function(win){
    var arr = ['Trim', 'isNull'];
    for(var i = 0; i < arr.length ;i++){
        if(String.prototype.hasOwnProperty(arr[i])){
            win.console.error('Utils.js ：String 对象已含有' + arr[i] + '  属性, 使用请重载，以免冲突 ');
        }
    };
})(window);

//去空格
String.prototype.Trim = function() {
    if(this != null && typeof(this) != 'undefined' && this.length > 0) {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
};
//功能:判断元素的值是否为空
String.prototype.isNull = function() {
    return (this == null || this.Trim() == '' || typeof(this) == 'undefined' || this.length == 0);
};

HotImgInfo.gotoHotImgCut =  function (base){
    var url = $('#imageUrlShow').val();
    if(url.isNull()){
        $.messager.alert('提醒', '没有图片不能编辑！', 'warning');
    }else{
        url = base + '/grouponImgHotCut/initgrouponImgHotCut.action?url=' + url;
        this.OpenfullScreenWindow(url, '聚类热区设置');
    }
};

HotImgInfo.OpenfullScreenWindow = function(url,title){
    newwindow = window.open("",title,"fullscreen=1,location=0");
    if (document.all){
        newwindow.moveTo(0,0)
        newwindow.resizeTo(screen.width,screen.height);
    }
    newwindow.location = url + '&actionMethod=fullScreen';
};