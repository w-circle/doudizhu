//初始化玩家数据
let player = [{
    name: '巴拉巴拉',
    img: '../images/photo1.gif',
    gold: 10000,
    poker: []
},
{
    name: '库奇',
    img: '../images/photo2.gif',
    gold: 10000,
    poker: []
},
{
    name: '索菲亚',
    img: '../images/photo3.gif',
    gold: 10000,
    poker: []
}]


//用于保存当局游戏的数据
let gameData = {
    boss: null, //当前哪位玩家是地主
    play: null, //当前哪位玩家出牌

    //当前玩家选中的牌的数据
    select: {              //当前玩家选择中的牌的数据
        type: 0,                //选中牌的牌型
        poker:[],               //选中牌的数据
        max:0                   //用于判断选中牌型的大小的值
    },

    //当前桌面牌组的数据
    desktop:{
        type: 0,                //选中牌的牌型
        poker: [],              //选中牌的数据
        max: 0                      //用于判断选中牌型的大小的值
    },

    multiple:1                     

}

//出牌限时的数据
let timeLimit = {
    time : 15,    //出牌限时的时间
    animate : null,   //出牌限时的setInterval返回值
    clockAnimate : null, //闹钟的返回值
    clockFlag : 0,   //闹钟动画的标记
    clockDeg : 22,  //闹钟的默认角度
    clickFlag : 0,
    judgeAnimate : 0
};

let bigBox; //判断谁是地主

