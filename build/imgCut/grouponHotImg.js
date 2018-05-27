/**
 * Created by wangliang3 on 2014/10/24.
 */

var HotImg = {
    map :  new DataUtil.Map(),        //mane : url
    hw  :  new DataUtil.Map(),        //图片尺寸
    data : new DataUtil.Map(),        //图标信息
    warning : '链接或文案未填写!',
    massage : '链接地址必须是1号店域名下的地址',
    message_txt : '图片描述为必填项！',
    validata : ['yhd','yihaodian'],
    type : '',
    action_type_link : 1,
    action_type_text : 2
};

$(function(){

    if(imgCutUtil.url == '' || imgCutUtil.url == 'err'){
        $('#copy,#dele,#grp_edit_item').hide();
    };

    //初始化提示信息
    $('#dele').tooltip({
        position: 'bottom',
        content: '<span style="color:#000">删除图片信息</span>',
        onShow: function(){
            $(this).tooltip('tip').css({
                backgroundColor: '#F7FBFB',
                borderColor: '#FF0000'
            });
        }
    });

    //图片描述提示信息
    $('#message_txt').tooltip({
        position: 'bottom',
        content: '<span style="color:#000">' + HotImg.message_txt + '</span>',
        onShow: function(){
            $(this).tooltip('tip').css({
                backgroundColor: '#F7FBFB',
                borderColor: '#FF0000'
            });
        }
    });

    //初始化提示信息
    $('#click_link_text').tooltip({
        position: 'bottom',
        content: '<span style="color:#000">' + HotImg.massage + '</span>',
        onShow: function(){
            $(this).tooltip('tip').css({
                backgroundColor: '#F7FBFB',
                borderColor: '#FF0000'
            });
        }
    });

    //预览
    $('#click_link').textbox({
        onClickButton:function(){
            var click_link = $('#click_link').textbox('getValue');
            if(HotImg.check(click_link)){
                FormUtil.OpenfullScreenWindow(click_link, '预览');
            }else{
                $('#click_link_text').tooltip('show');
            }
            //console.log($('#click_link').textbox('getValue'));
        }
    });

    //tab切换
    $('#easyui_tabs').tabs({
        onSelect:function(title, index){
           if(index != 0){
               $('#click_link_text').tooltip('hide');
           }
        }
    });


    $('#easyui_window').window({
        onClose:function(){
            $('#click_link_text').tooltip('hide');
        }
    });

    HotImg.initSelectData();

    HotImg.initTooltip();
});

/**
 * 图片加载水平，垂直居中
 */
HotImg.initImgHw = function(url){
    var obj =  $("#img_id");

    if(HotImg.hw.containsKey(url)){
        var hw = HotImg.hw.get(url);
        HotImg.initImage(hw);
    }else{
        var newImg = new Image();
        if(url){
            newImg.src = url;
        }else{
            newImg.src = obj.attr('src');
        };
        newImg.onload = function (){
            var hw = {
                width  : newImg.width,
                height : newImg.height
            };

            HotImg.initImage(hw);
            //console.log(hw.width + ' : ' + hw.height);
        };
    };

    HotImg.initImage =  function(hw){
        var pbj = obj.parent().parent(),
            pw = pbj.width(),
            ph = pbj.height(),
            w = hw.width,
            h = hw.height
            pbj = obj.parent();

        //console.log(pw + ' : ' + ph + ' : ' + w + ' : ' + h);
        if(pw < w){
            obj.css('width','100%');
            var ah = h/(w/pw);
                top = (ph - ah)/ 2,
                padding = top + 'px 0 0 0';
            pbj.css('padding', padding);
        }else{
            obj.css('width','');
            pbj.css('padding', '');
        };;

        if(ph < h){
            obj.css('height','100%');
            var ah = h/(w/pw);
            top = (ph - ah)/ 2,
                padding = top + 'px 0 0 0';
            pbj.css('padding', padding);
        }else{
            obj.css('height','');
            pbj.css('padding', '');
        };

        if(pw > w && ph > h){
            var top = (ph - h)/ 2,
                right = (pw - w)/ 2,
                padding = top + 'px 0 0 0';
            pbj.css('padding', padding);
        }
    };

};
/**
 * 初始化select
 */
HotImg.initSelect = function(id){ //
    if(HotImg.data.containsKey('resp_data')) {
        var data = HotImg.data.get('resp_data');
        var name = data[0].name;

        if (!id) {
            id = data[0].id;
        };

        var obj = {'id': 'hover_img_select', 'width': 340, 'height': 150, 'editable': true, 'data': data, 'value': id };

        $.each(data, function (i, item) {
            if (item.id == id) {
                $("#img_id").attr('src', id);
                name = item.name;
            };
        });

        HotImg.initSelectImgCut(obj);

        $('#hover_img_select').combobox('setValue', name);

        HotImg.initImgHw(id);
    }
};
/**
 * 初始化selec data
 */
