/**
 * Created by FX on 2018/1/15.
 */
$(function () {
  mui('.cate-nav .mui-scroll-wrapper').scroll({
    deceleration: 0.0005,
    indicators:false
  });
  mui('.cate-goods .mui-scroll-wrapper').scroll({
    deceleration: 0.0005,
    indicators:false
  });

  //请求左侧的导航数据
  $.ajax({
    type:'get',
    url:'/category/queryTopCategory',
    success:function (info) {
      console.log(info);
      $('.cate-nav ul').html( template('tmp-nav',info) );
    }
  });

  //封装goods分类
  function renderGoods(id) {
    $.ajax({
      type:'get',
      url:'/category/querySecondCategory',
      data: {id:id},
      success:function (info) {
        console.log(info);
        $('.cate-goods ul').html( template('tmp-goods',info) );
      }
    })
  }
  //li高亮排他
  $('.cate-nav ul').on('click','li',function () {
    $(this).addClass('active').siblings().removeClass('active');
    var cateId = $(this).data('id');
    console.log(cateId);

    //根据一级的id去请求右侧的数据
    renderGoods(cateId);
    //让右边的区域滚动滚回 0，0
    mui('.cate-goods .mui-scroll-wrapper').scroll().scrollTo(0,0,200);
  });



});