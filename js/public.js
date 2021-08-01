//生成牌面HTML代码函数
function makePoker(poker) {
    let x;
    let y;

    //普通花色坐标数据
    let color = [
        { x: -3, y: -2 },           //黑桃花色坐标
        { x: -3, y: -187 },           //梅花花色坐标
        { x: -137, y: -3 },           //红桃花色坐标
        { x: -140, y: -187 },           //方块花色坐标
    ];

    if (poker.num != 14) {
        x = color[poker.color].x;
        y = color[poker.color].y;
    } else {
        if (poker.color == 0) {
            x = -136;
            y = -2;
        } else {
            x = -3;
            y = -2;
        }
    }
    return '<li data-num="' + poker.num + '" data-color="' + poker.color + '" style="width: 121px; height: 175px; transform:scale(0.80);background: url(../images/' + poker.num + '.png) ' + x + 'px ' + y + 'px;"></li>';
}

//牌组数据排序,从大到小
function sortPoker(poker_data) {
    poker_data.sort(function (x, y) {
        if (x.num != y.num) {
            return x.num - y.num;           //如果点数不同就按点数排序
        } else {
            return y.color - x.color;       //如果点数相同就按花色排序
        }
    });
}

//检查牌组的函数
/*
    牌型分类
    1、单张
    2、对子
    3、三张
    4、普炸
    5、三带一
    6、顺子
    7、三带二
    8、连对
    9、四带二
    10、四带两对
    777、飞机
    888、王炸
 */
