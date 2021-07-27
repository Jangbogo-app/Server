var mysql         = require('mysql'),
    express       = require('express'),
    http          = require('http'),
    path          = require('path'),
    bodyParser    = require('body-parser'),
    fs            = require('fs'),
    dbconfig      = require('./config/database.js'),
    connection    = mysql.createConnection(dbconfig);
let request = require('request');
let cheerio = require('cheerio');

var app = express();
/*
app.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(3000, '192.168.123.7', function () {
    console.log('서버 실행 중...')
});
*/
/* API 경로 */
// 레시피 api
const $basic_url = 'Grid_20150827000000000226_1/1/537'
const $ingredient_url = 'Grid_20150827000000000227_1/1/6104'
const $process_url = 'Grid_20150827000000000228_1/1/3022'
const $KEY = 'http://211.237.50.150:7080/openapi/e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf/json/'
const $sample = 'http://211.237.50.150:7080/openapi/e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf/xml/Grid_20150827000000000227_1/6001/6104'

app.listen(3000, '192.168.123.7', function () {
    console.log('서버 실행 중...');
});

console.log($sample);

request($sample, function(err, res, body) {
    $ = cheerio.load(body);
    
    $('row').each(function(idx) {
        let r_id = $(this).find('RECIPE_ID').text();
        let r_sn = $(this).find('IRDNT_SN').text();
        let r_name = $(this).find('IRDNT_NM').text();
        let r_capacity = $(this).find('IRDNT_CPCTY').text();
    });
});

app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res) => {
    console.log(req.query);
    res.send({"result": "GET 호출"});
})

app.post('/mealkit', function(req, res) {
    var recipe_name = req.body.recipe_name;
    var sql = 'select * from recipe_basic';
    
    connection.query(sql,function(err,rows,fields){
        if(!err){

            const newrows=JSON.stringify(rows);//DB의 칼럼값을 json으로 형변환
            fs.writeFileSync('recipe_basic.json', newrows); //json파일로 만들기
            console.log(newrows);
	    res.json(rows);
        }
        else{
            console.log('Error while performing Query.', err);
        }
    });
});

app.post('/user/join', function (req, res) {
    var mem_type = req.body.mem_type;
    var id = req.body.id;
    var pwd = req.body.pwd;
    var phone = req.body.phone;
    var addr = req.body.addr;
    var name = req.body.name;
    

    // 삽입을 수행하는 sql문.
    var sql = 'INSERT INTO member_main (mem_type, id, pwd, phone, addr, name) VALUES (?, ?, ?, ?, ?, ?)';
    var params = [mem_type, id, pwd, phone, addr, name];
    
    // sql 문의 ?는 두번째 매개변수로 넘겨진 params의 값으로 치환된다.
    connection.query(sql, params, function (err, result) {
        var resultCode = 404;
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            resultCode = 200;
            message = '회원가입에 성공했습니다.';
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
});

app.post('/user/login', function (req, res) {
    console.log(req.body);
    var userEmail = req.body.userEmail;
    var userPwd = req.body.userPwd;
    var sql = 'select * from Users where UserEmail = ?';
    connection.query(sql, userEmail, function (err, result) {
        var resultCode = 404;
        var message = '에러가 발생했습니다';

        if (err) {
            console.log(err);
        } else {
            if (result.length === 0) {
                resultCode = 204;
                message = '존재하지 않는 계정입니다!';
            } else if (userPwd !== result[0].UserPwd) {
                resultCode = 204;
                message = '비밀번호가 틀렸습니다!';
            } else {
                resultCode = 200;
                message = '로그인 성공! ' + result[0].UserName + '님 환영합니다!';
            }
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    })
});

app.put(`/:id`, (req, res) => {
  console.log(`내용 PrimaryKey : ${req.params.id}`)
  console.log(req.body);
  res.send({"result": "UPDATE 호출"});
})
