var Binance = require('binance-api-node').default;
// const Binance2 = require('node-binance-api');
//const ema = require('trading-indicator').ema;

const TelegramBot = require('node-telegram-bot-api');
var MACD = require('technicalindicators').MACD;
var EMA = require('technicalindicators').EMA

var bullishengulfingpattern = require('technicalindicators').bullishengulfingpattern;
var morningstar = require('technicalindicators').morningstar;
var bullishharami = require('technicalindicators').bullishharami;
var bullishharamicross = require('technicalindicators').bullishharamicross;

var bullishmarubozu = require('technicalindicators').bullishmarubozu;
var bullishspinningtop = require('technicalindicators').bullishspinningtop;

const bullishhammer = require('technicalindicators').bullishhammer;
var threewhitesoldiers = require('technicalindicators').threewhitesoldiers;
const tweezerbottom = require('technicalindicators').tweezerbottom;

var RSI = require('technicalindicators').RSI;
var bb = require('technicalindicators').BollingerBands;




//For avoidong Heroku $PORT error
//const token = '1677444880:AAHC0UgHkuf0Y7NqsubVJSN4Q0WpPfFOYb8';
const token = '5967294536:AAHR4YyRbr5OdMMfVn7xvc3xFLAITBQGw4I';

const chatId = "662991734";
const HaID = "197407951"
//const bot = new TelegramBot(token,{polling:true});

const token_warning = "6037137720:AAFBEfCG9xWY4K_3tx7VSZzMXGgmt9-Zdog"
const bot = new TelegramBot(token_warning, { polling: true });


const token_check_log_ = "6166932215:AAEbZ28_7Um4n3K64DOOA1BRisiSTg9siBQ"
const bot_check_log = new TelegramBot(token_check_log_, { polling: true });

const { StochasticRSI, ema, macd, fibonacciretracement } = require('technicalindicators');

//const client = Binance().options({
//
//	apiKey: '6oHHrDBqe5pra9PhYEoafxbNMANrLW1XNR75B1Lqe3sFAetMapH5P18SmCRGYvPx',
//	apiSecret:'8bvKE2GciMLJHNTPpLIDOwGDG8sCOUs7dUTUQFnad3RbuulIjXYwyC4CzhYVII4H',
//	useServerTime:true,kdj
//
//});
const client = new Binance({
    apiKey: '6aAHxmZy3L491NNOpOzts4PaQcxtcXliFxXg2ACtRW9cUw5zbBHKAHwt9HJ7DO4c',
    apiSecret: 'lBCPfrYD9D9OeokixySh5yMNSaJgRQoYzM9gkXxMoB7JxUCyMHPkrCCw5RsvXb22',
    useServerTime: true,
    recvWindow: 1000, // Set a higher recvWindow to increase response timeout


});

const axios = require('axios');

// URL API của Binance để lấy dữ liệu nến
//const BASE_URL = 'https://api.binance.com/api/v3/klines';
const BASE_URL = 'https://fapi.binance.com/fapi/v1/klines';//
// const client2 = new Binance2().options({
//     apiKey: '6aAHxmZy3L491NNOpOzts4PaQcxtcXliFxXg2ACtRW9cUw5zbBHKAHwt9HJ7DO4c',
//     apiSecret: 'lBCPfrYD9D9OeokixySh5yMNSaJgRQoYzM9gkXxMoB7JxUCyMHPkrCCw5RsvXb22',
//     useServerTime: true,
//     recvWindow: 1000, // Set a higher recvWindow to increase response timeout
// });

var log_str = "";


var timeRequestArr = ["12h", "4h", "1h"]



// VARIABLES - Binance API
let buyOrderInfo = null;
let sellOrderInfo = null;
let INDEX_USDT = 11;
const PRICE_UPDATE_PERIOD = 5000; // Price update times varies a lot
const ORDER_UPDATE_PERIOD = 3000;

let coin_name = 'ETHUSDT';
let INDEX_COINT = 2;

// Pauses execution for a specified amount of time
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Synchronizes with the Binance API server
const sync = async () => {
    console.log('SYNCING ...');
    let serverTime = await client.time();
    console.log('serverTime: ', serverTime);
    let timeDifference = serverTime % 60000;
    console.log('timeDifference: ', timeDifference);
    await wait(timeDifference); // Waits 1s more to make sure the prices were updated
    console.log('SYNCED WITH BINANCE SERVER! \n');
}