function checkPoker(data) {
    let len = data.poker.length;            //用于分析牌组的张数
    sortPoker(data.poker);                  //为了方便牌型判断需要先把选中的牌组数据进行排序

    switch (len) {
        //判断一张牌的情况
        case 1:
            data.type = 1;                  //设置当前选择牌的牌型
            //判断是否为大小王
            if (data.poker[0].num == 14) {
                if (data.poker[0].color == 0) {
                    data.max = 14;
                    return data.max;
                } else {
                    data.max = 15;
                }
            } else {
                data.max = data.poker[0].num;
            }''
            return 1;            //符合规则返回对应的牌型
            break;

        //判断两张牌的情况
        case 2:
            if (data.poker[0].num != data.poker[1].num) {
                return false;
            } else {
                //判断是否是王炸
                if (data.poker[0].num == 14) {
                    data.type = 888;            //设置为王炸
                    data.max = 14;
                } else {
                    data.type = 2;                 //设置为对子
                    data.max = data.poker[0].num;
                }
                return 2;
            }
            break;

        //判断三张牌的情况
        case 3:
            if (data.poker[0].num == data.poker[2].num) {
                data.type = 3;          //设置牌型为3张
                data.max = data.poker[0].num;
                return 3;
            }
            return false;
            break;

        //判断四张牌的情况
        case 4:
            if (data.poker[0].num == data.poker[3].num) {
                data.type = 4;      //设置为普炸
                data.max = data.poker[0].num;
                return 4;
            } else if (data.poker[0].num == data.poker[2].num || data.poker[1].num == data.poker[3].num) {
                data.type = 5;      //设置为三带一
                data.max = data.poker[1].num;
                return 5;
            }
            return false;
            break;

        //判断五张牌的情况
        case 5:
            //判断是否为顺子
            
            if (checkStraight(data.poker)) {
                data.type = 6;          //设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;
                return 6;
            }

            //判断是否为三带二
            if ((data.poker[0].num == data.poker[2].num) && (data.poker[3].num == data.poker[4].num) ||
                (data.poker[0].num == data.poker[1].num) && (data.poker[2].num == data.poker[4].num)) {
                data.type = 7;      //设置牌型为三带二
                data.max = data.poker[2].num;
                return 7;
            }
            return false;
            break;

        //判断六张牌的情况
        case 6:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;              //设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;
                return 6;
            }

            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;          //设置牌型为连对
                data.max = data.poker[data.poker.length - 1].num;
                return 8;
            }

            //判断是否为四带二
            if (data.poker[0].num == data.poker[3].num ||
                data.poker[1].num == data.poker[4].num ||
                data.poker[2].num == data.poker[5].num) {
                data.type = 9;          //设置牌型为四带二
                data.max = data.poker[2].num;
                return 9;
            }

            //判断是否为飞机
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num) {
                data.type = 777;         //设置牌型为飞机
                data.max = data.poker[5].num;
                return 777;
            }
            return false;
            break;

        //判断七张牌的情况
        case 7:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;          //设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;
                return 6;
            }
            return false;
            break;

        //判断八张牌的情况
        case 8:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;          //设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;
                return 6;
            }

            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;          //设置牌型为连对
                data.max = data.poker[data.poker.length - 1].num;
                return 8;
            }

            //判断是否为飞机
            /*
                33344456
                34555666
                34445556
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num ||

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num ||

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num) {
                data.type = 777;            //设置为飞机
                data.max = data.poker[5].num;
                return 777;
            }

            //判断是否为四带两对
            /*
                44445566
                44555566
                44556666
             */
            //第一种情况
            if (data.poker[0].num == data.poker[3].num &&
                data.poker[4].num == data.poker[5].num &&
                data.poker[6].num == data.poker[7].num) {
                data.type = 10;             //设置牌型为四带两对
                data.max = data.poker[0].num;
                return 10;
            }

            //第二种情况
            if (data.poker[2].num == data.poker[5].num &&
                data.poker[0].num == data.poker[1].num &&
                data.poker[6].num == data.poker[7].num) {
                data.type = 10;             //设置牌型为四带两对
                data.max = data.poker[2].num;
                return 10;
            }

            //第三种情况
            if (data.poker[4].num == data.poker[7].num &&
                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num) {
                data.type = 10;             //设置牌型为四带两对
                data.max = data.poker[4].num;
                return 10;
            }

            return false;
            break;

        //九张牌的情况
        case 9:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 6;
            }

            //判断是否为飞机
            /*
                666777888
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[8].num;   // 设置牌型的判断值
                return 777;
            }
            return false;
            break;

        //判断十张牌的情况
        case 10:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 6;
            }

            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }

            //判断是否为飞机
            /*
                5556667788
                5566677788
                5566777888
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[7].num &&
                data.poker[8].num == data.poker[9].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num ||

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[9].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[5].num;   // 设置牌型的判断值
                return 777;
            }

            if (data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[9].num;   // 设置牌型的判断值
                return 777;
            }

            return false;
            break;

        //判断十一张牌的情况
        case 11:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 6;
            }

            return false;
            break;

        //判断十二张牌的情况
        case 12:
            //判断是否为顺子
            if (checkStraight(data.poker)) {
                data.type = 6;
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 6;
            }

            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }


            //判断是否为飞机
            /*
                十二张牌的飞机可能性
                1、555666777888    最大值的位置11
 
                2、6667778889JQ    最大值的位置8
                3、66667778888Q    最大值的位置8
                4、346667778888    最大值的位置8
 
                5、345666777888     最大值的位置10/9
                6、66677778888Q 
                7、66667777888Q
                8、566667777888
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[2].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num   // 判断4个3张
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[11].num;   // 设置牌型的判断值
                return 777;
            }
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[2].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num ||// 判断下标0~8九张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[3].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num ||  // 判断下标1~9九张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[4].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num   // 判断下标2~10九张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[8].num;   // 设置牌型的判断值
                return 777;
            }

            if (data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num ||   // 判断下标3~11九张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[7].num ||  // 判断下标0~5 7~9九张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[8].num ||   // 判断下标1~6 8~10九张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[9].num   // 判断下标2~7 9~11九张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[9].num;   // 设置牌型的判断值
                return 777;
            }

            return false
            break;

        //判断14张牌的情况
        case 14:
            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }

            return false
            break;

        //判断15张牌的情况
        case 15:
            //判断是否为飞机
            /*
                 十五张牌的飞机可能性
                555666777888999
                
                66677788899JJQQ
                5566677788899JJ
                
                445566677788899
                334455666777888
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num   // 判断5个3张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[14].num;   // 设置牌型的判断值
                return 777;
            }
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[10].num &&
                data.poker[11].num == data.poker[12].num &&
                data.poker[13].num == data.poker[14].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num ||  // 判断前9张牌

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[12].num &&
                data.poker[13].num == data.poker[14].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num    // 判断中前9张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[8].num;   // 设置牌型的判断值
                return 777;
            }
            if (data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[14].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&  // 判中后9张牌

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num    // 判断后9张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[12].num;   // 设置牌型的判断值
                return 777;
            }

            return false;
            break;

        //判断十六张牌的情况
        case 16:
            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }

            //判断是否是飞机
            /*
                十六张牌的飞机可能性
                4445556667778888
                3444555666777888
                3344455566677788
                4445555666777888
                3444555566677788
                4445555666677788
                
                3334445556667778    
                3333444555666777
                3344455556667778
                3334445555666777
                3444555566667778
                3344455556666777
             */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num ||  // 判断前12张

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num ||  // 判断下标1~12十二张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num ||   // 判断下标2~13十二张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num ||  // 判断下标0~5 7~12十二张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num ||  // 判断下标1~6 8~13十二张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num // 判断下标0~5 8~13十二张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[11].num;   // 设置牌型的判断值
                return 777;
            }
            if (data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num ||  // 判断下标3~14十二张牌

                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num ||  // 判断下标4~15十二张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num ||   // 判断下标2~7 9~14十二张牌

                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num ||  // 判断下标3~8 10~15十二张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num ||  // 判断下标1~6 9~14十二张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num // 判断下标2~7 10~15十二张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[14].num;   // 设置牌型的判断值
                return 777;
            }

            return false
            break;

        //十八张牌的情况
        case 18:
            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为连对
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }

            //判断是否为飞机
            /*
                    十八张的飞机
                    333444555666777888
             */

            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num     // 判断5个3张牌
            ) {
                data.type = 777;      // 设置牌型为飞机
                data.max = data.poker[14].num;   // 设置牌型的判断值
                return 777;
            }
            return false
            break;

        //判断二十张牌的情况
        case 20:
            //判断是否为连对
            if (checkDouble(data.poker)) {
                data.type = 8;      // 设置牌型为顺子
                data.max = data.poker[data.poker.length - 1].num;   // 设置牌型的判断值
                return 8;
            }

            //判断是否为飞机
            /*
                二十张牌的飞机可能性
                5556667778889999JJJJ
                335556667778889999JJ
                33335556667778889999
                33334455566677788899
                33334444555666777888
                
                444555666777888 9999J
                3 444555666777888 9999
                33 444555666777888 999
                333 444555666777888 99
                3333 444555666777888 9
                33334 444555666777888
                
                444555 5 666777888 9999
                3 4445555666777888 999
                33 4445555666777888 99
                333 4445555666777888 9
                3333 4445555666777888
                
                444555666 7 777888 9999
                3 4445556667777888 999
                33 4445556667777888 99
                333 4445556667777888 9
                3333 4445556667777888
                
                444555 56 666777 7 888 99
                3 444555566667777888 9
                33 444555566667777888
                
                444555 5 666 6 777888 999
                3 44455556666777888 99
                33 44455556666777888 9
                333 44455556666777888 
            */
            if (data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[13].num &&
                data.poker[14].num == data.poker[15].num &&
                data.poker[16].num == data.poker[17].num &&
                data.poker[18].num == data.poker[19].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num ||  // 判断前12张

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[15].num &&
                data.poker[16].num == data.poker[17].num &&
                data.poker[18].num == data.poker[19].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num || // 判断下标2~13十二张牌

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[16].num == data.poker[17].num &&
                data.poker[18].num == data.poker[19].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num ||    // 判断下标4~15十二张牌

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[18].num == data.poker[19].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[15].num || // 判断下标6~17十二张牌

                data.poker[0].num == data.poker[1].num &&
                data.poker[2].num == data.poker[3].num &&
                data.poker[4].num == data.poker[5].num &&
                data.poker[6].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num &&
                data.poker[14].num * 1 + 1 == data.poker[17].num || // 判断下标8~19十二张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num || // 判断下标0~14十五张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num || // 判断下标1~15十五张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num || // 判断下标2~16十五张牌


                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[15].num || // 判断下标3~17十五张牌

                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[16].num == data.poker[18].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num &&
                data.poker[13].num * 1 + 1 == data.poker[16].num || // 判断下标4~18十五张牌

                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num &&
                data.poker[14].num * 1 + 1 == data.poker[17].num || // 判断下标5~19十五张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num || // 判断下标0~5 7~15十五张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num || // 判断下标1~6 8~16十五张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[15].num || // 判断下标2~7 9~17十五张牌


                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[16].num == data.poker[18].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num &&
                data.poker[13].num * 1 + 1 == data.poker[16].num || // 判断下标3~8 10~18十五张牌

                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num &&
                data.poker[14].num * 1 + 1 == data.poker[17].num || // 判断下标4~9 11~19十五张牌            

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[7].num &&
                data.poker[6].num * 1 + 1 == data.poker[8].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num || // 判断下标0~8 10~15十五张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[14].num || // 判断下标1~9 11~16十五张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[15].num || // 判断下标2~10 12~17十五张牌


                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[16].num == data.poker[18].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[13].num &&
                data.poker[13].num * 1 + 1 == data.poker[16].num || // 判断下标3~11 13~18十五张牌

                data.poker[4].num == data.poker[6].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[4].num * 1 + 1 == data.poker[7].num &&
                data.poker[7].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[14].num &&
                data.poker[14].num * 1 + 1 == data.poker[17].num || // 判断下标4~12 14~19十五张牌

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[0].num * 1 + 1 == data.poker[3].num &&
                data.poker[3].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[11].num &&
                data.poker[11].num * 1 + 1 == data.poker[15].num || // 判断下标0~5 8~13 15~17十五张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[16].num == data.poker[18].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[16].num || // 判断下标1~6 9~14 16~18十五张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num &&
                data.poker[13].num * 1 + 1 == data.poker[17].num || // 判断下标2~7 10~15 17~19十五张牌

                //              444555 5 666 6 777888 9999

                data.poker[0].num == data.poker[2].num &&
                data.poker[3].num == data.poker[5].num &&
                data.poker[7].num == data.poker[9].num &&
                data.poker[11].num == data.poker[13].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[13].num &&
                data.poker[13].num * 1 + 1 == data.poker[17].num || // 判断下标0~5 7~9 11~16十五张牌

                data.poker[1].num == data.poker[3].num &&
                data.poker[4].num == data.poker[6].num &&
                data.poker[8].num == data.poker[10].num &&
                data.poker[12].num == data.poker[14].num &&
                data.poker[15].num == data.poker[17].num &&
                data.poker[1].num * 1 + 1 == data.poker[4].num &&
                data.poker[4].num * 1 + 1 == data.poker[8].num &&
                data.poker[8].num * 1 + 1 == data.poker[12].num &&
                data.poker[12].num * 1 + 1 == data.poker[15].num || // 判断下标1~6 8~10 12~17十五张牌

                data.poker[2].num == data.poker[4].num &&
                data.poker[5].num == data.poker[7].num &&
                data.poker[9].num == data.poker[11].num &&
                data.poker[13].num == data.poker[15].num &&
                data.poker[16].num == data.poker[18].num &&
                data.poker[2].num * 1 + 1 == data.poker[5].num &&
                data.poker[5].num * 1 + 1 == data.poker[9].num &&
                data.poker[9].num * 1 + 1 == data.poker[12].num &&
                data.poker[13].num * 1 + 1 == data.poker[16].num || // 判断下标2~7 9~11 13~18十五张牌

                data.poker[3].num == data.poker[5].num &&
                data.poker[6].num == data.poker[8].num &&
                data.poker[10].num == data.poker[12].num &&
                data.poker[14].num == data.poker[16].num &&
                data.poker[17].num == data.poker[19].num &&
                data.poker[3].num * 1 + 1 == data.poker[6].num &&
                data.poker[6].num * 1 + 1 == data.poker[10].num &&
                data.poker[10].num * 1 + 1 == data.poker[14].num &&
                data.poker[14].num * 1 + 1 == data.poker[17].num  // 判断下标3~8 10~12 14~19十五张牌
            ) {
                data.type = 777;      // 设置牌型为飞机     
                return 777;
            }

            return false;
            break;

        default:
            break;
    }
}

