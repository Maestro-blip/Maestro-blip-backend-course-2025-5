const {program} = require('commander');
const superagent = require('superagent');
const http = require('http');
const fs = require('fs')
const path = require('path')

program
    .option('-h, --host <address>', 'адреса сервера')
    .option('-p, --port <port>', 'порт сервера')
    .option('-c, --cache <path>','шлях до директорії');

program.parse();

const options = program.opts();

const HOST = options.host;
const PORT = options.port;
const DIR = options.cache;

console.log("\nПараметри",options)

if(options.host === undefined || options.host.trim() === "" || options.host[0] === "-")
    {
    console.log("Ви забули параметр хоста")
    process.exit(1);
}
if(options.port === undefined || options.port.toString().trim() === "" || options.port.toString()[0] === "-"){
    console.log("Ви забули параметр порта ")
    process.exit(1);
}
if(options.cache === undefined || options.cache.trim() === "" || options.cache[0] === "-"){
    console.log("Ви забули параметр шляху")
    process.exit(1);
}

console.log(DIR);
try
{if(fs.existsSync(DIR)){
    console.log("Файл існує")
}
else{
    console.log("Нема Файлу")
    fs.mkdirSync(DIR,{recursive : false})
}
}catch(err){
    console.error(`${err.message}`)
    process.exit(1);
}



const server = http.createServer()

server.on('request', (request,res) => {
    try{
        res.writeHead(200,{'content-type': 'text/plain; charset=utf-8' })
        res.end('Laboratorna №5')
    }catch(err){
        res.writeHead(500,{'content-type': 'text/plain; charset=utf-8' })
        res.end('Ой ой ой помилочка')
    }
});


server.on('error', (err)=>{
    console.error(`${err.message}`)
    process.exit(1);
})

server.listen(PORT,HOST, ()=>{
    console.log(`Сервер запущенно на http://${HOST}:${PORT}`)
});