let ema10 = 0;
let ema20 = 0;
let ema50 = 0;

let timeRequest = "30m";
let prices;

function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}

var MACD = require('technicalindicators').MACD;

requestTime = "30m"
var total_coin_phanky = 0
var coinDivergenceList = []
so_nen_check_giao_cat = 20
currentSymbols = []

var curentSymbolOrder = ""
var curentTimeOfSymbolOrder = ""
var curentCommandTypeOfSymbolOrder = ""

bot.on("message", (msg) => {
    const chatId = msg.chat.id;
    console.log(" receive new message " + msg.text)
    const myArray = msg.text.split("_");
    if (myArray.length > 0) {
        curentSymbolOrder = myArray[0]
        curentTimeOfSymbolOrder = myArray[1]
        curentCommandTypeOfSymbolOrder = myArray[2]
    }
    else {
        curentSymbolOrder = ""
        curentTimeOfSymbolOrder = ""
        curentCommandTypeOfSymbolOrder = ""
    }
    // for(var i = 0; i < myArray.length; i++)
    // {
    //     console.log("  i " + myArray[i])
    // }
    bot.sendMessage(chatId, " receive new message " + msg.text)
})

const getLowe2LeverTimeRequest = (timeRequest) => {
    var higherTimeRequest = timeRequest
    if (timeRequest == "15m") {
        higherTimeRequest = "3m"
    } else if (timeRequest == "30m") {
        higherTimeRequest = "5m"
    } else if (timeRequest == "1h") {
        higherTimeRequest = "15m"
    } else if (timeRequest == "2h") {
        higherTimeRequest = "30m"
    }
    else if (timeRequest == "4h") {
        higherTimeRequest = "1h"
    }
    else if (timeRequest == "6h") {
        higherTimeRequest = "1h"
    }
    else if (timeRequest == "8h") {
        higherTimeRequest = "2h"
    }

    return higherTimeRequest;

}

const getHigherTimeRequest = (timeRequest) => {
    var higherTimeRequest = timeRequest
    if (timeRequest == "5m") {
        higherTimeRequest = "30m"
    }
    if (timeRequest == "15m") {
        higherTimeRequest = "1h"
    }
    else if (timeRequest == "1h") {
        higherTimeRequest = "4h"
    }
    else if (timeRequest == "4h") {
        higherTimeRequest = "1d"
    } else {
        higherTimeRequest = "1d"
    }

    if (timeRequest == "30m") {
        higherTimeRequest = "2h"
    } else if (timeRequest == "2h") {
        higherTimeRequest = "8h"
    }

    // console.log(" higherTimeRequest "+ higherTimeRequest)
    return higherTimeRequest;
}

const getTp = async (coinName2, higerTimeRequest) => {
    try {

        var priceDatas = await client.futuresCandles({ symbol: coinName2, limit: 1000, interval: higerTimeRequest })
        var openPrices = []
        var closePrices = []

        var last10Prices = []
        var last5Prices = []

        //   console.log(" priceDatas[priceDatas.length-1].closeTime   "+ typeof( priceDatas[priceDatas.length-1].close));

        // console.log(coinName2+ " priceDatas " +  "  timeRequest "+ timeRequest)
        for (var i = 0; i < priceDatas.length; i++) {
            //  console.log(coinName2+ "   "+i + "    priceDatas " + priceDatas[i].open)
            closePrices.push(Number(priceDatas[i].close))
            openPrices.push(Number(priceDatas[i].open))
        }

        var ema10 = EMA.calculate({ period: 10, values: closePrices })
        var ema20 = EMA.calculate({ period: 20, values: closePrices })
        var ema34 = EMA.calculate({ period: 34, values: closePrices })
        var ema50 = EMA.calculate({ period: 50, values: closePrices })
        var ema89 = EMA.calculate({ period: 89, values: closePrices })

        if (ema10[ema10.length - 1] < ema89[ema89.length - 1]) {
            //console.log(" TP  " + ema89[ema89.length - 1])
            return ema89[ema89.length - 1];
        } else {
            // console.log(" TP zero " + ema89[ema89.length - 1])
            return 0;
        }

    } catch (error) {
        console.log("get TP error " + error)
    }
}

