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
      url:'/category/queryTopCategoryPaging',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $('tbody').html(template('tmp-cate',info));
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

  //2-点击添加分类
  $('.btn-inc').on('click',function () {
    $('#cateModal').modal('show');
    $('.btn-add').on('click',function (e) {
      //阻止button的默认行为
      e.preventDefault();
      //获取到input的value值，传给后台
      var categoryName = $('.cateName').val();
      $.ajax({
        type:'post',
        url:'/category/addTopCategory',
        data:{categoryName:categoryName},
        success:function (info) {
          if(info.success) {
            $('#cateModal').modal('hide');
            page = 1;
            render();
          }
        }

      })

    })

  })

});