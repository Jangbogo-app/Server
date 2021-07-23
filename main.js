var mysql         = require('mysql'),
    express       = require('express'),
    http          = require('http'),
    path          = require('path'),
    bodyParser    = require('body-parser'),
    fs            = require('fs'),
    dbconfig      = require('./config/database.js'),
    connection    = mysql.createConnection(dbconfig);

var app = express();

/* API 경로 */
// 레시피 api
const $url = 'http://211.237.50.150:7080/openapi/sample/xml/Grid_20150827000000000226_1/1/5'
const $KEY = 'e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf'
const $station = '195453'
const $sample = 'http://211.237.50.150:7080/openapi/e8e79f2dfe0db907b387019f97ac979a9bba1d7e30cc349e37afd92326faefbf/xml/Grid_20150827000000000226_1/20/25'

app.listen(3000, 'localhost', function () {
    console.log('서버 실행 중...');
});

console.log($sample);

request($sample, function(err, res, body) {
    $ = cheerio.load(body);
    
    $('row').each(function(idx) {
        let no1 = $(this).find('RECIPE_NM_KO').text();
        let no2 = $(this).find('SUMRY').text();
        console.log(`레시피이름 : ${no1}, 소개 : ${no2}`);
    });
});

app.use(bodyParser.urlencoded({extended: false}));
app.get('/', (req, res) => {
    console.log(req.query);
    res.send({"result": "GET 호출"});
})

app.post('/mealkit', function(req, res) {
    var recipe_name = req.body.recipe_name;
});

app.post('/user/join', function (req, res) {
    var userEmail = req.body.userEmail;
    var userPwd = req.body.userPwd;
    var userName = req.body.userName;
    
    console.log(userEmail,userPwd, userName);

    // 삽입을 수행하는 sql문.
    var sql = 'INSERT INTO Users (UserEmail, UserPwd, UserName) VALUES (?, ?, ?)';
    var params = [userEmail, userPwd, userName];
    
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