function fibonacciForClosingPrice(previousClose = 0.0, currentClose = 0.0) {

    const ratio = 0.618; // Tỷ lệ Fibonacci
    var fibonacciValue = 0.0;
    fibonacciValue = Number(currentClose) - (ratio * (Number(currentClose) - Number(previousClose)));
    //  console.log("xxx "+previousClose + "  "+ currentClose  + " fb "+ fibonacciValue)
    return Number(fibonacciValue);
}



// Hàm kiểm tra mô hình Hammer
const isHammer = (candle) => {
    const body = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    const lowerShadow = Math.abs(candle.low - Math.min(candle.open, candle.close));

    return (
        body < (range / 3) && // Thân ngắn
        lowerShadow > (2 * body) // Bóng dưới dài
    );
};

// Hàm kiểm tra mô hình Morning Star
const isMorningStar = (prev, middle, current) => {
    return (
        prev.close < prev.open && // Nến trước giảm
        middle.close < middle.open && // Nến giữa giảm hoặc không đổi
        current.close > current.open && // Nến hiện tại tăng
        current.close > prev.open // Đóng cửa nến hiện tại cao hơn mở cửa nến trước
    );
};

async function getCandlesticks(symbol, interval) {
    //  console.log("coinname : " + symbol + "  timeRequest " + interval)
    const priceDataArray = [];
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                symbol: symbol,
                interval: interval,
                limit: 1000
            }
        });

        const candlesticks = response.data;
        //  console.log("coinName "+symbol + " price 0 "+  candlesticks[candlesticks.length-1]);

        // Duyệt qua từng cây nến và tạo đối tượng PriceData
        candlesticks.forEach(candle => {
            const priceData = new PriceData(
                parseFloat(candle[1]), // Giá mở cửa
                parseFloat(candle[2]), // Giá cao nhất
                parseFloat(candle[3]), // Giá thấp nhất
                parseFloat(candle[4])  // Giá đóng cửa
            );
            priceDataArray.push(priceData);
        });

        return priceDataArray
    } catch (error) {
        //    console.error('Error fetching candlesticks:', error);
    }
}

function isBearishEngulfing(prevCandle, currCandle) {
    // Kiểm tra đầu vào
    if (!(prevCandle instanceof PriceData) || !(currCandle instanceof PriceData)) {
        throw new Error("Both arguments must be instances of PriceData.");
    }

    // Xác định nến tăng cho prevCandle
    const isPrevBullish = prevCandle.close > prevCandle.open;

    // Xác định nến giảm cho currCandle
    const isCurrBearish = currCandle.close < currCandle.open;

    // Kiểm tra nhấn chìm giảm
    const isEngulfing = currCandle.open >= prevCandle.close && currCandle.close < prevCandle.open;

    return isPrevBullish && isCurrBearish && isEngulfing;
}
class PriceData {
    constructor(open, high, low, close) {
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
    }
}

function fibonacciLevel(priceHigh, priceLow, fibLevel) {
    return priceLow + (priceHigh - priceLow) * (1 - fibLevel);
}



// Hàm kiểm tra xem một cây nến có phải là Marubozu không
// function isMarubozu(candle) {
//     const bodySize = Math.abs(candle.close - candle.open);
//     const upperShadow = candle.high - Math.max(candle.close, candle.open);
//     const lowerShadow = Math.min(candle.close, candle.open) - candle.low;
//     var ttShadow = (Number(upperShadow) + Number(lowerShadow))
//     console.log("candle.close  "+ candle.close +" Number(bodySize)   "+ Number(bodySize)  + " ttShadow "+ ttShadow)
//     // Kiểm tra nếu cây nến có thân lớn hơn nhiều so với râu
//     return Number(bodySize) > ((Number(upperShadow) + Number(lowerShadow)) * 0.5); // Có thể điều chỉnh hệ số
// }

// // Hàm kiểm tra cây nến nhấn chìm tăng
// function isBullishEngulfing(previousCandle, currentCandle) {
//     return (
//         currentCandle.close > currentCandle.open && // Cây nến hiện tại là nến tăng (close > open)
//         currentCandle.open < previousCandle.close && // Giá mở cửa cây nến hiện tại nhỏ hơn giá đóng cửa cây nến trước
//         currentCandle.close > previousCandle.open && // Giá đóng cửa cây nến hiện tại lớn hơn giá mở cửa cây nến trước
//         previousCandle.close < previousCandle.open // Cây nến trước phải là nến giảm (close < open)
//     );
// }

