/**
 * Created by FX on 2018/1/13.
 */
$(function () {
  //1-渲染表格和分页功能
  var page = 1; //当前页
  var pageSize = 5;//每页显示的条数
  var $form = $("form");

  function render() {
    $.ajax({
      type:'get',
      url:'/category/querySecondCategoryPaging',
      data:{
        page:page,
        pageSize:pageSize
      },
      success:function (info) {
        console.log(info);
        $('tbody').html(template('tmp-subcate',info));
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
    $('#secondModal').modal('show');
    //2-1 发送ajax请求，获取所有的一级分类数据，渲染下拉框组建
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100 //为了获取到所有的
      },
      success: function (info) {
        console.log(info);
        $('.dropdown-menu').html(template('tmp', info));
      }

    });
  });
    //2-2 给下拉框中所有的a标签注册点击事件,事件委托
    $('.dropdown-menu').on('click','a',function () {
       //将点击的类的名赋值给dropdown-text，
      $('.dropdown-text').text($(this).text());
      //获取到当前a的id值，设置给categoryId
      $('[name="categoryId"]').val($(this).data('id'));
      //3. 让categoryId校验变成成功
      $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");
    });


    //2-3 初始化图片上传
    $('#fileupload').fileupload({
      dataType:'json',
      //图片上传成功之后的回调函数
      done:function (e,data) {
        console.log(data);
        //data.result.picAddr获取的是图片上传后的路劲
        $('.img-upload img').attr('src',data.result.picAddr);
        //将图片的地址赋值给隐藏的input
        $('[name="brandLogo"]').val(data.result.picAddr);

        $form.data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      }

    });

    //2-4 表单校验功能
    $form.bootstrapValidator({
      excluded:[],
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        categoryId: {
          validators: {
            notEmpty: {
              message: "请选择一级分类"
            }
          }
        },
        brandName: {
          validators: {
            notEmpty: {
              message: "请输入二级分类的名称"
            }
          }
        },
        brandLogo: {
          validators: {
            notEmpty: {
              message: "请上传品牌图片"
            }
          }
        }
      }

    });

    //2-5给表单注册校验成功事件
    $form.on('success.form.bv',function (e) {
      e.preventDefault();
      $.ajax({
        type:'post',
        url:'/category/addSecondCategory',
        data:$form.serialize(),
        success:function (info) {
          console.log(info);
          if(info.success) {
            $('#secondModal').modal('hide');
            page = 1;
            render();
            $form.data("bootstrapValidator").resetForm(true);
            $('.dropdown-text').text('请选择一级分类');
            //获取到当前a的id值，设置给categoryId
            $('[name="categoryId"]').val('');

          }
        }

      })
    })



});