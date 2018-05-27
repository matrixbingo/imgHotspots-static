/**
 * Created by wangliang on 2018/5/15.
 * 打点切图
 */

/**
 * 当前Js命名空间
 * @type {{}}
 */
var HotImgCut = {
    type: null,    // rect circle polygon
    version: 1,     // 1:使用数据库 0:使用本地
    num: 0,
    warning: '信息不全'
};

$(function () {
    HotImgCut.imageMap = new SummerHtmlImageMapCreator();
    var url = window.parent.imgCutUtil ? window.parent.imgCutUtil.url : "http://img4.imgtn.bdimg.com/it/u=1115476906,614857416&fm=27&gp=0.jpg";
    HotImgCut.base = window.parent.imgCutUtil ? window.parent.imgCutUtil.base : "http://localhost:63342";

    //隐藏不需要的按钮
    var ids = 'new_image,from_html,hotimg_p1,hotimg_p2,hotimg_p3,to_html,load,save,action_type,preview,edit,edit_details';
    FormUtil.setAbles(ids, 'hide');

    $('#test1').bind('click', function () {
        HotImgCut.loadFromLocalStorage(HotImgCut.imageMap);
    });

    $('#test2').bind('click', function () {
        HotImgCut.saveInLocalStorage(HotImgCut.imageMap);
    });

    HotImgCut.initTooltip();

    $('#button').hide();

    if (url == '' || url == 'undefined' || url == 'err') {
        return;
    } else {
        HotImgCut.url = url;
        HotImgCut.imageMap.app.loadImage(url).setFilename(url);
        HotImgCut.loadFromLocalStorage(HotImgCut.imageMap);
    }
    ;

//    $('#save_details_text').bind('click',function(){
//        HotImgCut.infoSave();
//    });

    //添加监听
    //FormUtil.setValByRadio('imgCut_action_type', 'action_type');


});

/**
 * 父类调用
 */
HotImgCut.loadImageFromFo = function (url) {
    HotImgCut.url = url;
    HotImgCut.imageMap.app.loadImage(url).setFilename(url);
    HotImgCut.loadFromLocalStorage(HotImgCut.imageMap);
    if (url == '') {
        $('#image').removeAttr('style');
    }
};

/**
 * 保存数据
 */
HotImgCut.infoSave = function () {
    if (HotImgCut.imageMap) {
        HotImgCut.imageMap.info.save();
    }
};

/**
 * 设置数据并保存
 */
HotImgCut.setValsave = function (obj) {
    var json = {
        'action_type': obj.action_type,
        'hover_img': obj.hover_img,
        'hover_message': obj.hover_message,
        'click_message': obj.click_message,
        'click_link': obj.click_link
    };

    for (var id in json) {
        //console.log(id + ' : ' + json[id]);
        $('#' + id).val(json[id]);

    }

    HotImgCut.infoSave();
};

HotImgCut.onDocumentKeyDown = function () {
    if (HotImgCut.imageMap) {
        //HotImgCut.imageMap.app.onEditButtonClick(null);
        document.addEventListener('keydown', HotImgCut.imageMap.app.onDocumentKeyDown, false);
    }
};

/**
 * 出事提示信息
 */
HotImgCut.initTooltip = function () {
    //初始化提示信息
    $('#clear').tooltip({
        position: 'bottom',
        content: '<span style="color:#000">清空全部热区</span>',
        onShow: function () {
            $(this).tooltip('tip').css({
                backgroundColor: '#F7FBFB',
                borderColor: '#FF0000'
            });
        }
    });
};
/**
 * 双击事件
 */
HotImgCut.onAreaDblClick = function (selected_area) {

    var json = {
        'hover_img': $('#hover_img').val(),
        'hover_message': $('#hover_message').val(),
        'click_message': $('#click_message').val(),
        'click_link': $('#click_link').val()
    };

    window.parent.HotImg.onAreaDblClick(json, selected_area);

    $('#edit_details').hide();
    window.parent.HotImg.openWindow();
};


/**
 * 初始化图片信息
 */