function isBullishEngulfing(prevCandle, currCandle) {
    // Tính các thành phần của nến hiện tại
    const bodySize = Math.abs(currCandle.close - currCandle.open); // Thân nến (dùng giá trị tuyệt đối)
    const upperShadow = currCandle.high - Math.max(currCandle.close, currCandle.open); // Bóng nến trên
    const lowerShadow = Math.min(currCandle.close, currCandle.open) - currCandle.low; // Bóng nến dưới

    return (
        // Điều kiện Bullish Engulfing cơ bản
        prevCandle.open > prevCandle.close && // Nến trước là giảm
        currCandle.open <= currCandle.close && // Nến hiện tại là tăng
        currCandle.open >= prevCandle.low && // Giá mở hiện tại thấp hơn hoặc bằng giá thấp nhất của nến trước
        currCandle.close >= prevCandle.open && // Giá đóng hiện tại cao hơn hoặc bằng giá mở của nến trước

        // Điều kiện bổ sung
        upperShadow < lowerShadow && // Bóng nến trên phải ngắn hơn bóng nến dưới
        upperShadow < bodySize / 3 // Bóng nến trên nhỏ hơn 1/3 thân nến
    );
}

function getLowerPrice(currCandle) {
    if (currCandle.close >= currCandle.open) {
        return currCandle.open;
    } else {
        return currCandle.close
    }
}