HotImg.initSelectData = function() {
    var url = imgCutUtil.base + '/grouponImgHotCut/ajaxGetImgHover.action';
    var param = {'key' : 'groupon.img.hot.cut', 'T' : DateUtil.getTimestamp()};
    HotImg.getAjaxDatas(url, param, function (resp) {
        if(resp == "timeout"){
            console.log('HotImg.initSelectData 加载失败⊙﹏⊙!!!');
            return;
        }
        var rs = resp.data?resp.data[0].value:'',
            arrs = [];
        if(rs._contains(';')){
           var  data = resp.data[0].value.split(';');
            $.each(data, function(i,item){
                var arr = item.split(',');
                HotImg.map.put(arr[1], arr[0]);
                arrs.push({id : arr[0], name:arr[1]});
            });
        }else{
            var arr = rs.split(',');
            HotImg.map.put(arr[1], arr[0]);
            arrs.push({id : arr[0], name:arr[1]});
        }

        $('#img_id').attr('src' , arrs[0].id);

        HotImg.data.put('resp_data', arrs);

    });
};

HotImg.initSelectImgCut = function(obj){
    var combobox_panel = $('#' + obj.id);
    combobox_panel.combobox({
        width:obj.width,
        panelHeight:obj.height,
        valueField:'id',
        textField:'name',
        editable:false,
        value:obj.value,
        data:obj.data,
        onSelect:function(data){
            //设置input值，方便form serialize值
            $('#' + obj.id).val(data.id);
        }
    });

//    combobox_panel.combobox('textbox').bind({
//        mouseover : function(){ combobox_panel.combobox('showPanel')},
//        mouseout : function(){ }
//    });

    //绑定mouseover
    $('.combobox-item').each(function(){
        $(this).bind('mouseover', function(event){
            var url = HotImg.map.get(event.target.textContent);
            $('#img_id').attr('src' , url);
            HotImg.initImgHw(url);
            //console.log(HotImg.map.get(event.target.textContent));
        });
    });
};

/**
 * 保存设置并关闭窗口
 */
HotImg.comboxok = function(){
    var iframe = document.getElementById('hotImgCutIframe'),
        key = $('#hover_img_select').combobox('getText'),
        obj = {
            action_type   : 0,
            hover_img     : HotImg.map.get(key),
            hover_message : $('#hover_message').val(),
            click_message : $('#click_message').val(),
            click_link    : $('#click_link').val()
        },
        bool = obj.hover_message.isNull() && obj.click_message.isNull();

    if(bool && obj.click_link.isNull()){
        $.messager.alert('提醒', HotImg.warning, 'warning');
        return;
    }

    if(HotImg.check(obj.click_link)){
        obj.action_type = HotImg.action_type_link;
        iframe.contentWindow.HotImgCut.setValsave(obj);
        HotImg.closeWindow();
        if(HotImg.selected_area){
            HotImg.selected_area.removeMsg();
        }
    }else{
        if(!obj.hover_message.isNull() && !obj.click_message.isNull()){
            if(obj.click_link.isNull()){
                obj.action_type = HotImg.action_type_text;
                iframe.contentWindow.HotImgCut.setValsave(obj);
                HotImg.closeWindow();
                if(HotImg.selected_area){
                    HotImg.selected_area.removeMsg();
                }
            }else if(!HotImg.check(obj.click_link)){
                $("#easyui_tabs").tabs("select", 0);
                $('#click_link_text').tooltip('show');
            }
        }else{
            $("#easyui_tabs").tabs("select", 0);
            $('#click_link_text').tooltip('show');
        }
    };

    iframe.contentWindow.HotImgCut.onDocumentKeyDown();
};

/**
 * 保存校验
 * @param obj
 */
HotImg.check = function(click_link){
    for(var i = 0 ; i < HotImg.validata.length ;i++){
        if(click_link._contains(HotImg.validata[i])){
            return true;
        }
    }
    return false;
};

/**
 * 打开编辑框
 */
HotImg.openWindow = function(){
    $('#easyui_window').window('open');
    document.getElementById('hotImgCutIframe').contentWindow.HotImgCut.hideEditDetails();
};
/**
 * 关闭编辑框
 */
HotImg.closeWindow = function() {
    $('#easyui_window').window('close');
    $('#click_link_text').tooltip('hide');
};
/**
 * 双击设置
 */
