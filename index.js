/*

    gakubus-json2img
                by  saka-naname

    芝浦工業大学スクールバス時刻表カレンダー(http://bus.shibaura-it.ac.jp/)の
    カレンダーデータ(http://bus.shibaura-it.ac.jp/developer.html)を
    いい感じに画像化するパッケージ(非公式)

*/

const Parser = require("./src/js/parser");
const Renderer = require("./src/js/renderer");

module.exports = { Parser, Renderer }
