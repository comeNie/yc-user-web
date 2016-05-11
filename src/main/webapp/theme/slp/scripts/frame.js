//头部点击1 
 $(function () {
    var st = 100;
    $('.city').mouseenter(function () {
		$('.city a').addClass('b');
		$('.city .city-hover').show(1);
    })
		$(".city .city-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.city').mouseleave(function () {
        $('.city .city-hover').hide(1);
		 $('.city a').removeClass('b');
    });	
  });
 
 //头部点击2 
 $(function () {
    var st = 100;
    $('.use').mouseenter(function () {
		$('.use a').addClass('b');
		$('.use .use-hover').show(1);
    })
		$(".use .use-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.use').mouseleave(function () {
        $('.use .use-hover').hide(1);
		 $('.use a').removeClass('b');
    });	
  });
  
   //头部点击3 
 $(function () {
    var st = 100;
    $('.kefu').mouseenter(function () {
		$('.kefu a').addClass('b');
		$('.kefu .kefu-hover').show(1);
    })
		$(".kefu .kefu-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.kefu').mouseleave(function () {
        $('.kefu .kefu-hover').hide(1);
		 $('.kefu a').removeClass('b');
    });	
  });
  
//左侧点击1 
 $(function () {
    var st = 100;
    $('.Mobile').mouseenter(function () {
		$('.Mobile a').addClass('b');
		$('.Mobile .Mobile-hover').show(1);
    })
		$(".Mobile .Mobile-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.Mobile').mouseleave(function () {
        $('.Mobile .Mobile-hover').hide(1);
		 $('.Mobile a').removeClass('b');
    });	
  });
  
  //左侧点击2 
 $(function () {
    var st = 100;
    $('.Unicom').mouseenter(function () {
		$('.Unicom a').addClass('b');
		$('.Unicom .Unicom-hover').show(1);
    })
		$(".Unicom .Unicom-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.Unicom').mouseleave(function () {
        $('.Unicom .Unicom-hover').hide(1);
		 $('.Unicom a').removeClass('b');
    });	
  });
  
    //左侧点击3 
 $(function () {
    var st = 100;
    $('.telecom').mouseenter(function () {
		$('.telecom a').addClass('b');
		$('.telecom .telecom-hover').show(1);
    })
		$(".telecom .telecom-hover").click(function () {
                $(this).hide(1);
            });
			
		$('.telecom').mouseleave(function () {
        $('.telecom .telecom-hover').hide(1);
		 $('.telecom a').removeClass('b');
    });	
  });
  
  
//table切换1
$(function(){
$(".charge-title ul li a").click(function () {
                $(".charge-title ul li a").each(function () {
                    $(this).removeClass("current");
                });
                $(this).addClass("current");
            });
$('.charge-title ul li a').click(function(){
  var index=$('.charge-title ul li a').index(this);
      if(index==0){
     $('#date1').show();
  $('#date2').hide();
   }
   if(index==1){
     $('#date2').show();
  $('#date1').hide();
   }
  }); 
});
//table切换结束

//图片table切换2
$(function(){
$(".plist-right-title ul li a").click(function () {
                $(".plist-right-title ul li a").each(function () {
                    $(this).removeClass("current");
                });
                $(this).addClass("current");
            });
$('.plist-right-title ul li a').click(function(){
  var index=$('.plist-right-title ul li a').index(this);
      if(index==0){
     $('#img-list1').show();
  $('#img-list2').hide();
   }
   if(index==1){
     $('#img-list2').show();
  $('#img-list1').hide();
   }
  }); 
});
//table切换结束

//图片table切换3
$(function(){
$(".plist-right-title-tow ul li a").click(function () {
                $(".plist-right-title-tow ul li a").each(function () {
                    $(this).removeClass("current");
                });
                $(this).addClass("current");
            });
$('.plist-right-title-tow ul li a').click(function(){
  var index=$('.plist-right-title-tow ul li a').index(this);
      if(index==0){
     $('#img-list3').show();
  $('#img-list4').hide();
   }
   if(index==1){
     $('#img-list4').show();
  $('#img-list3').hide();
   }
  }); 
});
//table切换结束  


//table切换1
$(function(){
$(".center-table ul li a").click(function () {
                $(".center-table ul li a").each(function () {
                    $(this).removeClass("current");
                });
                $(this).addClass("current");
            });
$('.center-table ul li a').click(function(){
  var index=$('.center-table ul li a').index(this);
      if(index==0){
     $('#regeiter-date1').show();
  $('#regeiter-date2').hide();
   }
   if(index==1){
     $('#regeiter-date2').show();
  $('#regeiter-date1').hide();
   }
  }); 
});

//点击展开
$(document).ready(function(){
  $(".balance-title p .checkbox").click(function () {
	  $(".balance-table").slideToggle(100);
	  $(".balance-title").toggleClass("reorder remove");
	  });
});