HotImg.onAreaDblClick = function(json, selected_area){
    HotImg.selected_area = selected_area;
    $('#hover_message').textbox('setValue', json.hover_message);
    $('#click_message').textbox('setValue', json.click_message);
    $('#click_link').textbox('setValue', json.click_link);

    HotImg.initSelect(json.hover_img);

};

/**
 * 初始化提示信息
 */
HotImg.initTooltip = function(){
    var obj = $('#linkbutton_paste');

    obj.tooltip({
        content: $('#easyui_panel'),
        showEvent: 'click',
        onShow: function(){
            var t = $(this);
            t.tooltip('tip').unbind().bind('mouseenter', function(){
                t.tooltip('show');
            }).bind('mouseleave', function(){
                t.tooltip('hide');
            });
        }
    });

    obj.tooltip('show').tooltip('hide');

    $('#img_link_div').tooltip({
        position: 'bottom',
        content: '<span style="color:#000">' + HotImg.massage + '</span>',
        onShow: function(){
            $(this).tooltip('tip').css({
                backgroundColor: '#F7FBFB',
                borderColor: '#FF0000'
            });
        }
    });
};

HotImg.saveTooltip = function(){
    var url = $('#img_link').textbox('getValue');
    if(HotImg.check(url)){
        $('#add_txt').html(url);
        $('#img_link_div').tooltip('hide');
        $('#linkbutton_paste').tooltip('hide');
        HotImg.loadImageFromFo(url);
        $('#copy,#dele,#grp_edit_item').show();
    }else{
        $('#img_link_div').tooltip('show');
    };
};

/**
 * 加载
 * @param url
 */
HotImg.loadImageFromFo = function(url){
    document.getElementById('hotImgCutIframe').contentWindow.HotImgCut.loadImageFromFo(url);
};

/**
 * 删除图片
 */
HotImg.ajaxDeleImgInfo = function(){
    $.messager.confirm('删除图片', '是否要删除图片信息?', function(r){
        if (r){
            var url = imgCutUtil.base + '/grouponImgHotCut/ajaxDeleImgInfo.action';
            var param = {'url' : $('#add_txt').html()};
            HotImg.getAjaxDatas(url, param, function (resp) {
                if(resp == "timeout"){
                    FormUtil.toast('图片删除失败 ⊙﹏⊙!!! ');
                    console.log('HotImg.ajaxDeleImgInfo 图片删除失败 ： ' + param.url );
                    return;
                }else if(resp == 'success'|| resp.responseText == 'success'){
                    $('#message_txt').val('');
                    FormUtil.toast('图片已删除!! ');
                    $('#add_txt').html('');
                    imgCutUtil.url = '';
                    HotImg.loadImageFromFo('');
                    $('#copy,#dele,#grp_edit_item').hide();
                }
            });
        }
    });

};

HotImg.click_link_text_Show = function(){
		$('#message_txt').tooltip('show');
};

HotImg.getAjaxDatas = function (url,data,callBack){
    $.ajax(
        {
            type : "get",
            url:url,
            data:data,
            dataType : "json",
            timeout: 15000,
            beforeSend : FormUtil.progressStart('正在删除数据....'),
            error : function(result) {
                FormUtil.progressClose();
                callBack(result);
            },
            success:function(result){
                try{
                    FormUtil.progressClose();
                    callBack(result);
                }catch(e){
                    FormUtil.toast('访问服务器异常 ⊙﹏⊙!!',1500);
                }
            },
            complete:function(e,t){
                FormUtil.progressClose();
                if(t && t == "timeout"){
                    FormUtil.toast('访问服务器超时，网络服务不给力⊙﹏⊙!!',1500);
                    callBack(t);
                }
            }
        }
    )
};

/************************
 *   上传图片
 **********************/

function addPicture(ref,imageInfoCode){
    $('#easyui_dialog_upload').dialog('open');
}

function setPictureParameter(pictureId,pictureOriginalPath,msgFlg) {
    if(!msgFlg || msgFlg==0){
        HotImg.loadImageFromFo(pictureOriginalPath);
        $('#add_txt').html(pictureOriginalPath);
        $('#easyui_dialog_upload').dialog('close');
        $('#copy,#dele,#grp_edit_item').show();
        $('#message_txt').val('');
    }else{
        var msgStr="";
        if(msgFlg==1){
            msgStr="名字超长";
        }else if(msgFlg==2){
            msgStr="后缀错误";
        }else if(msgFlg==3){
            msgStr="文件太大";
        }else if(msgFlg==4){
            msgStr="文件像素宽度不符合要求";
        }else if(msgFlg==5){
            msgStr="文件像素高度不符合要求";
        }else if(msgFlg==6){
            msgStr="文件服务器错误";
        }else{
            msgStr="未知错误";
        }
        alert(msgStr);
    }
}