$(function () {  
    let minWidth=window.innerWidth|| document.documentElement.clientWidth|| document.body.clientWidth;
    let minHeight = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;

    //动态增加背景音乐
    $('.bg').append(
        `<video class="play_video"  autoplay muted loop> 
            <source src="../video/bg.mp4">
        </video>`);

    //动态增加音乐播放区域
    $('.bg').append(
        `<div class="play_audios">
            <div class="poker_music">
                <audio src="" autoplay id="bgms"></audio>
            </div>
            <div class="bg_music">
                <a href="javascript:void(0);" class="bamusic"></a>
            </div>
        </div>`
    );

    //动态添加背景音乐
    $('.bg_music').click(function () {
        if ($('.bg_music .bamusic').hasClass("play")) {
            $('.bg_music .bamusic').removeClass("play");
            $('.bg_music .bamusic').html('');
            document.getElementById('bg_music').innerHTML = '';
        } else {
            $('.bg_music .bamusic').addClass("play");
            $('.bg_music .bamusic').html(`<audio id="myAudio"  autoplay loop> 
            <source src="../audios/bgmusic.mp3" type="audio/mpeg">
            您的浏览器不支持 audio 元素。
            </audio>`);
            //调整音乐背景的声音
            document.getElementById("myAudio").volume = 0.5;
        }
    })

    //自适应屏幕的大小
    $('.bg').css({"width":minWidth+'px',"min-width": minWidth,'height':minHeight});
    $('.play_video').css({"width":minWidth+"px","min-width": minWidth+"px",height:minHeight});

    //获取存的值
    let player_0 = localStorage.getItem('巴拉巴拉');
    let player_1 = localStorage.getItem('库奇');
    let player_2 = localStorage.getItem('索菲亚');

     //清除存储数据
    //  localStorage.clear();

    //初始化每个的玩家个人信息
    if (player_0 == null) {
        $('.mid_left_photo').css({ "background": "url(" + player[0].img + ")", "background-size": "100% 100%" });//头像
        $('.mid_left_top span').html(player[0].name)//用户名
        $('.mid_left_top p').html('<img src="../images/money.png">' + player[0].gold);                  //1的余额


        $('.mid_among_photo').css({ "background": "url(" + player[1].img + ")", "background-size": "100% 100%" });//头像
        $('.information span').html(player[1].name)//用户名
        $('.information p').html( '<img src="../images/money.png">'+player[1].gold );                   //2的余额


        $('.mid_right_photo').css({ "background": "url(" + player[2].img + ")", "background-size": "100% 100%" });//头像
        $('.mid_right_top p').eq(0).html(player[2].name)//用户名
        $('.mid_right_top p').eq(1).html(player[2].gold + '<img src="../images/money.png"></img>' );
    } else {
        $('.mid_left_photo').css({ "background": "url(" + player[0].img + ")", "background-size": "100% 100%" });//头像
        $('.mid_left_top span').html(player[0].name)//用户名
        $('.mid_left_top p').html('<img src="../images/money.png"></img>' + player_0);//余额

        $('.mid_among_photo').css({ "background": "url(" + player[1].img + ")", "background-size": "100% 100%" });//头像
        $('.information span').html(player[1].name)//用户名
        $('.information p').html('<img src="../images/money.png"></img>' + player_1);//余额

        $('.mid_right_photo').css({ "background": "url(" + player[2].img + ")", "background-size": "100% 100%" });//头像
        $('.mid_right_top p').eq(0).html(player[2].name)//用户名
        $('.mid_right_top p').eq(1).html(player_2 + '<img src="../images/money.png"></img>');//余额
    }
    

    // 初始化牌组
    // 初始牌组HTML代码
    let poker_html = '';
    for (let i = 0; i < 54; i++) {
        poker_html += '<li class="back" style="top:' + i*0.5 + 'px"></li>';   // 通过循环得到牌组的HTML代码
    }
    $(".all_poker").html(poker_html); // 把牌组的HTML代码放入页面对应的元素中

    //初始牌组数据
    let all_poker = [];
    for (let i = 1; i <= 13; i++) {
        for (let j = 0; j < 4; j++) {
            all_poker.push({ num: i, color: j });
        }
    }
    all_poker.push({ num: 14, color: 0 });
    all_poker.push({ num: 14, color: 1 });


    //游戏人物上下跳动的动画
    personAnimate();

    //调用洗牌函数
    clearPoker();

    // 洗牌动画函数
    function clearPoker() {
        //洗牌动画
        let $lis = $(".back");
        //旋转角度
        let pear = 360 / 53;
        //左右随机移动
        for (let i = 0; i < 2; i++) {
            $.each($lis, (index, item) => {
                let random = Math.round(Math.random())
                let direction = 'left';
                if (random === 1) {
                    $(item).animate({
                        right: "300px"
                    }, index * 20).animate({
                        right: '0px'
                    }, index * 2 * 20)
                } else {
                    $(item).animate({
                        left: "300px"
                    }, index * 20).animate({
                        left: '0px'
                    }, index * 2 * 20)
                }
            })
        }
        //旋转动画
        setTimeout(()=>{
            $.each($lis, (index, item) => {
                $(item).css({
                    transform: `rotateZ(${index*pear}deg) scale(0.8)`,
                    "transition": 'ease-in-out 2s',
                })
            })
            setTimeout(() => {
                $.each($lis, (index, item) => {
                    $(item).css({
                        transform: `rotateZ(360deg) scale(0.8)`,
                        "transition": 'ease-in-out 2s',
                    })
                })
            }, 2100)
        },6500)     
        //调用发牌函数
        setTimeout(() => {
            dealPoker();
        }, 12000);  
    }

    // dealPoker();
    // 发牌的动画
    function dealPoker( ) { 
        let num = 0;            //用于计算发牌次数
        let poker_html = '';

        //重新生成牌组，原因:animate在transition属性无效果且transition想不到办法删除
        $('.all_poker').html('');
        let html = '';
        for (let i = 0; i < 54; i++) {
            html += '<li class="back" style="top:' + i*0.5 + 'px"></li>';   // 通过循环得到牌组的HTML代码
        }
        $(".all_poker").html(html); // 把牌组的HTML代码放入

        //把初始牌组数据的顺序打乱
        for (let i = 0; i < 5; i++) {
            all_poker.sort(function (x, y) {
                return Math.random() - 0.5;
            })
        }
       
        go();
        function go() {
            //给左边玩家发牌
            $('.all_poker li:last').animate({left: "-300px", top: "200px"}, 200, function () {
                $(".all_poker li:last").remove();
                player[0].poker.push(all_poker.pop());
                poker_html = makePoker(player[0].poker[player[0].poker.length - 1]);                //生成对应数据的牌页面
                $(".play_1").append(poker_html);
                $(".play_1  li:last").css({top:num*19-38 + 'px',"transform":"rotate(90deg) scale(0.8)"});
                

                //给中间玩家发牌
                $('.all_poker li:last').animate({ top: "400px" }, 200, function () {
                    $(".all_poker li:last").remove();
                    player[1].poker.push(all_poker.pop());
                    poker_html = makePoker(player[1].poker[player[1].poker.length - 1]);           //生成对应数据的牌面
                    $(".play_2").append(poker_html);
                    $(".play_2 li:last").css({left:num*25 + 'px'});


                    //给右边玩家发牌
                    $('.all_poker li:last').animate({ left: "-300px", top: "200px" }, 200, function () {
                        $(".all_poker li:last").remove();
                        player[2].poker.push(all_poker.pop());
                        poker_html = makePoker(player[2].poker[player[2].poker.length - 1]);                //生成对应数据的牌页面
                        $(".play_3").append(poker_html);
                        $(".play_3 li:last").css({top:num*19-38 + 'px',"transform":"rotate(-90deg) scale(0.8)"})
                        

                        if (++num <= 16) {
                            go();
                        }else{
                            //把所有玩家的手牌排序
                            sortPoker(player[0].poker);
                            sortPoker(player[1].poker);
                            sortPoker(player[2].poker);
                            

                            setTimeout(() => {
                                //重新生成牌背
                                $(".play_1 li").css({"background":"url(../images/14.png)","background-repeat": "no-repeat","background-position-x": "-66px","background-position-y": "-187px"});                
                                $(".play_2 li").css({"background":"url(../images/14.png)","background-repeat": "no-repeat","background-position-x": "-66px","background-position-y": "-187px"});
                                $(".play_3 li").css({"background":"url(../images/14.png)","background-repeat": "no-repeat","background-position-x": "-66px","background-position-y": "-187px"});
                                
                                //生成排序之后的牌面
                                setTimeout(() => {
                                    $('.play_1 li').remove();
                                    $('.play_2 li').remove();
                                    $('.play_3 li').remove();

                                    //按已经排序好的数据生成牌面
                                    for(let i = 0; i < player[1].poker.length; i++){
                                        $('.play_1').append(makePoker(player[0].poker[i]));
                                        $(".play_1  li:last").css({top:i*19-38 + 'px',"transform":"rotate(90deg) scale(0.8)"});

                                        $('.play_2').append(makePoker(player[1].poker[i]));
                                        $(".play_2 li:last").css({left:i*25 + 'px'});

                                        $('.play_3').append(makePoker(player[2].poker[i]));
                                        $(".play_3 li:last").css({top:i*19-38 + 'px',"transform":"rotate(-90deg) scale(0.8)","z-index":17-i})
                                    }
                                    getBoss();
                                }, 1000);
                            }, 500);
                        }
                    });
                });
            });  
        }
    }

    // 抢地主函数
    let flag=0;
    function getBoss(get, num, get_data){
        // 设置参数的默认值
        if(get == undefined){
            // 随机点名一个玩家开始抢地主
            get = Math.floor(Math.random()*3)
        }
        num =  num == undefined? 0: num;
        get_data = get_data == undefined? [null, null, null]: get_data;
        
        // 如果当前玩家已经不抢地主了，所以跳过他再下一个去抢地主
        if(get_data[get] === 0){
            get = ++get > 3 ?0: get;
            getBoss(get, num, get_data);
            return false;
        }

        // 可以通过num的值来判断第已经选择了几次
        if(num == 3&&flag==0){
            // 如果三个玩家都不抢地主的情况
            if(get_data[0] == get_data[1] && get_data[1] == get_data[2] ){
                if(get_data[0] == 0){
                    alert("本局无人抢地主，流局！！")
                    window.location.href = window.location.href;
                }
                else{
                    flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }
            }
            else{
                if(get_data[0] == 1 && get_data[1] == 0 && get_data[2] == 0){
                    setBoss(0)
                }else if(get_data[0] == 0 && get_data[1] == 1 && get_data[2] == 0){
                    setBoss(1)
                }else if(get_data[0] == 0 && get_data[1] == 0 && get_data[2] == 1){
                    setBoss(2)
                }else if(get_data[0] == 1 && get_data[1] == 1 && get_data[2] == 0){
                    flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }else if(get_data[0] == 1 && get_data[1] == 0 && get_data[2] == 1){
                   flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }else if(get_data[0] == 0 && get_data[1] == 1 && get_data[2] == 1){
                   flag=1;
                    getBoss(get, num, get_data);
                    return false;
                }
            }
        }
        else{
            
            // 所有的组件先隐藏
            $(".get_boss").hide();

            // 把对应选择权的玩家的组件显示
            $(".get_boss").eq(get).show()

            //抢地主与不抢地主的css效果
            get_boss_animate(get);
            
            // 解绑事件
            $(".get_boss .get").off()       // 把目标 元素上的所有事件解除
            $(".get_boss .cancel").off()

            // 动态绑定抢地主跟不抢的事件
            $(".get_boss").eq(get).find(".get").on("click",()=>{
                //抢地主音效   
                $("#bgms").attr('src', '../audios/yes.mp3');

                // alert("抢地主")
                get_data[get] = 1;      // 设置当前玩的选择
                num++;
                // 如果当前玩家抢地主是第四轮抢的话就肯定能抢到地主了
                if(num == 4){
                    setBoss(get);
                    return;
                }
                get = ++get > 2 ?0: get;
                getBoss(get, num, get_data)
            })

            $(".get_boss").eq(get).find(".cancel").on("click",()=>{
                //不抢音效
                $("#bgms").attr('src', '../audios/no.mp3')

                // alert("不抢")
                get_data[get] = 0;      // 设置当前玩的选择
                num++
                let boss;
                // 第四次选择不抢的话也肯得到谁是地主了
                if(num == 4){
                    let pre_get = get-1 < 0? 2: get-1;
                    if(get_data[pre_get] == 1){
                        boss = pre_get;
                    }else{
                        boss = pre_get-1 <0? 2: pre_get-1;
                    }
                    setBoss(boss)
                }else{
                    get = ++get > 2 ?0: get;
                    getBoss(get, num, get_data);
                }
            })
        }
    }
    
    // 设置当前哪个玩家为地主的函数
    function setBoss(boss) {
        // 隐藏与解绑所有抢地主相关的元素
        $('.get_boss').hide();
        $('.get_boss .get').off();
        $('.get_boss .cancel').off();

        // 设置当前地主玩家
        gameData.boss = boss;

        bigBox =  boss;

        /* 把桌面的三张牌使用动画方法翻开 */
        $('.all_poker li').eq(0).animate({ "left": "-200px" })
        $('.all_poker li').eq(1).animate({ "left": "200px" }, () => {
            // 最后三张牌的数据放到地主玩家挡手牌中
            player[gameData.boss].poker.push(all_poker[0], all_poker[1], all_poker[2])
            sortPoker(player[gameData.boss].poker);
            // 动画与页面
            $('.all_poker li').remove()
            for (let i = 0; i < all_poker.length; i++) {
                $('.all_poker').append(makePoker(all_poker[i]))
                if (i == 0) {
                    $('.all_poker li:last').css({ left: "-200px" ,transform:'scale(0.7)'})
                } else if (i == 2) {
                    $('.all_poker li:last').css({ left: "200px" ,transform:'scale(0.7)'})
                }
            }
            $('.all_poker li').eq(1).css({ transform:'scale(0.7)'})

            $('.all_poker li').animate({ top: "0px" }, 300)
            
            //地主动画
            box_aniamtion(boss);

            // 玩家重新排序手牌的动画
            //$(".play_"+(boss+1)).find("li").remove()
            if (boss == 0) {
                for (let i = 0; i < player[boss].poker.length; i++) {
                    $(".play_" + (boss + 1)).append('<li class="back" style="top:' + i * 20 + 'px"></li>')
                }
                setTimeout(() => {
                    $(".play_" + (boss + 1)).find("li").remove()
                    for (let i = 0; i < player[boss].poker.length; i++) {
                        $(".play_" + (boss + 1)).append(makePoker(player[0].poker[i]));
                        $(".play_" + (boss + 1) + ' li:last').css({ top: i * 19 - 38 + 'px', "transform": "rotate(90deg) scale(0.8)" });
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    setTimeout(() => {
                        playPoker(0)
                    }, 3400);
                }, 500)
            } else if (boss == 1) {
                for (let i = 0; i < player[boss].poker.length; i++) {
                    $(".play_" + (boss + 1)).append('<li class="back" style="left:' + i * 18 + 'px"></li>')
                }
                setTimeout(() => {
                    $(".play_" + (boss + 1)).find("li").remove()
                    for (let i = 0; i < player[boss].poker.length; i++) {
                        $(".play_" + (boss + 1)).append(makePoker(player[1].poker[i]));
                        $(".play_" + (boss + 1) + ' li:last').css({ left: i * 25 + 'px' });
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    setTimeout(() => {
                        playPoker(0)
                    }, 3400);
                }, 500)
            } else if (boss == 2) {
                for (let i = 0; i < player[boss].poker.length; i++) {
                    $(".play_" + (boss + 1)).append('<li class="back" style="top:' + i * 30 + 'px"></li>')
                }
                setTimeout(() => {
                    $(".play_" + (boss + 1)).find("li").remove()
                    for (let i = 0; i < player[boss].poker.length; i++) {
                        $(".play_" + (boss + 1)).append(makePoker(player[2].poker[i]));
                        $(".play_" + (boss + 1) + ' li:last').css({top:i*19-38 + 'px',"transform":"rotate(-90deg) scale(0.8)","z-index":17-i})
                    }
                    // 调用出牌阶段方法
                    gameData.play = boss;       // 设置当前出牌的玩家
                    setTimeout(() => {
                        playPoker(0)
                    }, 3400);

                }, 500)
            }
        })
    }

    
    // 出牌阶段
    function playPoker(pass) {
        let f;
        //更改鼠标的样式
        $('.play_1 li').css({"cursor": "pointer"});
        $('.play_2 li').css({"cursor": "pointer"});
        $('.play_3 li').css({"cursor": "pointer"});

        //隐藏所有玩家的出牌组件
        $('.play_btn').hide();

        //显示当前玩家出牌的组件
        $('.play_btn').eq(gameData.play).show();

        //调用限时出牌的数字和闹钟的函数
        time_limit_animate(pass);
          
        //出牌、提示、过牌的css效果
        play_btn_animate(gameData.play);

        //点击事件
        $('.play_' + (gameData.play + 1) + ' li').click(function(){
            $("#bgms").attr('src', '../audios/click.mp3')
        })

        // 解绑事件
        $('.play_btn').eq(gameData.play).off()       // 把目标 元素上的所有事件解除

        //选牌事件的解除
        if((gameData.play+1) == 1){
            $($('.play_' + (gameData.play + 3) + ' li')).off();
        }else{
            $($('.play_' + (gameData.play) + ' li')).off();
        }
        
        //通过pass值判断，如果值等于2，相当于有两位玩家跳过出牌，这时桌面牌应该清空
        if(pass == 2){
            gameData.desktop.type = 0;
            gameData.desktop.poker = [];
            gameData.desktop.max = 0;
        }
         
        // 绑定选牌事件
        $($('.play_' + (gameData.play + 1) + ' li')).on('click', function () {
            //判断当前元素是否有被选中的样式判断该元素
            if ($(this).hasClass("on")) {
                let poker = {};
                //去掉被选中的样式
                $(this).removeClass("on");
                //把选中的牌的数据放入牌组数据中
                poker.num = $(this).attr("data-num");
                poker.color = $(this).attr("data-color");

                //通过循环得到选中元素的下标
                for (let i = 0; i < gameData.select.poker.length; i++) {
                    if (gameData.select.poker[i].num == poker.num && gameData.select.poker[i].color == poker.color) {              //对象不能直接进行比较相等的
                        gameData.select.poker.splice(i, 1);           //通过下标删除数组中对应的元素
                        break;
                    }
                }
            } else {
                let poker = {};
                //把选中的牌变为选中的样式
                $(this).addClass("on");
                //把选中的牌的数据放入牌组数据中
                poker.num = $(this).attr("data-num");
                poker.color = $(this).attr("data-color");
                gameData.select.poker.push(poker);
            }

        })

        // 绑定出牌事件
        $(".play_btn").eq(gameData.play).on("click", '.play', function () {

            //检查出的牌是否符合规则
            if (!checkPoker(gameData.select)) {
                $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您选择的牌不符合规则</span></div>');
                $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                    $('.upperBox .specialBox').remove();
                })
               
            } else {
                //判断手牌能不能打出
               
                if( checkVS() ){
                    
                    //清除限时数字
                    $('.clockBox').eq(gameData.play).css({display : 'none'});
                    $('.times').eq(gameData.play).html('');
                    clearInterval(timeLimit.animate);
                    clearInterval(timeLimit.clockAnimate);

                    //将牌放到牌桌上面
                    let numbers = gameData.select.poker;
                    $(".upper").html('');
                    for(let i = 0;i < numbers.length ; i++){
                        $(".upper").append(makePoker(gameData.select.poker[i]));
                        $(".upper li:last").css({left : i*25+'px','position':'absolute'});
                    }
                    

                    //判断加倍
                    if (gameData.select.type == 4) {
                        // alert("我加倍了")
                        gameData.multiple *= 2;             //如果是普通炸弹就加两倍
                    } else if (gameData.select.type == 888) {
                        // alert("我加倍了，加双倍")
                        gameData.multiple *= 4;             //如果是王炸就加4倍
                    }
                    
                    //删除玩家手牌对应的出牌数据
                    /*
                        select => [{num:1,color:2},{num:1,color:3}]
                        play => [{num:1,color:2},{num:1,color:3},{num:1,color:3}]

                        需要注意在循环遍历时，有可能遍历的数组会发生变化，如果有这样的需要小心处理
                        1、尽可能不要直接在遍历时进行变化
                        2、或者等遍历之后再进行处理
                        3、需要变的值可以通过临时变量来赋值等操作来完成
                     */

                    for(let i = 0; i < gameData.select.poker.length; i++){
                        for(let j = 0; j < player[gameData.play].poker.length; j++){
                            if(gameData.select.poker[i].num == player[gameData.play].poker[j].num &&
                                gameData.select.poker[i].color == player[gameData.play].poker[j].color){
                                    player[gameData.play].poker.splice(j, 1);
                                    break;
                            }
                        }
                    }

                    //删除用户手中的牌，并重新生成新的牌组及发牌动画
                    Licensing(gameData.play);
                    
                    //玩家手牌数据删除后，有可能玩家手里已经没有牌了，所有每一次出牌都应该进行本局游戏的胜负
                    if(player[gameData.play].poker.length == 0){
                        //进入结算阶段
                        //调用结算
                        gameClose();
                        return false;
                    }

                    //如果能打出的话，首选需要把手牌的数据替换掉桌面的数据
                    gameData.desktop.type = gameData.select.type;
                    gameData.desktop.max = gameData.select.max;
                    
                    //由于数组也是引用赋值，所有数组的拷贝需要使用循环进行遍历
                    gameData.desktop.poker = [];
                    for(let i = 0; i < gameData.select.poker.length; i++){
                        gameData.desktop.poker[i] = {}
                        gameData.desktop.poker[i].num = gameData.select.poker[i].num;
                        gameData.desktop.poker[i].color = gameData.select.poker[i].color;
                    }

                    //选中的牌组数据清空
                    gameData.select.type = 0;
                    gameData.select.poker = [];
                    gameData.select.max = 0;

                    gameData.play = ++gameData.play>2? 0:gameData.play;         //设置下一个出牌的玩家

                    //特殊牌型的动画的函数,为0说明没有执行特殊牌型的动画，为1则执行了特殊牌型的动画，此时需要特殊牌型的动画加载完之后，才能执行下一步；否则按照正常流程执行。
                    
                    //判断用户手上是否有一张
                    specialPokerAnimate(gameData.desktop.type);

                }else{   
                    $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您选择的牌不符合规则</span></div>');
                    $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                        $('.upperBox .specialBox').remove();
                    })
                }
            }
        })

        // 绑定过牌事件
        $(".play_btn").eq(gameData.play).on("click", '.cancel', function () {
            //使用自调函数让下一个玩家出牌
            if(gameData.desktop.type == 0){
                $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您必须出牌</span></div>');
                $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                    $('.upperBox .specialBox').remove();
                })
            }else {
                 //过牌音效
                 $("#bgms").attr('src', '../audios/pass.mp3');

                // alert("过");
                //清除选牌样式
                clearInterval(timeLimit.animate);
                clearInterval(timeLimit.clockAnimate);
                $('.clockBox').eq(gameData.play).css({display : 'none'});

                $($('.play_' + (gameData.play + 1) + ' li')).removeClass("on");

                //清除选中牌的样式
                gameData.select.type = 0;
                gameData.select.poker = [];
                gameData.select.max = 0;

                gameData.play = ++gameData.play>2? 0:gameData.play;         //设置下一个玩家出牌

                playPoker(++pass);
            }
        })

        //绑定提示事件
        $(".play_btn").eq(gameData.play).on("click", '.tips', function () {
            console.log(player[gameData.play].poker);
            let temp = player[gameData.play].poker;
            let renum = [];
            let sum;
            let n = 0;
            for (let i = 0; i < temp.length; i = i + sum) {
                sum = 0;
                for (let j = 0; j < temp.length; j++) {
                    if (temp[i].num == temp[j].num) {
                        sum++;
                    }
                }
                renum[n++] = { num: temp[i].num, count: sum };
            }
            console.log(renum);
            let pokerd = gameData.desktop.poker;
            switch (pokerd.length) {
                /*一张牌的提示 */
                case 1:
                    {
                        let test = 1;
                        console.log("1");
                        for (let i = 0; i < renum.length; i++) {
                            if (renum[i].count == 1) {
                                if (renum[i].num > pokerd[0].num) {
                                    console.log(renum[i]);
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        //把选中的牌变为选中的样式
                                        if (renum[i].num == temp[c].num) {
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                        return;
                    }
                case 2:
                    {
                        console.log("2");
                        let test = 1;
                        for (let i = 0; i < renum.length; i++) {
                            if (renum[i].count == 2) {
                                if (renum[i].num > pokerd[0].num) {
                                    console.log(renum[i]);
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        //把选中的牌变为选中的样式
                                        if (renum[i].num == temp[c].num) {
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                        return;
                    }
                case 3:
                    {
                        console.log("3");
                        let test = 1;
                        for (let i = 0; i < renum.length; i++) {
                            if (renum[i].count == 3) {
                                if (renum[i].num > pokerd[0].num) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        //把选中的牌变为选中的样式
                                        if (renum[i].num == temp[c].num) {
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }
                                    }
                                    return;
                                }
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                        return;
                    }
                case 4:
                    {
                        console.log("4");
                        let test = 1;
                        if (pokerd[0].num * 1 == pokerd[3].num * 1) {
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    if (renum[i].num > pokerd[0].num) {
                                        for (let c = 0; c < temp.length; c++) {
                                            let poker = {};
                                            //把选中的牌变为选中的样式
                                            if (renum[i].num == temp[c].num) {
                                                $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                //把选中的牌的数据放入牌组数据中
                                                poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                gameData.select.poker.push(poker);
                                                test = 0;
                                            }
                                        }
                                        return;
                                    }
                                }
                            }
                            return;
                        }
                        else {
                            console.log("三带一");
                            let newnum = [];
                            let w = 0;
                            for (let i = 0; i < renum.length; i++) {
                                if (w == 0) {
                                    if (renum[i].count == 3) {
                                        if (renum[i].num > pokerd[1].num) {
                                            console.log(renum[i].num);
                                            newnum[0] = { num: renum[i].num };
                                            let m = 1;
                                            for (let j = 0; j < renum.length; j++) {
                                                if (renum[j].count == 1) {
                                                    console.log(renum[j].num);
                                                    console.log(w);
                                                    newnum[1] = { num: renum[j].num };
                                                    m = 0;
                                                    w = 1;
                                                    break;
                                                }
                                            }
                                            if (m) {
                                                for (let j = 0; j < renum.length; j++) {
                                                    if (renum[j].count == 2) {
                                                        newnum[1] = { num: renum[j].num };
                                                        w = 1;
                                                        break;
                                                    }
                                                }
                                            }
                                            for (let c = 0; c < temp.length; c++) {
                                                let poker = {};
                                                //把选中的牌变为选中的样式
                                                console.log(newnum);
                                                for (let x = 0; x < newnum.length; x++) {
                                                    if (newnum[x].num == temp[c].num) {
                                                        $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                        //把选中的牌的数据放入牌组数据中
                                                        poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                        poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                        gameData.select.poker.push(poker);
                                                        test = 0;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                            }

                            if (test) {
                                $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                                $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                    $('.upperBox .specialBox').remove();
                                })
                                let t = 1;
                                for (let i = 0; i < renum.length; i++) {
                                    if (renum[i].count == 4) {
                                        for (let c = 0; c < temp.length; c++) {
                                            let poker = {};
                                            if (renum[i].num == temp[c].num) {

                                                //把选中的牌变为选中的样式
                                                $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                //把选中的牌的数据放入牌组数据中
                                                poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                gameData.select.poker.push(poker);
                                                t = 0;
                                            }
                                        }

                                    }
                                }
                                if (t) {
                                    if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                        for (let c = 0; c < temp.length; c++) {
                                            let poker = {};
                                            if (renum[renum.length - 1].num == temp[c].num) {
                                                //把选中的牌变为选中的样式
                                                $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                //把选中的牌的数据放入牌组数据中
                                                poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                gameData.select.poker.push(poker);
                                            }

                                        }

                                    }
                                }
                            }
                            return;
                        }
                    }
                case 5:
                    {
                        //三带2
                        console.log("5");
                        let test = 1;
                        let w = 0;
                        let newnum = [];
                        if ((pokerd[0].num == pokerd[2].num && pokerd[3].num == pokerd[4].num) || (pokerd[0].num == pokerd[1].num && pokerd[2].num == pokerd[4].num)) {
                            console.log("三带二");
                            let y;
                            if (pokerd[0].num == pokerd[2].num && pokerd[3].num == pokerd[4].num) {
                                y = 0;
                            } else {
                                y = 2;
                            }
                            for (let i = 0; i < renum.length; i++) {
                                if (w == 0) {
                                    if (renum[i].count == 3) {
                                        if (renum[i].num > pokerd[y].num) {
                                            console.log(renum[i].num);
                                            newnum[0] = { num: renum[i].num };
                                            for (let j = renum.length - 1; j >= 0; j--) {
                                                if (renum[j].count == 2) {
                                                    console.log(w);
                                                    console.log(renum[j].num);
                                                    newnum[1] = { num: renum[j].num };
                                                    w = 1;
                                                }
                                            }
                                        }
                                        for (let c = 0; c < temp.length; c++) {
                                            let poker = {};
                                            //把选中的牌变为选中的样式
                                            console.log(newnum);
                                            for (let x = 0; x < newnum.length; x++) {
                                                if (newnum[x].num == temp[c].num) {
                                                    $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                    //把选中的牌的数据放入牌组数据中
                                                    poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                    poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                    gameData.select.poker.push(poker);
                                                    test = 0;
                                                }
                                            }

                                        }
                                    }
                                }
                            }
                            break;
                        }
                        else {
                            //顺子
                            let shun = [];
                            let f = 0;
                            for (let i = 0; i < renum.length; i++) {
                                let shunup = [];
                                let k = 0;
                                if (pokerd[0].num < renum[i].num) {
                                    for (let j = i; j < renum.length; j++) {
                                        if (k == 5) {
                                            break;
                                        }
                                        else if (k < 5 && renum[j].num * 1 < 13) {
                                            shunup[k++] = renum[j].num;
                                        }

                                    }
                                    if (shunup.length == 5 && shunup[0] + 4 == shunup[4]) {
                                        f = 1;
                                        shun = shunup;
                                        break;
                                    }
                                }

                            }
                            if (f) {
                                let newshun = [];
                                for (let x = 0; x < shun.length; x++) {
                                    for (let c = 0; c < temp.length; c++) {
                                        if (shun[x] == temp[c].num) {
                                            newshun[x] = { num: temp[c].num };
                                        }
                                    }
                                }
                                for (let x = 0; x < newshun.length; x++) {
                                    let poker = {};
                                    //把选中的牌变为选中的样式
                                    let tempnum = "";
                                    for (let c = 0; c < temp.length; c++) {
                                        if (newshun[x].num == temp[c].num && tempnum != temp[c].num) {
                                            tempnum = temp[c].num;
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }

                                    }
                                    console.log(poker);
                                }
                            }

                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                        return;
                    }


                case 6:
                    {
                        console.log("6");
                        let test = 1;
                        if (pokerd[0].num * 1 + 5 == pokerd[5].num * 1) {
                            console.log("顺子");
                            let shun = [];
                            let f = 0;
                            for (let i = 0; i < renum.length; i++) {
                                let shunup = [];
                                let k = 0;
                                if (pokerd[0].num < renum[i].num) {
                                    for (let j = i; j < renum.length; j++) {
                                        if (k == 6) {
                                            break;
                                        }
                                        else if (k < 6 && renum[j].num * 1 < 13) {
                                            shunup[k++] = renum[j].num;
                                        }

                                    }
                                    if (shunup.length == 6 && shunup[0] + 5 == shunup[5]) {
                                        f = 1;
                                        shun = shunup;
                                        break;
                                    }
                                }

                            }
                            if (f) {
                                let newshun = [];
                                for (let x = 0; x < shun.length; x++) {
                                    for (let c = 0; c < temp.length; c++) {
                                        if (shun[x] == temp[c].num) {
                                            newshun[x] = { num: temp[c].num };
                                        }
                                    }
                                }
                                for (let x = 0; x < newshun.length; x++) {
                                    let poker = {};
                                    //把选中的牌变为选中的样式
                                    let tempnum = "";
                                    for (let c = 0; c < temp.length; c++) {
                                        if (newshun[x].num == temp[c].num && tempnum != temp[c].num) {
                                            tempnum = temp[c].num;
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }

                                    }
                                }
                            }
                            //四带二
                            else if ((pokerd[0].num == pokerd[3].num && pokerd[4].num == pokerd[5].num) || (pokerd[0].num == pokerd[1].num && pokerd[2].num == pokerd[5].num)) {
                                console.log("四带二");
                                let newnum = [];
                                let y;
                                if (pokerd[0].num == pokerd[2].num && pokerd[3].num == pokerd[4].num) {
                                    y = 0;
                                } else {
                                    y = 2;
                                }
                                for (let i = 0; i < renum.length; i++) {
                                    if (renum[i].count == 4) {
                                        if (renum[i].num > pokerd[y].num) {
                                            console.log(renum[i].num);
                                            newnum[0] = { num: renum[i].num };
                                            for (let j = 0; j < renum.length; j++) {
                                                if (renum[j].count == 2) {
                                                    console.log(renum[j].num);
                                                    newnum[1] = { num: renum[j].num };
                                                    break;
                                                }
                                            }
                                            for (let c = 0; c < temp.length; c++) {
                                                let poker = {};
                                                //把选中的牌变为选中的样式
                                                console.log(newnum);
                                                for (let x = 0; x < newnum.length; x++) {
                                                    if (newnum[x].num == temp[c].num) {
                                                        $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                        //把选中的牌的数据放入牌组数据中
                                                        poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                        poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                        gameData.select.poker.push(poker);
                                                        test = 0;
                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        //连对
                        else if (pokerd[0].num == pokerd[1].num && pokerd[2].num == pokerd[3].num && pokerd[4].num == pokerd[5].num && pokerd[0].num * 1 + 1 == pokerd[2].num * 1 && pokerd[2].num * 1 + 1 == pokerd[4].num * 1) {
                            console.log("连对");
                            let newnum = [];
                            let w = 0;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 2) {
                                    if (w == 0) {
                                        if (renum[i].num > pokerd[0].num) {
                                            console.log(renum[i].num);
                                            newnum[0] = { num: renum[i].num };
                                            for (let j = i; j < renum.length; j++) {
                                                if (renum[j].count == 2 && renum[i].num * 1 + 1 == renum[j].num * 1) {
                                                    console.log(renum[j].num);
                                                    newnum[1] = { num: renum[j].num };
                                                    for (let a = j; a < renum.length; a++) {
                                                        if (renum[a].count == 2 && renum[j].num * 1 + 1 == renum[a].num * 1) {
                                                            console.log(renum[a].num);
                                                            newnum[2] = { num: renum[a].num };
                                                            w = 1;
                                                        }
                                                    }
                                                }
                                            }
                                            for (let c = 0; c < temp.length; c++) {
                                                let poker = {};
                                                //把选中的牌变为选中的样式
                                                console.log(newnum);
                                                for (let x = 0; x < newnum.length; x++) {
                                                    if (newnum[x].num == temp[c].num) {
                                                        $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                                        //把选中的牌的数据放入牌组数据中
                                                        poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                                        poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                                        gameData.select.poker.push(poker);
                                                        test = 0;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                        return;
                    }
                case 7:
                    {
                        console.log("7");
                        let test = 1;
                        if (pokerd[0].num * 1 + 6 == pokerd[6].num * 1) {
                            console.log("顺子");
                            let shun = [];
                            let f = 0;
                            for (let i = 0; i < renum.length; i++) {
                                let shunup = [];
                                let k = 0;
                                if (pokerd[0].num < renum[i].num) {
                                    for (let j = i; j < renum.length; j++) {
                                        if (k == 7) {
                                            break;
                                        }
                                        else if (k < 7 && renum[j].num * 1 < 13) {
                                            shunup[k++] = renum[j].num;
                                        }

                                    }
                                    if (shunup.length == 6 && shunup[0] + 6 == shunup[6]) {
                                        f = 1;
                                        shun = shunup;
                                        break;
                                    }
                                }

                            }
                            if (f) {
                                let newshun = [];
                                for (let x = 0; x < shun.length; x++) {
                                    for (let c = 0; c < temp.length; c++) {
                                        if (shun[x] == temp[c].num) {
                                            newshun[x] = { num: temp[c].num };
                                        }
                                    }
                                }
                                for (let x = 0; x < newshun.length; x++) {
                                    let poker = {};
                                    //把选中的牌变为选中的样式
                                    let tempnum = "";
                                    for (let c = 0; c < temp.length; c++) {
                                        if (newshun[x].num == temp[c].num && tempnum != temp[c].num) {
                                            tempnum = temp[c].num;
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }

                                    }
                                }

                                return;
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }

                                    }

                                }
                            }
                        }
                    }
                case 8:
                    {
                        console.log("8");
                        let test = 1;
                        if (pokerd[0].num * 1 + 6 == pokerd[6].num * 1) {
                            console.log("顺子");
                            let shun = [];
                            let f = 0;
                            for (let i = 0; i < renum.length; i++) {
                                let shunup = [];
                                let k = 0;
                                if (pokerd[0].num < renum[i].num) {
                                    for (let j = i; j < renum.length; j++) {
                                        if (k == 7) {
                                            break;
                                        }
                                        else if (k < 7 && renum[j].num * 1 < 13) {
                                            shunup[k++] = renum[j].num;
                                        }

                                    }
                                    if (shunup.length == 6 && shunup[0] + 6 == shunup[6]) {
                                        f = 1;
                                        shun = shunup;
                                        break;
                                    }
                                }

                            }
                            if (f) {
                                let newshun = [];
                                for (let x = 0; x < shun.length; x++) {
                                    for (let c = 0; c < temp.length; c++) {
                                        if (shun[x] == temp[c].num) {
                                            newshun[x] = { num: temp[c].num };
                                        }
                                    }
                                }
                                for (let x = 0; x < newshun.length; x++) {
                                    let poker = {};
                                    //把选中的牌变为选中的样式
                                    let tempnum = "";
                                    for (let c = 0; c < temp.length; c++) {
                                        if (newshun[x].num == temp[c].num && tempnum != temp[c].num) {
                                            tempnum = temp[c].num;
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            test = 0;
                                        }

                                    }
                                }
                                console.log("没有牌可出");
                                return;
                            }
                        }
                        if (test) {
                            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您没有比其他玩家大的牌</span></div>');
                            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                                $('.upperBox .specialBox').remove();
                            })
                            let t = 1;
                            for (let i = 0; i < renum.length; i++) {
                                if (renum[i].count == 4) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[i].num == temp[c].num) {

                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                            t = 0;
                                        }
                                    }

                                }
                            }
                            if (t) {
                                if (renum[renum.length - 1].num * 1 == 14 && renum[renum.length - 1].count == 2) {
                                    for (let c = 0; c < temp.length; c++) {
                                        let poker = {};
                                        if (renum[renum.length - 1].num == temp[c].num) {
                                            //把选中的牌变为选中的样式
                                            $('.play_' + (gameData.play + 1) + ' li').eq(c).addClass('on');
                                            //把选中的牌的数据放入牌组数据中
                                            poker.num = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-num");
                                            poker.color = $('.play_' + (gameData.play + 1) + ' li').eq(c).attr("data-color");
                                            gameData.select.poker.push(poker);
                                        }
                                    }
                                }
                            }
                        }
                    }
            }
        })
        
    }

    //限时出牌的数字和闹钟的函数
    function time_limit_animate(pass){
        clearInterval(timeLimit.animate);
        clearInterval(timeLimit.clockAnimate);

        

        $('.clockBox').eq(gameData.play).css({display : 'block'});
        timeLimit.clockAnimate = setInterval(() => {
            if(timeLimit.clockDeg == 22){
                timeLimit.clockFlag = 0;
            }else if (timeLimit.clockDeg == -22){
                timeLimit.clockFlag = 1;
            }
            if(timeLimit.clockFlag == 0){
                timeLimit.clockDeg -= 2;
            }else if( timeLimit.clockFlag == 1){
                timeLimit.clockDeg += 2;
            }            
            $('.clock').eq(gameData.play).css({transform : "rotate("+timeLimit.clockDeg+"deg)"});
        }, 0.05);
            
    
        //限时出牌的判断及动画
        $('.times').eq(gameData.play).html(15);
        timeLimit.time  = 15;
        timeLimit.animate = setInterval(() => {
            timeLimit.time--;
            $('.times').eq(gameData.play).html(timeLimit.time);
            if(timeLimit.time <= 0 && gameData.desktop.type == 0 || timeLimit.time <= 0 && pass ==2){
                clearInterval(timeLimit.animate);
            }else if(timeLimit.time <= 0){
                pass_poker(pass);
            }
        }, 1000);
    }

    //限时出牌的过牌函数
    function pass_poker(pass){
        //使用自调函数让下一个玩家出牌
        if(gameData.desktop.type == 0){
            $('.upperBox').append('<div class="specialBox"><span class="wrongWrod">您必须出牌</span></div>');
            $('.upperBox .specialBox .wrongWrod').animate({opacity:0},2000,function(){
                $('.upperBox .specialBox').remove();
            })
        }else{
            clearInterval(timeLimit.animate);
            clearInterval(timeLimit.clockAnimate);
            $('.clockBox').eq(gameData.play).css({display : 'none'});
            //清除限时数字
            $('.times').eq(gameData.play).html('');

            $($('.play_' + (gameData.play + 1) + ' li')).removeClass("on");

            //清除选中牌的样式
            gameData.select.type = 0;
            gameData.select.poker = [];
            gameData.select.max = 0;

            gameData.play = ++gameData.play>2? 0:gameData.play;         //设置下一个玩家出牌
            playPoker(++pass);
            
        }
    }


    // 结算阶段函数
    function gameClose() {
        let html ='';
        html = `
        <div class="box1">
            <div class="box">
                <div class="box_img"></div>
                <table class="box_table">
                    <tr>
                        <th>胜利</th>
                        <th>昵称</th>
                        <th>角色</th>
                        <th>本场分数</th>
                        <th>倍数</th>
                    </tr>
                    <tr class="user1">
                        <td></td>
                        <td></td>
                        <td>农民</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr class="user2">
                        <td></td>
                        <td></td>
                        <td>农民</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr class="user3">
                        <td></td>
                        <td></td>
                        <td>农民</td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <div class="playAgain">再来一局</div>
                <a href="../html/welcom.html" class="exit">退出游戏</a>
            </div>
        </div>`;
        addConsole();

        //在页面中添加结算的容器
        $('.bg').append(html);
        //遮罩层
        $('.bg').append('<div class="bossMask"></div>');
        $('.bg .bossMask').css({'width': '100%'})        
        $('.box').css({width:(minWidth / 2) +'px',height:(minHeight /2) + 'px'});
        $('.box1').css({left:(minWidth / 5) +'px',top:(minHeight /5 - 35) + 'px'});
       

        $('.bg_music .bamusic').removeClass("play");
        $('.bg_music .bamusic').html('')


        $('.playAgain').click(function(){
            window.location.href = window.location.href;
        })

        $('.playAgain').hover(function(){
            $('.playAgain').css({width:'77px',height:'42px'});
        },function(){
            $('.playAgain').css({width:'73px',height:'38px'});
        })
        

        //当局的分数
        let count = gameData.multiple * 100;

        //本局是地主赢了还是农民赢了
        if (gameData.boss == gameData.play) {
            //地主赢了的音效
            $("#bgms").attr('src', '../audios/win.mp3')

            //除了地主外其他玩家都进行减分
            for (let i = 0; i < 3; i++) {
                if (i != gameData.boss) {
                    player[i].gold -= count / 2;
                }
            }
            //地主玩家加分
            player[gameData.boss].gold += count;
        } else {
            //地主输了的音效
            $("#bgms").attr('src', '../audios/default.mp3')
            //地主玩家减分
            player[gameData.boss].gold -= count;

            for (let i = 0; i < 3; i++) {
                if (i != gameData.boss) {
                    player[i].gold += count / 2;
                }
            }
        }

        //给结算页面赋值
        //角色
        if(bigBox == 0){
            $('.user1 td').eq(2).html('地主');
            //地主胜利
            if(player[0].poker == null){
                document.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }else{
                document.getElementsByTagName('tr')[2].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
                document.getElementsByTagName('tr')[3].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }
        }else if(bigBox == 1){
            $('.user2 td').eq(2).html('地主');
            if(player[1].poker == null){
                document.getElementsByTagName('tr')[2].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }else{
                document.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
                document.getElementsByTagName('tr')[3].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }
        }else if(bigBox == 2){
            $('.user3 td').eq(2).html('地主');
            if(player[2].poker == null){
                document.getElementsByTagName('tr')[3].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }else{
                document.getElementsByTagName('tr')[1].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
                document.getElementsByTagName('tr')[2].getElementsByTagName('td')[0].innerHTML = '<img src="../images/sl.png">';
            }
        }

  
        let whitch ;
        for(let i = 0 ; i < 3 ; i++){
            whitch = document.getElementsByTagName('tr')[i+1].getElementsByTagName('td');
            //昵称
            whitch[1].innerText = player[i].name;
            //分数
            whitch[3].innerText = player[i].gold;
            //加倍
            whitch[4].innerText = gameData.multiple;
        }


        //存值
        localStorage.setItem('巴拉巴拉', player[0].gold);
        localStorage.setItem('库奇', player[1].gold);
        localStorage.setItem('索菲亚', player[2].gold);

        // //获取存的值
        // let player_0 = localStorage.getItem('巴拉巴拉');
        // let player_1 = localStorage.getItem('库奇');
        // let player_2 = localStorage.getItem('索菲亚');

        //修改每个玩家的余额
        $('.mid_left_top p').html('¥' + player[0].gold);                  //1的余额
        $('.information p').html('¥' + player[1].gold);                   //2的余额
        $('.mid_right_top p').eq(1).html('¥' + player[2].gold);           //3的余额

        // //输出存的值
        // $('.mid_left_top p').html('¥'+player_0);
        // $('.information p').html('¥'+player_1);
        // $('.mid_right_top p').eq(1).html('¥'+player_2); 
    }

    //出牌音效及特殊牌型的动画
    function specialPokerAnimate(specialPoker){
        // 1、单张
        // 2、对子
        // 3、三张
        // 4、普炸
        // 5、三带一
        // 6、顺子
        // 7、三带二
        // 8、连对
        // 9、四带二
        // 10、四带两对
        // 777、飞机
        // 888、王炸
        switch(specialPoker){
            case 1:
                //单张
                //此时是连对的动画
                $("#bgms").attr('src', '../audios/play.mp3');
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 2:
                //对子
                $("#bgms").attr('src', '../audios/play.mp3');
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 3:
                //三张
                $("#bgms").attr('src', '../audios/play.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 4:
                //普炸
                $("#bgms").attr('src', '../audios/boom.mp3');
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                //使用自调函数让下一个玩家出牌
                playPoker(0);
                break;
            case 5:
                //三带一
                $("#bgms").attr('src', '../audios/threeAndOne.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 6:
                //顺子
                clearInterval(timeLimit.animate);
                clearInterval(timeLimit.clockAnimate);
                $("#bgms").attr('src', '../audios/straight.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                along();
                break;
            case 7:
                //三带二
                $("#bgms").attr('src', '../audios/threeAndTwo.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 8:
                //连对
                clearInterval(timeLimit.animate);
                clearInterval(timeLimit.clockAnimate);
                $("#bgms").attr('src', '../audios/pairsSome.mp3');
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                companyPair();
                break;
            case 9:
                //四带二
                $("#bgms").attr('src', '../audios/fourAndTwo.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 10:
                //四带两对
                $("#bgms").attr('src', '../audios/play.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                playPoker(0);
                break;
            case 777:
                //飞机
                clearInterval(timeLimit.animate);
                clearInterval(timeLimit.clockAnimate);
                $("#bgms").attr('src', '../audios/plane.mp3');
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                aircraft();
                break;
            case 888:
                //王炸
                //清除，出牌记时功能
                clearInterval(timeLimit.animate);
                clearInterval(timeLimit.clockAnimate);
                //播放音乐
                $("#bgms").attr('src', '../audios/kingBoom.mp3')
                if(ajudg() == 1){
                    $("#bgms").attr('src', '../audios/haveOne.mp3');
                }
                //特殊牌型-王炸的动画效果
                setTimeout(() => {
                    deepFriedA();
                }, 1200);
                break;
        }    
    }

    function ajudg(){
        console.log('gameData.play：'+gameData.play);
        if($('.play_1  li').length <= 1 && gameData.play  == 1){
            return 1;
        }else if($('.play_2  li').length <= 1 && gameData.play  == 2){ 
            return 1;
        }else if($('.play_3  li').length <= 1 && gameData.play  == 3){
            return 1;
        }else{
            return 0
        }
    }

    //连对的动画效果
    function companyPair( ){
        //将显示的按钮设置为不可点击的状态
        $('.play_btn').css({"pointer-events": "none"});
        //给连对动画添加容器
        $('.upperBox').append('<div class="specialBox"><div class="special"></div></div>');
        //连对的css效果
        $('.special').css({'background':'url(../images/lotus.gif)','background-size': '100% 100%','top':'-100%',opacity:0});
        //连对的动画效果

        $('.special').animate({'top': 0 + 'px','opacity':'1'},1000,function(){
            $('.special').animate({'opacity':0},3000,function(){
                //将显示的按钮设置为可点击的状态
                $('.play_btn').css({"pointer-events": "auto"});
                //移除容器
                $('.upperBox .specialBox').remove();
                //下一个玩家出牌
                playPoker(0);
            })
        });
    }

    //王炸的动画效果
    function deepFriedA(){
        $('.play_btn').css({"pointer-events": "none"});

        //在页面中添加，存放王炸特效的容器
        $('.upperBox').append('<div class="specialBox"><div class="special"></div></div>');
        $('.special').css({'background':'url(../images/special/fire.png)','background-size': '100% 100%','transform': 'scale(0)'});
        fire.animate = document.getElementsByClassName('special')[0];
    
        $("#bgms").attr('src', '../audios/fire.mp3')
    
        //放大容器
        fire.timer = setInterval(() => {
            fire.num += 0.1;
            if(fire.num >= 7){
                //让容器逐渐消失
                $('.special').animate({'opacity':0},1000);
                //去除容器
                setTimeout(() => {
                    $('.upperBox .specialBox').remove();
                    $('.play_btn').css({"pointer-events": "auto"});
                    playPoker(0);
                }, 2000);
                clearInterval(fire.timer);
            }
            fire.animate.style.transform = "scale("+fire.num+")";
        }, 0.5);
    }

    //飞机的动画效果
    function aircraft(){
        // console.log('飞机');
        $('.play_btn').css({"pointer-events": "none"});
        $('.bg').append('<div class="planeBox"><img src="../images/person.png" class="charactor1"><img src="../images/character2.png" class="charactor2"><img src="../images/person.png" class="charactor3"><img src="../images/character2.png" class="charactor4"></div>');
        
        $('.planeBox  img').eq(0).animate({left : minWidth + 'px'},1000);
        $('.planeBox  img').eq(1).animate({right : minWidth + 'px'},1000)
        $('.planeBox  img').eq(2).animate({top : minHeight + 'px'},1000);
        $('.planeBox  img').eq(3).animate({bottom : minHeight + 'px'},1000,function(){
            $('.bg .planeBox').animate({opacity:0},1000,function(){
                //删除飞机动画效果的容器
                $('.bg .planeBox').remove();
                 //将显示的按钮设置为可点击的状态
                $('.play_btn').css({"pointer-events": "auto"});
                //下一个玩家出牌
                playPoker(0);
            })
        })
    }

    //顺子的动画
    function  along(){
        //禁止鼠标点击事件
        let color = ['red','yellow','blue','green','palevioletred','orange','peru','white','black','khaki','rosybrown'];
        $('.play_btn').css({"pointer-events": "none"});
        $('.upperBox').append(`<ul class="arrange"><li>顺子</li>
        <li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li><li>顺子</li></ul>`);

        for(let i = 0 ; i <  $('.arrange li').length ; i++){
            $('.arrange li').eq(i).css({'top':20*i+'px',right:i*30+'px',color:color[i]});
        }

        $('.arrange li').eq(0).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(0).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(1).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(1).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(2).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(2).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(3).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(3).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(4).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(4).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(5).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(5).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(6).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(6).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(7).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(7).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(8).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(8).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(9).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(9).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(10).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(10).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
        $('.arrange li').eq(11).animate({'right':'100%'},2000,function(){
            $('.arrange li').eq(11).css({opacity:0});
            $('.arrange').remove();
            //将显示的按钮设置为可点击的状态
            $('.play_btn').css({"pointer-events": "auto"});
            //下一个玩家出牌
            playPoker(0);
        })
    }
})
function addConsole(){
    $('body').append('<div id="divFly" style="position:absolute;"><img src="../images/butterfly.png" class="glowworm"></div>');
    function DivFlying() {
        var div = document.getElementById("divFly");
        if (!div) {
            return;
        }
        var intX = window.event.clientX;
        var intY = window.event.clientY;
        div.style.left = intX + 5 + "px";
        div.style.top = intY + 5 + "px";
    }
    document.onmousemove = DivFlying;
}
