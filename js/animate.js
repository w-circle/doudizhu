let fire = {animate:'',num:0,timer:''}
let minWidth=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;

//抢地主与不抢地主的css效果
function get_boss_animate(get){
    let getBossGet = document.getElementsByClassName('get_boss')[get].getElementsByClassName('get')[0];
    let getBossCancel = document.getElementsByClassName('get_boss')[get].getElementsByClassName('cancel')[0];
    //鼠标移进，抢地主的效果
    getBossGet.onmouseover = ()=>{
        getBossGet.style.background = 'url(../images/btnAfter.png)';
        getBossGet.style.backgroundSize = '100% 100%';
    }
    //鼠标移出去，抢地主的效果
    getBossGet.onmouseout = ()=>{
        getBossGet.style.background = 'url(../images/btnBefore.png)';
        getBossGet.style.backgroundSize = '100% 100%';
    }
    //鼠标移进，不抢地主的效果
    getBossCancel.onmouseover = ()=>{
        getBossCancel.style.background = 'url(../images/btnAfter.png)';
        getBossCancel.style.backgroundSize = '100% 100%';
    }
    //鼠标移出去，不抢地主的效果
    getBossCancel.onmouseout = ()=>{
        getBossCancel.style.background = 'url(../images/btnBefore.png)';
        getBossCancel.style.backgroundSize = '100% 100%';
    }
}

//出牌、提示、过牌的css效果
function play_btn_animate(gameData){
    let playBtnCan = document.getElementsByClassName('play_btn')[gameData].getElementsByClassName('cancel')[0];
    let playBtnPla = document.getElementsByClassName('play_btn')[gameData].getElementsByClassName('play')[0];
    let playBtnTips = document.getElementsByClassName('play_btn')[gameData].getElementsByClassName('tips')[0];

    //鼠标移进来，过牌的的css效果
    playBtnCan.onmouseover = ()=>{
        playBtnCan.style.background = 'url(../images/btnAfter.png)';
        playBtnCan.style.backgroundSize = '100% 100%';
    }
    //鼠标移出去，过牌的的css效果
    playBtnCan.onmouseout = ()=>{
        playBtnCan.style.background = 'url(../images/btnBefore.png)';
        playBtnCan.style.backgroundSize = '100% 100%';
    }
    //鼠标移进，提示的的css效果
    playBtnPla.onmouseover = ()=>{
        playBtnPla.style.background = 'url(../images/btnAfter.png)';
        playBtnPla.style.backgroundSize = '100% 100%';
    }
    //鼠标移出去，提示的的css效果
    playBtnPla.onmouseout = ()=>{
        playBtnPla.style.background = 'url(../images/btnBefore.png)';
        playBtnPla.style.backgroundSize = '100% 100%';
    }

    //鼠标移进，出牌的的css效果
    playBtnTips.onmouseover = ()=>{
        playBtnTips.style.background = 'url(../images/btnAfter.png)';
        playBtnTips.style.backgroundSize = '100% 100%';
    }
    //鼠标移出去，出牌的的css效果
    playBtnTips.onmouseout = ()=>{
        playBtnTips.style.background = 'url(../images/btnBefore.png)';
        playBtnTips.style.backgroundSize = '100% 100%';
    }
}
//人物的动画
function personAnimate(){
    //玩家1号
    setInterval(() => {
        $('.person1').animate({"top":"-136px"},800);
        $('.person1').animate({"top":"-126px"},800);
    }, 0);

    //玩家2号
    setInterval(() => {
        $('.person2').animate({"bottom":"10px"},800);
        $('.person2').animate({"bottom":"0px"},800);
    }, 0);

    //玩家3号
    setInterval(() => {
        $('.person3').animate({"top":"-136px"},800);
        $('.person3').animate({"top":"-126px"},800);
    }, 0);
}


