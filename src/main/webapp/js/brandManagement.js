/*查询数据页码,以及对应的数据*/
var id;
var page=1;

function getCon(){
    $.ajax({
        url: '/api/pinpai/chaXunFenYe',
        data: {
            yeMa:page,
            pinPaiMingCheng:$('#inp-name').val()
        },
        success:function (res) {
            console.log(res)
            if(res.code==200){

                createPageList(res.zongYeMa);
                createDataList(res.pinPaiList);
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
                <td class="brandName">${data[i].pinpaimingcheng}</td>
                <td class="brandInitials">${data[i].pinpaishouzimu}</td>
                <td>
                    <button class="btn btn-link" data-target="#myModal1" data-toggle="modal">编辑</button>
                    <button class="btn btn-link" data-target="#myModal2" data-toggle="modal">删除</button>
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
/*页面一加载调用数据*/
getCon();
/*用户添加*/
$('.addBtn').click(function () {
    $.ajax({
        url:'/api/pinpai/xinZeng',
        data:JSON.stringify({
            pinpaimingcheng:$('#brandName').val(),
            pinpaishouzimu:$('#brandInitials').val()
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
    $('#brandName3').text($(e.relatedTarget).parent().siblings('.brandName').text());
});
/*确定删除的时候*/
$('.delBtn').click(function () {
    $.ajax({
        url:'/api/pinpai/shanChuById',
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

    $('#brandName2').val($(e.relatedTarget).parent().siblings('.brandName').text());

    $('#brandInitials2').val($(e.relatedTarget).parent().siblings('.brandInitials').text());

});
/*修改保存的时候*/
$('.editBtn').click(function () {
    $.ajax({
        url:'/api/pinpai/gengXinById',
        data:JSON.stringify({
            "id": id,
            pinpaimingcheng:$('#brandName2').val(),
            pinpaishouzimu:$('#brandInitials2').val()
        }),
        type:'post',
        contentType:'application/json',
        success:function (res) {

            if(res.code==200){

                $('tbody').find(`[data-id=${id}]`).find('.brandName').text($('#brandName2').val());
                $('tbody').find(`[data-id=${id}]`).find('.brandInitials').text($('#brandInitials2').val());
                $('#myModal1').modal('hide')
            }
        }
    })
});
/*重置*/
$('.resizeBtn').click(function () {
    $('#inp-user').val('');
});
/*搜索*/
$('.searchBtn').click(function () {
    getCon();
});




