HotImgCut.initImgInfo = function (imageMap, url) {
    var newImg = new Image();
    if (url) {
        newImg.src = url;
    } else {
        newImg.src = $("#img").attr('src');
    }
    newImg.onload = function () {
        var wh = {
            width: newImg.width,
            height: newImg.height
        };
        document.getElementById('img_num').innerHTML = '图片大小: ' + wh.height + ' x ' + wh.width + '';
    }

    if (HotImgCut.version == 1) {
        document.getElementById('img_cut').innerHTML = '热区个数 : ' + HotImgCut.num;
    } else {
        document.getElementById('img_cut').innerHTML = '热区个数 : ' + imageMap.app.getObjects.length;
    }
};

/**
 * 取打点数据
 */
HotImgCut.loadFromLocalStorage = function (imageMap) {
    if (!imageMap) {
        return;
    }
    imageMap.app.onClearButtonClick(null);
    var str = '';
    if (HotImgCut.version == 1) {
        HotImgCut.ajaxGetNewImgCut(HotImgCut.url, imageMap);
        //set editor
        var objs = HotImgCut.imageMap.app.getObjects();
        if (objs && objs.length > 0) {
            HotImgCut.imageMap.app.onEditButtonClick();
        }
    } else {
        str = window.localStorage.getItem('SummerHTMLImageMapCreator');
        var obj = JSON.parse(str);
        HotImgCut.loadFromLocalStorageSun(imageMap, obj);
    }
    imageMap.app.onEditButtonClick(null);
    $('#image_wrapper').bind('keydown', HotImgCut.imageMap.app.onDocumentKeyDown);
};

HotImgCut.loadFromLocalStorageSun = function (imageMap, obj) {
    console.log(JSON.stringify(obj));
    var areas = obj.areas;
    imageMap.app.loadImage(obj.img);

    imageMap.utils.foreach(areas, function (x) {
        switch (x.type) {
            case 'rect':
                if (x.coords.length === 4) {
                    imageMap.Rect.createFromSaved({
                        coords: x.coords,
//                         href   : x.href,
//                         alt    : x.alt,
//                         title  : x.title,
                        action_type: x.action_type,
                        hover_message: x.hover_message,
                        hover_img: x.hover_img,
                        click_message: x.click_message,
                        click_link: x.click_link
                    });
                }
                break;

            case 'circle':
                if (x.coords.length === 3) {
                    imageMap.Circle.createFromSaved({
                        coords: x.coords,
//                         href   : x.href,
//                         alt    : x.alt,
//                         title  : x.title,
                        action_type: x.action_type,
                        hover_message: x.hover_message,
                        hover_img: x.hover_img,
                        click_message: x.click_message,
                        click_link: x.click_link
                    });
                }
                break;

            case 'polygon':
                if (x.coords.length >= 6 && x.coords.length % 2 === 0) {
                    imageMap.Polygon.createFromSaved({
                        coords: x.coords,
//                         href   : x.href,
//                         alt    : x.alt,
//                         title  : x.title,
                        action_type: x.action_type,
                        hover_message: x.hover_message,
                        hover_img: x.hover_img,
                        click_message: x.click_message,
                        click_link: x.click_link
                    });
                }
                break;
        }
    });

    return this;
}

/**
 * 存储打点数据
 */
HotImgCut.saveInLocalStorage = function (imageMap) {

    /*
     var val = FormUtil.$parent('#message_txt').val();
     if (val.isNull()) {
     FormUtil.$parent('#property_id').css('display', 'block');
     window.parent.HotImg.click_link_text_Show();
     ;
     FormUtil.toast(window.parent.HotImg.message_txt);
     return;
     }
     */

    var obj = {
        areas: [],
        img: imageMap.app.getImg_src()
    };

    imageMap.utils.foreach(imageMap.app.getObjects(), function (x) {
        obj.areas.push(x.toJSON());
    });

    var json = JSON.stringify(obj);

    if (HotImgCut.version == 1) {
        HotImgCut.ajaxSaveNewImgCut(obj);
    } else {
        window.localStorage.setItem('SummerHTMLImageMapCreator', json);
    }
    ;

    console.log(json);
    return this;
};

/**
 * 替换热区类型 1、矩形 2、圆形 3、多边形'
 * @param obj
 */
