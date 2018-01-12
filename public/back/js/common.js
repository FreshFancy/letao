/**
 * Created by FX on 2018/1/11.
 */
//进度条功能
NProgress.configure({ showSpinner:false });

//注册全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function () {
  NProgress.start();
});
$(document).ajaxComplete(function () {
  setTimeout(function () {
    NProgress.done();
  },1000)

})

//非登陆页面，判断当前用户是否是登录了，如果登录了，就继续，如果没登陆，需要跳转到登录页面
if(location.href.indexOf("login.html") == -1) {
  $.ajax({
    type:'get',
    url:'/employee/checkRootLogin',
    success:function (info) {
        if(info.error === 400) {
          location.href = "login.html"
        }
    }
  })
}

//二级分类显示隐藏功能
$('.subcate').prev().on('click',function () {
  $(this).next().slideToggle();
});

//侧边栏显示隐藏功能
$('.icon-menu').on('click',function () {
    $('.lt-aside').toggleClass('now');
    $('.lt-main').toggleClass('now');
    $('.title').toggleClass('now');
});

//退出功能
$('.icon-out').on('click',function () {
  $('#logoutModal').modal('show')
});

$('.btn_exit').on('click',function () {
  $.ajax({
    type:'get',
    url:'/employee/employeeLogout',
    success:function (info) {
      console.log(info);
      if(info.success) {
          location.href = "login.html"
        }
    }
  })

})