const findRetestForBuy = async (coinName2, highTimeRequest, lowTimeRequest, mulCoeff) => {

    // console.log("coinname : " + coinName2 + "  timeRequest " + timeRequest)
    try {
        var priceDatas = await getCandlesticks(coinName2, highTimeRequest);//await client.futuresCandles({ symbol: coinName2, limit: 1000, interval: timeRequest })
        // console.log(" priceDatas "+ priceDatas)
        if (priceDatas.length == 0) {
            return;
        }
        // var tpCheck = await getTp(coinName2,getHigherTimeRequest(timeRequest))
        // console.log(" tpCheck "+ tpCheck)
        var openPrices = []
        var closePrices = []

        var last10Prices = []
        var last5Prices = []

        //   console.log(" priceDatas[priceDatas.length-1].closeTime   "+ typeof( priceDatas[priceDatas.length-1].close));

        // console.log(coinName2+ " priceDatas " +  "  timeRequest "+ timeRequest)
        for (var i = 0; i < priceDatas.length; i++) {
            //  console.log(coinName2+ "   "+i + "    priceDatas " + priceDatas[i].open)
            closePrices.push(Number(priceDatas[i].close))
            openPrices.push(Number(priceDatas[i].open))
        }

        var ema10 = EMA.calculate({ period: 10, values: closePrices })
        var ema20 = EMA.calculate({ period: 20, values: closePrices })
        var ema34 = EMA.calculate({ period: 34, values: closePrices })
        var ema50 = EMA.calculate({ period: 50, values: closePrices })
        var ema89 = EMA.calculate({ period: 89, values: closePrices })
        var ema200 = EMA.calculate({ period: 200, values: closePrices })

        var inputRSI = { values: closePrices, period: 14 }
        var rsiValues = RSI.calculate(inputRSI)

        var macdInput = {
            values: closePrices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        }

        var macdData2 = MACD.calculate(macdInput)

        var bbInput = {
            period: 20,
            values: closePrices,
            stdDev: 2
        }
        const bbResult = bb.calculate(bbInput)
        var resultLength = bbResult.length

        if (ema50[ema50.length - 1] < ema89[ema89.length - 1]) {
            return
        }

        // tim cay nen dau tien sau khi ema50 over ema89 va thoa man
        /**
         * Cay nen nho hon ema50 > ema89, va dong thoi cham bb duoi nhung ko dc dong cua cua ema89
         * sau do cham lai bb tren
         * diem cham bb tren nay phai >= bb truoc cay nen tim luc nay
         * Vao khung nen nho hon tim diem vao lenh
         */

        var nearestEma50UnderEma89 = -1

        for (var i = 0; i < ema89.length - 1; i++) {
            if ((ema50[ema50.length - 1 - i] > ema89[ema89.length - 1 - i]) && (ema50[ema50.length - 1 - (i + 1)] < ema89[ema89.length - 1 - (i + 1)])) {
                nearestEma50UnderEma89 = i
                break
            }
        }

        // tim cay nen ma nho hon ema50 va bb duoi, > ema89, 


        var nearestUnderEma50AndBBLow = -1
        var candleAboveBBUpBefore = -1
        var candleAboveBBUpAfter = -1
        for (var i = 0; i < nearestEma50UnderEma89; i++) {
            if ((priceDatas[priceDatas.length - 1 - i].low < ema50[ema50.length - 1 - i])
                && (priceDatas[priceDatas.length - 1 - i].close > ema89[ema89.length - 1 - i])
                && (priceDatas[priceDatas.length - 1 - i].low < bbResult[bbResult.length - 1 - i].lower)
            ) {
                candleAboveBBUpBefore = -1
                candleAboveBBUpAfter = -1
                //   console.log(coinName2 + " time "+ highTimeRequest + " nearestUnderEma50AndBBLow "+ nearestUnderEma50AndBBLow)

                for (var j = i; j < nearestEma50UnderEma89; j++) {
                    if ((priceDatas[priceDatas.length - 1 - j].close > bbResult[bbResult.length - 1 - j].upper)) {
                        // tot nhat tim cay nen dau tien trc do
                        candleAboveBBUpBefore = j
                        break
                    }
                }


                // cay bb sau phai > cay bb r
                // tu cay nen nay den cay nen bbUp ko dc co cay nen nao duoi ema89
                for (var j = 0; j < i; j++) {
                    if (priceDatas[priceDatas.length - 1 - j].close < ema89[ema89.length - 1 - j]) {
                        return
                    }
                    if (candleAboveBBUpBefore < 0) {
                        break
                    }
                    if ((priceDatas[priceDatas.length - 1 - j].close > bbResult[bbResult.length - 1 - j].upper)
                     //   && (priceDatas[priceDatas.length - 1 - j].close >= priceDatas[priceDatas.length - 1 - candleAboveBBUpBefore].close)
                    ) {
                        candleAboveBBUpAfter = j
                      
                    }
                }

                if( candleAboveBBUpBefore > 0)
                {
                    if(priceDatas[priceDatas.length - 1 - candleAboveBBUpBefore].close >= priceDatas[priceDatas.length - 1 - candleAboveBBUpBefore].close)
                    {

                    }else{
                        return
                    }
                }
                nearestUnderEma50AndBBLow = i
            }
        }


       // console.log(coinName2 + " time " + highTimeRequest + " candleAboveBBUpAfter " + candleAboveBBUpAfter)
        if (nearestUnderEma50AndBBLow < 0)
            return

        // tim diem truoc va sau nearestUnderEma50AndBBLow ma cham bb
         

    
        var mid_priceDatas = await getCandlesticks(coinName2, lowTimeRequest);//await client.futuresCandles({ symbol: coinName2, limit: 1000, interval: timeRequest })
        
        if (mid_priceDatas.length == 0) {
            return;
        }
        // var tpCheck = await getTp(coinName2,getHigherTimeRequest(timeRequest))
        // console.log(" tpCheck "+ tpCheck)
        var mid_openPrices = []
        var mid_closePrices = []

        var last10Prices = []
        var last5Prices = []

        //   console.log(" priceDatas[priceDatas.length-1].closeTime   "+ typeof( priceDatas[priceDatas.length-1].close));

        // console.log(coinName2+ " priceDatas " +  "  timeRequest "+ timeRequest)
        for (var i = 0; i < mid_priceDatas.length; i++) {
            //  console.log(coinName2+ "   "+i + "    priceDatas " + priceDatas[i].open)
            mid_closePrices.push(Number(mid_priceDatas[i].close))
            mid_openPrices.push(Number(mid_priceDatas[i].open))
        }

        var mid_ema10 = EMA.calculate({ period: 10, values: mid_closePrices })
        var mid_ema20 = EMA.calculate({ period: 20, values: mid_closePrices })
        var mid_ema34 = EMA.calculate({ period: 34, values: mid_closePrices })
        var mid_ema50 = EMA.calculate({ period: 50, values: mid_closePrices })
        var mid_ema89 = EMA.calculate({ period: 89, values: mid_closePrices })
        var mid_ema200 = EMA.calculate({ period: 200, values: mid_closePrices })

        var mid_macdInput = {
            values: mid_closePrices,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        }

        var mid_macdData2 = MACD.calculate(mid_macdInput)


        //den cay nen be hon, cu > ema89 va co cay Engulfing la om
        if (mid_ema50[mid_ema50.length - 1] < mid_ema89[mid_ema89.length - 1]) {
            return
        }

        var mid_nearestEma50UnderEma89 = -1
        for (var i = 0; i < nearestUnderEma50AndBBLow * mulCoeff; i++) {
            if ((mid_ema50[mid_ema50.length - 1 - i] > mid_ema89[mid_ema89.length - 1 - i])
                && ((mid_ema50[mid_ema50.length - 1 - (i + 1)] < mid_ema89[mid_ema89.length - 1 - (i + 1)]))) {
                mid_nearestEma50UnderEma89 = i
            }
        }
        if (mid_nearestEma50UnderEma89 < 0) {
            return
        }


        // tim diem cham lại ema89


        // var hasCandleUnderMidEma89 = false
        // var firstTouchMidEma89 = -1
        // for (var i = 0; i < Math.min(mid_nearestEma50UnderEma89, candleAboveBBUpAfter * mulCoeff); i++) {
        //     if (mid_priceDatas[mid_priceDatas.length - 1 - i].close < mid_ema50[mid_ema50.length - 1 - i]) {
        //         hasCandleUnderMidEma89 = true
        //         firstTouchMidEma89 = i
        //     }
        // }

       // console.log(" firstTouchMidEma89 " + firstTouchMidEma89 + " Math.min(mid_nearestEma50UnderEma89, candleAboveBBUpAfter * mulCoeff) "+ Math.min(mid_nearestEma50UnderEma89, candleAboveBBUpAfter * mulCoeff))

        var idexForBuy = -1
        // if(hasCandleUnderMidEma89 == true)
        // {
        //     for(var i = 0; i < firstTouchMidEma89; i++)
        //     {
        //         if(isBullishEngulfing(mid_priceDatas[mid_closePrices.length-1-(i+1)],mid_priceDatas[mid_closePrices.length-1-i])
        //         && (mid_priceDatas[mid_closePrices.length-1-i].close > mid_ema89[mid_ema89.length-1-i])
        //         )
        //         {

        //             for(var j = i ; j < nearestUnderEma50AndBBLow* mulCoeff;j++)
        //             {
        //                 if(mid_priceDatas[mid_priceDatas.length-1-j].close < priceDatas[priceDatas.length-1-nearestUnderEma50AndBBLow].low)
        //                 {
        //                     return
        //                 }
        //             }
        //             // tu cay nen 0 nay den cay nen nay ko co cay nao gia dong cua < cay  nearestUnderEma50AndBBLow cua nen cao hon
        //             idexForBuy = i
        //         }
        //     }
        // }

        if(candleAboveBBUpAfter < 0)
        {
            return 
        }
     //   console.log(coinName2 + " candleAboveBBUpAfter "+ candleAboveBBUpAfter)
       // if (hasCandleUnderMidEma89 == true)
             {
            for (var i = 0; i < candleAboveBBUpAfter * mulCoeff; i++) {
                if (
                //    isBullishEngulfing(mid_priceDatas[mid_closePrices.length - 1 - (i + 1)], mid_priceDatas[mid_closePrices.length - 1 - i])
                 //   && 
                    (mid_macdData2[mid_macdData2.length - 1 - i].MACD > mid_macdData2[mid_macdData2.length - 1 - i].signal)
                    && (mid_macdData2[mid_macdData2.length - 1 - (i+1)].MACD < mid_macdData2[mid_macdData2.length - 1 - (i+1)].signal)
                ) {

                  //  console.log(" mid_macdData2 cut " + i)
                    for (var j = i; j < nearestUnderEma50AndBBLow * mulCoeff; j++) {
                        if (mid_priceDatas[mid_priceDatas.length - 1 - j].close < priceDatas[priceDatas.length - 1 - nearestUnderEma50AndBBLow].low) {
                            return
                        }
                    }
                    // tu cay nen 0 nay den cay nen nay ko co cay nao gia dong cua < cay  nearestUnderEma50AndBBLow cua nen cao hon
                    idexForBuy = i
                }
            }
        }

        // if (idexForBuy > 0
        //     //  && (idexForBuy< 30)
        // ) {
        //     console.log(coinName2 + " lowtime " + lowTimeRequest + " idx " + idexForBuy
        //         + " highTime " + highTimeRequest + " idxTouch " + nearestUnderEma50AndBBLow

        //     )
        // }

        if (idexForBuy > 0
            && (idexForBuy < 30)
        ) {
            console.log(" =============== " + coinName2 + " lowtime " + lowTimeRequest + " idx " + idexForBuy
                + " highTime " + highTimeRequest + " idxTouch " + nearestUnderEma50AndBBLow

            )
            bot.sendMessage(chatId,coinName2 + " lowtime " + lowTimeRequest + " idx " + idexForBuy
                + " highTime " + highTimeRequest+ " idxTouch " + nearestUnderEma50AndBBLow )
        }

    }
    catch (e) {
        console.log("error 3 " + e + " " + coinName2)
        console.error("Dòng lỗi:", e.stack);
    }
}


