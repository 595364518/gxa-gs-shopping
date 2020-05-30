$(function () {
    let id; //选中职位的id
    let page=1;//当前页码
    /*页面一加载调用数据*/
    getCon();
    /*按照职位名称查询*/
    $('.search-btn').click(function () {
        page=1;
        getCon();
    });
    /*查询数据页码,以及对应的数据*/
    function getCon(){
        $.ajax({
            url: '/api/bumen/chaXunBuMenFenYe',
            data: {
                yeMa:page,
                buMenMingCheng:$('#inp-name').val()
            },
            success:function (res) {
                if(res.code==200){
                    createPageList(res.zongYeMa);
                    createDataList(res.buMenList);
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
            $('tbody').append(
                `<tr data-id="${data[i].id}">
                    <td class="">1</td>
                            <td class="depName">${data[i].bumenmingcheng}</td>
                            <td class="depTime">${data[i].chenglishijian}</td>
                            <td class="depText">${data[i].bumenmiaoshu}</td>
                            <td>
                                <button class="btn btn-link" data-toggle="modal" data-target="#myModal1">编辑</button>
                            </td>
                </tr>`
            );
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
    /*新增部门*/
    $('.addBtn').click(function () {
        $.ajax({
            url:'/bumen/xinZeng',
            data:JSON.stringify({
                "bumenmiaoshu":  $('#depText').val(),
                "bumenmingcheng": $('#depName').val(),
                "chenglishijian":$('#depTime').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {
                getCon();
                $('#myModal').modal('hide')
            }
        })
    });
    /*编辑部门打开的时候*/
    $('#myModal1').on('show.bs.modal', function (e) {
        id=$(e.relatedTarget).parent().parent().attr('data-id');
        $('#depName2').val($(e.relatedTarget).parent().siblings('.depName').text());
        $('#depTime2').val($(e.relatedTarget).parent().siblings('.depTime').text());
        $('#depText2').val($(e.relatedTarget).parent().siblings('.depText').text())

    });
    /*修改保存的时候*/
    $('.editBtn').click(function () {
        $.ajax({
            url:'/api/bumen/gengXinById',
            data:JSON.stringify({
                "id": id,
                "bumenmiaoshu": $('#depText2').val(),
                "bumenmingcheng": $('#depName2').val(),
                "chenglishijian":$('#depTime2').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {
                if(res.code==200){
                    console.log($('tbody').find(`[data-id=${id}]`));
                    $('tbody').find(`[data-id=${id}]`).find('.depName').text($('#depName2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.depText').text($('#depText2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.depTime').text($('#depTime2').val());

                    $('#myModal1').modal('hide')
                }
            }
        })
    });
    /*重置*/
    $('.resizeBtn').click(function () {
        $('#inp-name').val('');
    })
});















