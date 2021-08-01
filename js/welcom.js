window.onload =()=>{
    let minWidth = window.outerWidth;
    let minHeight = window.outerHeight;  
    let num = 1;
    let timer;

    //动态添加背景音乐
    $('.playMusic').click(function(){
        if($('.playMusic .mp3').hasClass("play")){
            $('.playMusic .mp3').removeClass("play");
            document.getElementById('playAudio').innerHTML = '';
        }else{
            $('.playMusic .mp3').addClass("play");
            document.getElementById('playAudio').innerHTML = `<audio id="myAudio"  autoplay loop> 
        <source src="../audios/welcom.mp3" type="audio/mpeg">
        您的浏览器不支持 audio 元素。
        </audio>`;
        }
    })

    processAni();   

    //自适应浏览器的大小
    $('video').css({"width":minWidth+'px',"hieght":minHeight+'px',"min-width": minWidth+'px',"min-height":minHeight+'px'});
    $('.content').css({"width":minWidth+'px',"hieght":minHeight+'px',"min-width": minWidth+'px',"min-height":minHeight+'px'});
    $('.userNoticeBox').css({"width":minWidth+'px',"hieght":minHeight+'px',"min-width": minWidth+'px',"min-height":minHeight+'px'});

    //进度条的动画
    function processAni(){
        $('.userNoticeBox').html('');
        $('.userNoticeBox').css({'width':0+'px','min-width':0+'px'});
        $('.progress').css({opacity: 1});
        setTimeout(() => {
            $('.progressPerson').css({opacity: 1});
        }, 100);
        timer = setInterval(()=>{
            if(num >= 100){
                //进度条加载完之后，"开始游戏"的样式
                $('.start').css({"background":"url(../images/startAfter.png)","background-size": "100% 100%","pointer-events":"auto"});
                //开始游戏的js效果
                $(".start").hover(function(){
                    $(".start").css({"width":'340px',"hieght":"90px"});
                },function(){
                    $(".start").css({"width":'320px',"hieght":"70px"});
                });
                setTimeout(()=>{
                    $('.progressBox').css({"opacity": 0});
                },50)
                clearInterval(timer);
            }
            // $('.progress').css({"width" : num+'%'})
            $('.progressPerson').css({"margin-left" : num-3 + '%'});
            num++;
        },50)
        //用户点击开始游戏按钮之后，关闭欢迎界面的背景音乐
        $('.start').click(function(){
            $('.playAudio').html('');

        });
    }
}