const updatePrice = async (timeRequest) => {
    try {
        let accountInfo = await client.accountInfo();
        currentSymbols = await client.futuresOpenOrders()
        //	prices = await client.prices();
        prices = await client.futuresPrices();
        let pricesArr = Object.keys(prices);
        total_coin_phanky = 0
        coinDivergenceList = []

        for (var coinIndex = 0; coinIndex < pricesArr.length; coinIndex++)
        // for(var coinIndex = 0; coinIndex < top20.length; coinIndex++)
        {
            var coinName2 = pricesArr[coinIndex].toString();
            // var coinName2 = top20[coinIndex].symbol ;
            //  console.log("coinName  " + coinName2)
            //
            // 
          //  var coinName2 = "CTSIUSDT"

            if (coinName2.includes("USDT") && (coinName2 != "COCOSUSDT") && (coinName2 != "BICOUSDT")) {
                try {
                    //  var highestTimeRequest = await findHighestTimeForBuy(coinName2, timeRequest)
                    //   console.log(" highestTimeRequest "+highestTimeRequest)
                    //    if (highestTimeRequest != "")
                    {
                             
                         await findRetestForBuy(coinName2, "1h", "15m", 4)
                        await findRetestForBuy(coinName2, "15m", "3m", 5)
                        await findRetestForBuy(coinName2, "30m", "5m", 6)
                        // await findRetestForBuy(coinName2, "5m", "1m", 5)
                        // await findRetestForBuy(coinName2, "1h", "15m", 4)
                    }
                  //  break
                    //  var test15m = await findRetest4hForBuy(coinName2, timeRequest)
                    //    var test15m = await find3TimeRedFutureForSell(coinName2, timeRequest, lowerTimeRequest, mulCoeff)
                    //    var test15m = await find3TimeRedFutureForSell(coinName2, timeRequest)
                    //     break;    
                    // var test5m = await find3TimeRedForBuy(coinName2, timeRequest)
                } catch (err) {
                    console.log(coinName2 + "  " + err + "\n");
                    //   continue;
                }
                //	coinNameChars = coinName.split("USDT");
                //	coinName= coinNameChars[0]+ "/"+ "USDT"

            }
            await wait(100);
            //   break;
        }


    } catch (err) {
        //	 log_str += err + "  " + coinName + "\n";
        console.log(err + "\n");
    }
}

