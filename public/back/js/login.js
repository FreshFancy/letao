/**
 * Created by FX on 2018/1/11.
 */
$(function () {
  var $form = $('form');
  //表单校验的功能
  //  1-初始化表单校验插件
  $form.bootstrapValidator({
    //2-指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid:'glyphicon glyphicon-ok',
      invalid:'glyphicon glyphicon-remove',
      validating:'glyphicon glyphicon-refresh'
    },

    //3-指定校验字段
    fields: {
      //对应name属性
      username: {
        validators:{
          notEmpty: {
            message:'用户名不能为空'
          },
          callback:{
            message:'用户名不存在'
          }

        }
      },
      password: {
        validators:{
          notEmpty: {
            message:'密码不能为空'
          },
          //长度校验 用户密码的长度是6-12位
          stringLength: {
            min:6,
            max:12,
            message:'用户名长度必须是6-12位'
          },
          callback:{
            message:'密码有误'
          }


        }
      }
    }
  });

  //通过ajax发送请求，所以要给表单注册验证成功事件，同时阻止浏览器默认行为
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    var data = $form.serialize();
    $.ajax({
      type:'post',
      data:data,
      url:'/employee/employeeLogin',
      dataType:'json',
      success:function (info) {
        //console.log(info);
        if(info.success) {
          location.href = 'index.html'
        }
        if(info.error===1000){
          $form.data('bootstrapValidator').updateStatus('username','INVALID','callback');
        }
        if(info.error===1001){
          $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
        }
      }

  })


  })

  //重置按钮注册事件
  $('[type="reset"]').on('click',function () {
      $form.data('bootstrapValidator').resetForm();
  })




});