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
            url: '/api/zhiwei/chaXunZhiWeiFenYe',
            data: {
                yeMa:page,
                zhiWeiMingCheng:$('#inp-name').val()
            },
            success:function (res) {
                if(res.code==200){
                    createPageList(res.zongYeMa);
                    createDataList(res.zhiWeiList);
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
                    <td class="">${i+1}</td>
                    <td class="listPosName">${data[i].zhiweimingcheng}</td>
                    <td class="listPosText">${data[i].zhiweimiaoshu}</td>
                    <td>
                        <button class="btn btn-link" data-target="#myModal1" data-toggle="modal">编辑</button>
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
    /*编辑职位打开的时候*/
    $('#myModal1').on('show.bs.modal', function (e) {
        id=$(e.relatedTarget).parent().parent().attr('data-id');
        $('#posName2').val($(e.relatedTarget).parent().siblings('.listPosName').text());

        $('#posText2').html($(e.relatedTarget).parent().siblings('.listPosText').text())

    });
    /*修改保存的时候*/
    $('.editBtn').click(function () {
        $.ajax({
            url:'/api/zhiwei/gengXinById',
            data:JSON.stringify({
                "id": id,
                "zhiweimiaoshu":$('#posText2').val() ,
                "zhiweimingcheng":$('#posName2').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {
                if(res.code==200){
                    console.log($('tbody').find(`[data-id=${id}]`));
                    $('tbody').find(`[data-id=${id}]`).find('.listPosName').text($('#posName2').val());
                    $('tbody').find(`[data-id=${id}]`).find('.listPosText').text($('#posText2').val());

                    $('#myModal1').modal('hide')
                }
            }
        })
    });
    /*增加职位*/
    $('.addBtn').click(function () {
        $.ajax({
            url:'/api/zhiwei/xinZeng',
            data:JSON.stringify({
                "zhiweimiaoshu": $('#posName').val(),
                "zhiweimingcheng": $('#posText').val()
            }),
            type:'post',
            contentType:'application/json',
            success:function (res) {
                getCon();
                $('#myModal').modal('hide')
            }
        })
    });
    /*重置*/
    $('.resizeBtn').click(function () {
        $('#inp-name').val('');
    })
});