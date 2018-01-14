/**
 * Created by FX on 2018/1/14.
 */
$(function () {
  //1-渲染表格和分页功能
  var page = 1; //当前页
  var pageSize = 5;//每页显示的条数
  var imgArr = []; //存放上传的图片
  var $form = $('form');

  function render() {
    $.ajax({
      type:'get',
      url:'/product/queryProductDetailList',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        //console.log(info);
        $('tbody').html(template('tmp-goods',info));
        //页面成功渲染后在根据数据渲染分页的
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:page,
          totalPages:Math.ceil(info.total/pageSize),
          size:'normal',
          itemTexts:function (type,page,current) {
            switch (type) {
              case('first'):
                return '首页';
              case('last'):
                return '末页';
              case('prev'):
                return '上一页';
              case('next'):
                return '下一页';
              case('page'):
                return page;
            }
          },
          tooltipTitles:function (type,page,current) {
            //console.log(type, page, current);
            switch (type) {
              case('first'):
                return '首页';
              case('last'):
                return '末页';
              case('prev'):
                return '上一页';
              case('next'):
                return '下一页';
              case('page'):
                return '第'+ page + '页';
            }
          },
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

  //2-点击添加商品按钮，模态框显示
  $('.btn-inc').on('click',function () {
    $('#goodsModal').modal('show')
  });

  //3-请求下拉框的数据
  $.ajax({
    type:'get',
    url:'/category/querySecondCategoryPaging',
    data:{
      page:page,
      pageSize:100
    },
    success:function (info) {
      console.log(info);
      $('.dropdown-menu').html( template('tmp',info));
    }

  });
  //3-1 下拉框的选项注册点击事件，赋值并获取到id
  $('.dropdown-menu').on('click','a',function () {
    $('.dropdown-text').text($(this).text());
    $('[name="brandId"]').val($(this).data('id'));

    //手动验证通过
    $form.data('bootstrapValidator').updateStatus('brandId','VALID');

  });

  //4-上传图片
  $('#fileupload').fileupload({
    dataType:'json',
    done:function (e,data) {
      //console.log(data.result);
      imgArr.push(data.result);
      //console.log(imgArr);
      $('.img-upload').append("<img src="+ data.result.picAddr+" width='100' height='100' style='display:inline-block'>");

      //手动校验通过
      if(imgArr.length === 3){
        $form.data('bootstrapValidator').updateStatus('brandLogo','VALID');
      }else {
        $form.data('bootstrapValidator').updateStatus('brandLogo','INVALID');
      }
    }

  });


  //5-表单验证
  $form.bootstrapValidator({
    excluded:[],
    //-指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid:'glyphicon glyphicon-ok',
      invalid:'glyphicon glyphicon-remove',
      validating:'glyphicon glyphicon-refresh'
    },

    //-指定校验字段
    fields: {
      //对应name属性
      brandId: {
        validators:{
          notEmpty: {
            message:'请选择二级分类'
          }
        }
      },
      proName: {
        validators:{
          notEmpty: {
            message:'商品名不能为空'
          }
        }
      },
      proDesc: {
        validators:{
          notEmpty: {
            message:'商品描述不能为空'
          },
          //长度校验 用户密码的长度是6-12位
          stringLength: {
            min:6,
            max:200,
            message:'商品描述为6-200字数'
          }
        }
      },
      num: {
        validators:{
          notEmpty: {
            message:'库存不能为空'
          },
          regexp: {
            regexp:/^[1-9]\d*$/,
            message:'库存为大于0的数字'
          }
        }
      },
      size: {
        validators:{
          notEmpty: {
            message:'尺码不能为空'
          },
          regexp:{
            regexp:/^\d{2}-\d{2}$/,
            message:'请输入商品的尺码(32-46)'
          }
        }
      },
      oldPrice: {
        validators:{
          notEmpty: {
            message:'商品名不能为空'
          },
          regexp: {
            regexp:/^[1-9]\d*$/,
            message:'价格为大于0的数字'
          }
        }
      },
      price: {
        validators:{
          notEmpty: {
            message:'商品名不能为空'
          },
          regexp: {
            regexp:/^[1-9]\d*$/,
            message:'价格为大于0的数字'
          }
        }
      },
      brandLogo: {
        validators:{
          notEmpty: {
            message:'请上传三张图片'
          }

        }
      }
    }
  });

  //6-点击添加提交表单
  $form.on('success.form.bv',function (e) {
    e.preventDefault();
    var pramas = $form.serialize();
    pramas += '&picName1='+imgArr[0].picName+ '&picAddr1='+imgArr[0].picAddr;
    pramas += '&picName2='+imgArr[1].picName+ '&picAddr2='+imgArr[1].picAddr;
    pramas += '&picName3='+imgArr[2].picName+ '&picAddr3='+imgArr[2].picAddr;
    //console.log(pramas);
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:pramas,
      success:function(info) {
        console.log(info);
        if(info.success) {
          $('#goodsModal').modal('hide');
          page = 1;
          render();
          //7-重置表单

          $form.data('bootstrapValidator').resetForm(true);
          $('.dropdown-text').text('请选择二级分类');
          $('[name="brandId"]').val('');

          $('.img-upload').remove();
          imgArr = [];
        }
      }
    })

  });





});