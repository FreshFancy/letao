/**
 * Created by FX on 2018/1/11.
 */
//1-进度条功能
NProgress.configure({ showSpinner:false });

//注册全局的ajaxStart事件，所有的ajax在开启的时候，会触发这个事件
$(document).ajaxStart(function () {
  NProgress.start();
});
$(document).ajaxStop(function () {
  setTimeout(function () {
    NProgress.done();
  },1000)

});

//2-非登陆页面，判断当前用户是否是登录了，如果登录了，就继续，如果没登陆，需要跳转到登录页面
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

//3-二级分类显示隐藏功能
$('.subcate').prev().on('click',function () {
  $(this).next().slideToggle();
});

//4-侧边栏显示隐藏功能
$('.icon-menu').on('click',function () {
    $('.lt-aside').toggleClass('now');
    $('.lt-main').toggleClass('now');
    $('.title').toggleClass('now');
});

//5-退出功能
$('.icon-out').on('click',function () {
  $('#logoutModal').modal('show')
});
//该点击事件写在外面，里面的话，on不会覆盖同名事件，会多次触发，降低运算效率
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

});