//检查当前牌型是否为顺子
function checkStraight(poker) {
    for (let i = 0; i < poker.length - 1; i++) {
        if (poker[i].num * 1 + 1 != poker[i + 1].num) {
            return false;
        }
    }

    return true;
}

//检查当前牌型是否为连对
function checkDouble(poker) {
    for (let i = 0; i < poker.length - 2; i += 2) {
        if (poker[i].num != poker[i + 1].num || poker[i].num * 1 + 1 != poker[i + 2].num) {
            return false;
        }
    }

    return true;
}

//判断当前手牌是否大于桌上的牌
function checkVS() {
    //如果桌面上没有牌，可以直接打
    if (gameData.desktop.type == 0) {
        return true;
    }

    //如果是王炸的话也可以直接打出
    if (gameData.select.type == 888) {
        return true;
    }

    //如果出的是普通炸弹，并且桌面上没有比它大的炸弹或者王炸就可以直接打出
    if(gameData.select.type == 4){
        if(gameData.desktop.type != 4 && gameData.desktop.type != 888){
            return true;
        }else if(gameData.desktop.type == 4 && (gameData.desktop.max*1) < (gameData.select.max*1)){
            return true;
        }
    }

    // if (gameData.select.type == 4 && (gameData.desktop.type != 4 && gameData.desktop.type != 888)) {
    //     return true;
    // }

    //如果桌面上的牌是王炸那么什么牌都不可以打
    if (gameData.desktop.type == 888) {
        return false;
    }

    //其他一般情况下的判断
    if ((gameData.select.type * 1) == (gameData.desktop.type * 1) &&
        (gameData.select.poker.length * 1) == (gameData.desktop.poker.length * 1) &&
        (gameData.select.max * 1) > (gameData.desktop.max * 1)) {
        return true;
    } else {
        return false;
    }
}