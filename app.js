let request = require('request');
let cheerio = require('cheerio');

/* API 경로 */
// 레시피 api
const $url = 'http://211.237.50.150:7080/openapi/sample/xml/Grid_20150827000000000226_1/1/5'
const $KEY = 'e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf'
const $station = '195453'
const $sample = 'http://211.237.50.150:7080/openapi/e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf/xml/Grid_20150827000000000226_1/20/25'

console.log($sample);

request($sample, function(err, res, body) {
    $ = cheerio.load(body);
    
    $('row').each(function(idx) {
        let no1 = $(this).find('RECIPE_NM_KO').text();
        let no2 = $(this).find('SUMRY').text();
        console.log(`레시피이름 : ${no1}, 소개 : ${no2}`);
    });
});