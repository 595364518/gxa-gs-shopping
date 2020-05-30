$(function () {
    var id;
    var page=1;
    var dep=[];
    var pos=[];

    /*通过名称查id*/
    function name2id(type,name){

        for(var i=0;i<type.length;i++){
            if(type==dep){
                if(name==dep[i].bumenmingcheng){
                    return dep[i].id
                }
            }else{
                if(name==pos[i].zhiweimingcheng){
                    return pos[i].id
                }
            }
        }
    }
    function id2name(type,id){

        for(var i=0;i<type.length;i++){
            if(type==dep){
                if(id==dep[i].id){
                    return dep[i].bumenmingcheng
                }
            }else{
                if(id==pos[i].id){
                    return pos[i].zhiweimingcheng
                }
            }
        }
    }

    /*获取所有的部门和职位*/
    $.ajax({
        url: '/bumen/chaXunBuMenAndZhiWei',
        success:function (res) {
            if(res.code==200){
                dep=res.buMenList;
                pos=res.zhiWeiList;

                for(var i=0;i<res.buMenList.length;i++){
                    $('.selDep').append(`
                        <option value="${res.buMenList[i].id}">${res.buMenList[i].bumenmingcheng}</option>
                    `)
                }

                for(var i=0;i<res.zhiWeiList.length;i++){
                    $('.selPos').append(`
                        <option value="${res.zhiWeiList[i].id}">${res.zhiWeiList[i].zhiweimingcheng}</option>
                    `)
                }

                /*页面一加载调用数据*/
                getCon();
            }
        }
    });
    /*用户添加*/
    $('.addBtn').click(function () {
        $.ajax({
            url:'/api/yonghu/xinZeng',
            data:JSON.stringify({
                "lianxifangshi": $('#userTel').val(),
                "nianling": $('#userAge').val(),
                "suoshubumen": $('#userDep').val(),
                "suoshuzhiwei": $('#userPos').val(),
                "xingbie": $('.userSex:checked').val(),
                "xingming": $('#userName').val(),
                "zhanghao": $('#userUser').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {
                console.log(res);
                getCon();
                $('#myModal').modal('hide')
            }
        })
    });

    /*删除打开的时候*/
    $('#myModal2').on('show.bs.modal', function (e) {
        id=$(e.relatedTarget).parent().parent().attr('data-id');
        $('#delName').text($(e.relatedTarget).parent().siblings('.userName').text());
    });
    /*确定删除的时候*/
    $('.delBtn').click(function () {
        $.ajax({
            url:'/api/yonghu/shanChuById',
            data:{
                "id": id
            },
            type:'post',
            success:function (res) {
                if(res.code==200){
                    getCon();
                    $('#myModal2').modal('hide')
                }
            }
        })
    });
    /*编辑职位打开的时候*/
    $('#myModal1').on('show.bs.modal', function (e) {
        id=$(e.relatedTarget).parent().parent().attr('data-id');

        $('#userUser2').val($(e.relatedTarget).parent().siblings('.userUser').text());

        $('#userName2').val($(e.relatedTarget).parent().siblings('.userName').text());

        $('#userAge2').val($(e.relatedTarget).parent().siblings('.userAge').text());

        $('#userTel2').val($(e.relatedTarget).parent().siblings('.userTel').text());

        if($(e.relatedTarget).parent().siblings('.userSexList').text()=='男'){
            $('#userSexNan2').attr('checked','checked');
        }else{
            $('#userSexNv2').attr('checked','checked');
        }

        $('#userDep2').val(name2id(dep,$(e.relatedTarget).parent().siblings('.userDep').text()));

        $('#userPos2').val(name2id(pos,$(e.relatedTarget).parent().siblings('.userPos').text()));

    });
    /*修改保存的时候*/
    $('.editBtn').click(function () {
        console.log(id2name(pos,$('#userPos2').val()));
        console.log(id2name(dep,$('#userDep2').val()));
        $.ajax({
            url:'/api/yonghu/gengXinById',
            data:JSON.stringify({
                "id": id,
                "zhanghao":$('#userUser2').val(),
                "lianxifangshi": $('#userTel2').val(),
                "nianling": $('#userAge2').val(),
                "suoshubumen": $('#userDep2').val(),
                "suoshuzhiwei": $('#userPos2').val(),
                "xingbie": $('.userSex2:checked').val(),
                "xingming": $('#userName2').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {

                if(res.code==200){

                    $('tbody').find(`[data-id=${id}]`).find('.userName').text($('#userName2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.userAge').text($('#userAge2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.userTel').text($('#userTel2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.userPos').text(id2name(pos,$('#userPos2').val()));
                    $('tbody').find(`[data-id=${id}]`).find('.userDep').text(id2name(dep,$('#userDep2').val()));
                    $('tbody').find(`[data-id=${id}]`).find('.userSexList').text($('.userSex2:checked').val());


                    $('#myModal1').modal('hide')
                }
            }
        })
    });
    /*禁用启用*/
    $('tbody').on('click','.isAbled',function () {
        var status=$(this).parent().attr('data-status');
        var status2=status==1?0:1;
        console.log(status,status2);
        $.ajax({
            url:'/api/yonghu/gengXinZhuangTaiById',
            data:{
                "id":$(this).parent().parent().attr('data-id'),
                "zhuangtai":status2
            },
            type:'post',
            success: (res)=> {
                if(res.code==200){
                    if(status==1){
                        $(this).text('启用');
                        $(this).removeClass('btn-danger').addClass('btn-success');
                    }else{
                        $(this).text('禁用');
                        $(this).removeClass('btn-success').addClass('btn-danger');
                    }

                    $(this).parent().attr('data-status',status2)
                }
            }
        })
    });

    /*查询数据页码,以及对应的数据*/
    function getCon(){
        $.ajax({
            url: '/yonghu/chaXunYongHuFenYe',
            data: {
                yeMa:page,
                buMen:$('#inp-dep').val(),
                chuangjianshijian:$('#inp-time').val(),
                xingMing:$('#inp-name').val(),
                zhangHao:$('#inp-user').val(),
                zhiWei:$('#inp-pos').val()
            },
            success:function (res) {
                if(res.code==200){

                    createPageList(res.zongYeMa);
                    createDataList(res.yongHuList);
                    pageShow();
                }
            }
        });
    }
    /*创建页码列表*/
    function createPageList(n){
        /*创建显示页码列表*/
        if(n>1){
            $('.paging').show();
            $('.page').parent().remove();

            for(var i=1;i<=n;i++){
                $('.pagination li:last').before(`
                    <li><a class="page" href="#">${i}</a></li>
                `)
            }
        }else{
            $('.paging').hide();
        }
    }
    /*创建数据列表*/
    function createDataList(data){
        $('tbody').html('');
        for(var i=0;i<data.length;i++){
            console.log(data[i].chuangjianshijian)
            $('tbody').append(
                `<tr data-id="${data[i].id}">
                    <td class="">${i+1}</td>
                    <td class="userUser">${data[i].zhanghao}</td>
                    <td class="userName">${data[i].xingming}</td>
                    <td class="userSexList">${data[i].xingbie}</td>
                    <td class="userAge">${data[i].nianling}</td>
                    <td class="userTel">${data[i].lianxifangshi}</td>
                    <td class="userTime">${data[i].chuangjianshijian}</td>
                    <td class="userDep">${id2name(dep,data[i].suoshubumen)}</td>
                    <td class="userPos">${id2name(pos,data[i].suoshuzhiwei)}</td>
                    <td>
                        <button class="btn btn-link" data-toggle="modal" data-target="#myModal1">编辑</button>
                        <button class="btn btn-link" data-toggle="modal" data-target="#myModal2">删除</button>
                        <button class="btn btn-link resPassBtn">重置密码</button>
                    </td>
                </tr>`
            );
            if(data[i].zhuangtai){
                $('tbody tr:last td:last').before(`<td data-status="${data[i].zhuangtai}"><button class="btn btn-danger isAbled">禁用</button></td>`)
            }else{
                $('tbody tr:last td:last').before(`<td data-status="${data[i].zhuangtai}"><button class="btn btn-success isAbled">启用</button></td>`)
            }
        }
    }
    /*页码按钮的显示*/
    function pageShow(){
        if(page==1){
            $('.prev').parent().addClass('disabled');
            $('.next').parent().removeClass('disabled');
        }else if(page==$('.paging').find('li').length-2){
            $('.next').parent().addClass('disabled');
            $('.prev').parent().removeClass('disabled');
        }else{
            $('.prev').parent().removeClass('disabled');
            $('.next').parent().removeClass('disabled');
        }
        $('.pagination').find('li').removeClass('active').eq(page).addClass('active');
    }
    /*点击页面*/
    $('.paging').on('click','.page',function () {
        page=$(this).text();
        getCon();
    });
    /*点击上一页*/
    $('.paging').on('click','.prev',function () {
        page--;

        getCon();

    });
    /*点击下一页*/
    $('.paging').on('click','.next',function () {
        page++;
        getCon();
    });

    /*重置*/
    $('.resizeBtn').click(function () {
        $('#inp-user').val('');
        $('#inp-name').val('');
        $('#inp-dep').val('');
        $('#inp-pos').val('');
        $('#inp-time').val('');
    });
    /*搜索*/
    $('.searchBtn').click(function () {
        getCon();
    })
    /*重置密码*/
    $('tbody').on('click','.resPassBtn',function () {
        var id=$(this).parent().parent().attr('data-id');

        $.ajax({
            url: '/api/yonghu/chongZhiMiMaById',
            data: {
                id:id
            },
            type:'post',
            success:function (res) {
                if(res.code==200){
                    alert('重置成功！')
                }
            }
        });
    })
});