HotImgCut.replace = function (json) {
    var objs = []
    $(json).each(function (i, item) {
        var obj = {};
        switch (item.type) {
            case 'way':
                obj.type = 0;
                break;
            case 'rect':
                obj.type = 1;
                break;
            case 'polygon':
                obj.type = 2;
                break;
            case 'circle':
                obj.type = 3;
                break;
        }
        obj.points = [];
        var xy = {}
        window.console.log(item.coords)
        for (var i = 0; i < item.coords.length; i++) {
            if (i % 2 === 0) {
                i !== 0 && obj.points.push(xy);
                xy = {}
            } else {
                if (i > 0) {
                    xy[item.coords[i - 1]] = item.coords[i];
                }
            }
        }
        objs.push(obj);
    });
    return objs;
};

/**
 * 还原替换热区类型 1、矩形 2、圆形 3、多边形'
 * @param obj
 */
HotImgCut.refresh = function (json) {
    $(json).each(function (i, item) {
        switch (item.type) {
            case 1:
                item.type = 'rect';
                break;
            case 2:
                item.type = 'circle';
                break;
            case 3:
                item.type = 'polygon';
                break;

        }
        ;
        var arr = item.coords.split(',');
        var coords = [];
        for (var i = 0; i < arr.length; i++) {
            coords.push(parseInt(arr[i]));
        }
        item.coords = coords;
        item.href = '';
        item.alt = '';
        item.title = '';
    });
    return json;
};

/**
 * 加载数据
 */
HotImgCut.ajaxGetNewImgCut = function (url, imageMap) {
    var url = HotImgCut.base + '/grouponImgHotCut/ajaxGetNewImgCut.action';
    var param = {'url': HotImgCut.url};
    HotImgCut.initImgInfo(imageMap, HotImgCut.url);
    HotImgCut.getAjaxDatas(url, param, function (resp) {
        if (resp == null || resp == 'null') {
            return;
        } else if (resp == "timeout" || resp.data == 'undefined') {
            FormUtil.toast('加载失败⊙﹏⊙!!!');
            return;
        } else if (resp != null && resp != 'null' && resp.data != 'undefined') {   //新建
            var data = resp.data[0];

            FormUtil.$parent('#message_txt').val(data.message);
            var areas = HotImgCut.refresh(data.list);

            var obj = {'areas': areas, 'img': data.url};

            HotImgCut.num = areas.length;
            HotImgCut.loadFromLocalStorageSun(imageMap, obj);
        }

    });

};
/**
 * 保存校验
 * @param areas
 * @returns {boolean}
 */
HotImgCut.checkareas = function (areas) {
    var bool = true;
    if (areas.length == 0) {
        bool = false;
        FormUtil.toast('未设置热区!');
        return;
    }
    /*    for(var j = 0; j < areas.length; j++){
     var click_link = areas[j].click_link,
     hover_message   = areas[j].hover_message,
     hover_img       = areas[j].hover_img,
     click_message   = areas[j].click_message;

     var bool = false;
     for(var i = 0 ; i < window.parent.HotImg.validata.length ; i++){
     if((!hover_message.isNull() && !click_message.isNull()) || (!click_link.isNull() && !hover_img.isNull()) ){
     bool = true;
     continue;
     }
     if( (hover_message.isNull() && click_message.isNull()) && (!click_link.isNull() && !hover_img.isNull()) ){
     if(click_link._contains(window.parent.HotImg.validata[i])){
     bool = true;
     }else{
     bool = false;
     };
     continue;
     }
     }

     if(!bool){
     FormUtil.toast(window.parent.HotImg.warning + '!!', 1500);
     };
     };*/

    var objs = HotImgCut.imageMap.app.getObjects();
    /*if (objs && objs.length > 0) {
     for (var i = 0; i < objs.length; i++) {
     var item = objs[i];
     this.checkObjs(item);
     }
     }*/

    return bool;
};

