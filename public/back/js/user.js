/**
 * Created by FX on 2018/1/13.
 */
$(function () {
  //1-渲染表格和分页功能
  var page = 1; //当前页
  var pageSize = 5;//每页显示的条数
  function render() {
    $.ajax({
      type:'get',
      url:'/user/queryUser',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $('tbody').html(template('tmp-user',info));
        //页面成功渲染后在根据数据渲染分页的
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,
          totalPages:Math.ceil(info.total/pageSize),
          size:'small',
          //点击页数的事件，渲染当前页面
          onPageClicked:function (a,b,c,p) {
            page = p;
            render()
          }

        })


      }
    })
  }
  //页面加载就渲染一次
  render();

  //2-禁用和启用操作
  $('tbody').on('click','.btn',function () {
    $('#userModal').modal('show');
    var id = $(this).parent().data('id');
    //console.log(id);
    var isDelete = $(this).hasClass('btn-success')?1:0;

    $('.btn_sure').on('click',function () {
      $.ajax({
        type:'post',
        url:'/user/updateUser',
        data:{
          id:id,
          isDelete:isDelete
        },
        success:function (info) {
          console.log(info);
          if(info.success) {
            $('#userModal').modal('hide');
            render();
          }
        }
      })
    })



  })


});