(async function main() {

    let buySuccess = null;

    //	await updateEMA();
    //   bot.sendMessage(chatId, " =============Start 1 vong requets ======");
    while (true) {
        log_str = "";
        //	bot.sendMessage(chatId," =============Start 1 vong requets ======" );
        try {

            //	await sell();

        } catch (e) {
            console.log("Error for sell", e);
            process.exit(-1);
        }

        try {

            await updatePrice("1h");

            await sync();
        } catch (e) {
            console.log('Erorr Update ema', e);
            process.exit(-1);
        }

        // console.log("ema10 " + ema10 + "ema20 " + ema20 + "ema50 " + ema50);
        // // console.log("ema20 " + ema20);
        // // console.log("ema50 " + ema50);

        // //buySuccess = await buy();
        // if(ema10 > ema20 && ema10 > ema50
        // 	&& ema20 > ema50)
        // {
        // 	try{

        // 	//	buySuccess = await buy();
        // 	} catch (e) {
        // 		console.log('ERROR IN buy(): ', e);
        // 		console.log('RESUMING OPERATIONS\n');
        // 		continue;
        // 	}
        // 	// buy
        // }else{
        // 	console.log("Doi mua");
        // }
        // if(buySuccess === 'failure') continue; 
        //	bot.sendMessage(chatId," =============Ket thuc 1 vong requets ======" );
        await sync();
        await wait(10000);
    }

})();































