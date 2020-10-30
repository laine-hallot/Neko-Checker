const { curly } = require('node-libcurl');
let crypto = require('crypto');
let nodemailer = require('nodemailer'); 
require('dotenv').config()
let lastHash = "";

async function start(){
    const { statusCode, data, headers } = await curly.get(process.env.TARGET_URL);//'https://www.toplinemainecoons.com/kittens')
    //const { statusCode, data, headers } = await curly.get('http://127.0.0.1:1525/')
    console.log('retriving site')
    console.log('hashing')
    var hash = crypto.createHash('md5').update(data).digest('hex');
    if(lastHash != hash){
        console.log('website updated');
        console.log(hash);
        let transporter = nodemailer.createTransport({
            sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail'
        });
        transporter.sendMail({
            from: process.env.SENDER_EMAIL,//'necochan@layn.moe',
            to: process.env.USER_EMAILS,//'mh@simplesolutionsfs.com, meyerwasup@gmail.com',
            subject: process.env.SUBJECT_TEXT,//'New Kittens Possible',
            text: process.env.BODY_TEXT//'I\'ve detected a change on "https://www.toplinemainecoons.com/kittens". This could mean new kittens are available'
        }, (err, info) => {
            console.log(info.envelope);
            console.log(info.messageId);
        });
    }else{
        console.log('no change');
    }
    lastHash = hash;
}
 
let intervalObj = setInterval(start, 10*1000);