HotImgCut.checkObjs = function (obj) {

    this.checkAllText = function (obj) {
        if ((!obj.hover_message.isNull() && !obj.click_message.isNull()) || (!obj.click_link.isNull() && !obj.hover_img.isNull())) {
            return false;
        } else {
            return true;
        }
    };

    this.getParams = function (x, y) {
        var zindex = 1000;
        var css = {
            position: 'absolute',
            'font-size': '10px',
            top: y,
            left: x,
            width: '54px',
            height: '15px',
            padding: '5px',
            'background-color': '#EFEA0F',
            'text-align': 'center',
            'vertical-align': 'middle',
            display: 'table-cell',
            color: 'red',
            'z-index': zindex
        };

        var params = {css: css, text: HotImgCut.warning};
        return params;

    };

    var params = {
        action_type: obj.action_type,
        hover_message: obj.hover_message,
        hover_img: obj.hover_img,
        click_message: obj.click_message,
        click_link: obj.click_link
    };

    switch (obj.type) {
        case 'rect':
            if (this.checkAllText(params)) {
                var img = document.getElementById('img'),
                    h = HotImgCut.imageMap.app.getOffset('y') + obj.params.height / 2 - 15,
                    w = HotImgCut.imageMap.app.getOffset('x') + obj.params.width / 2 - 35,
                    params = this.getParams(obj.params.x + w + 3, obj.params.y + h + 3);

                if (!obj.msg) {
                    obj.addMsg(new FormUtil.toollip(params).create());
                }
                ;
            } else {
                obj.removeMsg();
            }
            ;
            break;

        case 'circle':
            if (this.checkAllText(params)) {
                var img = document.getElementById('img'),
                    h = HotImgCut.imageMap.app.getOffset('y') - 12,
                    w = HotImgCut.imageMap.app.getOffset('x') - 31,

                    params = this.getParams(obj.params.cx + w, obj.params.cy + h);

                if (!obj.msg) {
                    obj.addMsg(new FormUtil.toollip(params).create());
                }
                ;
            } else {
                obj.removeMsg();
            }
            ;
            break;

        case 'polygon':
            if (this.checkAllText(params)) {
                var img = document.getElementById('img'),
                    h = HotImgCut.imageMap.app.getOffset('y'),
                    w = HotImgCut.imageMap.app.getOffset('x'),

                    params = this.getParams(obj.params[0] + w, obj.params[1] + h);

                if (!obj.msg) {
                    obj.addMsg(new FormUtil.toollip(params).create());
                }
                ;
            } else {
                obj.removeMsg();
            }
            ;
            break;
    }
    ;

    //FormUtil.toollip.fadeOut(15000);

};
/**
 * 异步保存打点切图
 */
HotImgCut.ajaxSaveNewImgCut = function (obj) {
    var url = HotImgCut.base + '/grouponImgHotCut/ajaxSaveNewImgCut.action';
    var wh = FormUtil.getImgWH('img').wh;
    var message = $('#message_txt', parent.document).val();
    if (!HotImgCut.checkareas(obj.areas)) {
        return;
    }
    var areas = JSON.stringify(HotImgCut.replace(obj.areas));
    var grouponImgHotCuts = areas.Trim().removeBinEnd();
    console.log('grouponImgHotCuts : ' + grouponImgHotCuts);
    var param = {
        'grouponImgHot.url': HotImgCut.url,
        'grouponImgHot.height': wh.height,
        'grouponImgHot.width': wh.width,
        'grouponImgHot.message': DataUtil.encodeURI(message),
        'grouponImgHotCuts': grouponImgHotCuts
    };

    HotImgCut.getAjaxDatas(url, param, function (resp) {
        if (resp == "timeout") {
            console.log('异常 url : ' + url);
            FormUtil.toast('保存失败⊙﹏⊙!!!');
            return;
        } else if (resp == 'success') {
            FormUtil.toast('保存成功!');
        }

    });

};

/**
 * 隐藏热区设置
 */
HotImgCut.hideEditDetails = function () {
    $('#edit_details').hide();
};

HotImgCut.getAjaxDatas = function (url, data, callBack) {
    $.ajax(
        {
            type: "get",
            url: url,
            data: data,
            dataType: "json",
            timeout: 15000,
            beforeSend: window.parent.progressStart(),
            error: function (result) {
                console.log('result ----> : ' + result);
                window.parent.progressClose();
                if (result.responseText == 'success') {
                    FormUtil.toast('保存成功!!', 1500);
                } else {
                    FormUtil.toast('加载异常，网络服务不给力⊙﹏⊙!!!', 1500);
                }
            },
            success: function (result) {
                try {
                    window.parent.progressClose();
                    callBack(result);
                } catch (e) {
                    console.log('加载数据异常 ⊙﹏⊙!!' + url);
                    FormUtil.toast('加载数据异常 ⊙﹏⊙!!', 1500);
                }
            },
            complete: function (e, t) {
                window.parent.progressClose();
                if (t && t == "timeout") {
                    FormUtil.toast('加载超时，网络服务不给力⊙﹏⊙!!', 1500);
                    callBack(t);
                }
            }
        }
    )
}