//盒子动画
function box_aniamtion(boss) {
    //添加盒子动画的容器
    $('.bg').append(`
    <div class="boss_animation">
        <video src="../video/welcom.mp4" autoplay width="100%" height="100%"></video>
    </div>
    <ul class = "bossAnimateBox">
        <li class="top1"></li>
        <li class="bottom"></li>
        <li class="left"></li>
        <li class="right"></li>
        <li class="front"></li>
        <li class="behind"></li>
    </ul>
    <div class="boss_head"></div>
    `)

    $('.boss_animation').css({'display':'block'});
    setTimeout(function(){
        $('.boss_animation').animate({     
            left:'100%'     
            },500).animate({
            left:'-100%'
            },1000,function(){
                $('.bg .boss_animation').remove();
            }) 
        })

    setTimeout(function () {
        $('.bg').append('<div class="bossMask"></div>');
        $('.bossMask').addClass("bossMask");
        $('.bossMask').css({'width':minWidth});

        $('.boss_animation').css({'display':'none'});
        $('.bg>ul ').css({ 'display': 'block' })
        $('.bg>ul li').css({ "animation": "li_run 15s linear 1", "animation-fill-mode": "forwards" })
    },1300)
    setTimeout(function () {
        $('.boss_head').css({
            'display': 'block'
        });
        $('.boss_head').animate({"opacity": 1},1);

        $('.top1').css({ "animation": "top_run 0.05s linear 1", "animation-fill-mode": "forwards" });
        $('.left').css({ "animation": "left_run 1.2s linear 1", "animation-fill-mode": "forwards" });
        $('.right').css({ "animation": "right_run 1.2s linear 1", "animation-fill-mode": "forwards" });
        $('.front').css({ "animation": "front_run 1.2s linear 1", "animation-fill-mode": "forwards" });
        $('.behind').css({ "animation": "behind_run 1.2s linear 1", "animation-fill-mode": "forwards" });
        $('.bottom').css({ "animation": "bottom_run 1.2s linear 1", "animation-fill-mode": "forwards" });       
    }, 1400)
    
     setTimeout(function(){
        $('.bg>ul ').css({ 'display': 'none' })
        $('.bossMask').remove();
        changeboss(boss);

     },2500)   
}

//换头动画
function changeboss(boss){
    if(boss==0){
        $('.boss_head').css({
        'top':'28%',
        'left':'4.8%',
        'opacity':'0',
        });
        setTimeout(()=>{
            $('.headwear').eq(0).css({'opacity':'1'}); 
        },1200)
    }else if(boss==1){
        $('.boss_head').css({
            'top':'75%',
            'left':'28%',
            'opacity':'0',
        });
        setTimeout(()=>{
            $('.headwear').eq(1).css({'opacity':'1'});
        },1200)
    }else if(boss==2){
        $('.boss_head').css({
            'top':'28%',
            'left':'100%',
            'opacity':'0',
        });
        setTimeout(()=>{
            $('.headwear').eq(2).css({'opacity':'1'});
        },1300)
    }
    
    setTimeout(function(){
        $('.bg .bossAnimateBox').remove();
        $('.bg .boss_head').remove();
    },2300)
}

//删除用户手中的牌，并重新生成新的牌组及发牌动画
function Licensing(times){
    //1.生成新的牌组
    $('.play_' + (times + 1)).html('');
    let length =  player[times].poker.length;

    //2.发牌动画，动态让玩家手中的牌居中
    //2.1玩家1号
    // if(times == 0 && bigBox != 0){
    //     $(".play_" + (times + 1)).css({top:(17-length)*2+'%'});
    // }else if(times == 0 && bigBox == 0){
    //     $(".play_" + (times + 1)).css({top:(20-length)*2+'%'});
    // }

    //2.2玩家2号
    if(times == 1 && bigBox != 1){
        $(".play_" + (times + 1)).css({left:(17-length)*1.2+'%'});
    }else if(times == 1 && bigBox == 1){
        $(".play_" + (times + 1)).css({left:(20-length)*1.2+'%'});
    }

    //2.3玩家3号
    // if(times == 2 && bigBox != 2){
    //     $(".play_" + (times + 1)).css({top:(17-length)*2+'%'});
    // }else if(times == 2 && bigBox == 2){
    //     $(".play_" + (times + 1)).css({top:(20-length)*2+'%'});
    // }

    //3动态添加li
    for(let i = 0; i < length; i++){
        $('.play_' + (times + 1)).append(makePoker(player[times].poker[i]));
        if(times == 0){
            $(".play_" + (times + 1) + ' li:last').css({top:i*19-38 + 'px',"transform":"rotate(90deg) scale(0.8)"});
        }else if(times == 1){
            $(".play_" + (times + 1) + ' li:last').css({ left: i * 25 + 'px' });
        }else if(times == 2){
            $(".play_" + (times + 1) + ' li:last').css({top:i*19-38 + 'px',"transform":"rotate(-90deg) scale(0.8)","z-index":17-i});
        }
    }
}


