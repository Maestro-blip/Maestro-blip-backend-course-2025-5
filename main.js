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

console.log(options)

    if(options.host === undefined || options.host.trim() === "" || options.host[0] === "-"){
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


    try{
        if(fs.existsSync(DIR)){
            console.log("Файл існує")
        }
        else{
            console.log("Нема Файлу")
            fs.mkdirSync(DIR,{recursive : true})
        }
    }catch(err){
        console.error(`${err.message}`)
        process.exit(1);
    }



const server = http.createServer()

server.on('request', async (request,res) => {

    
    const urlcode = path.join(path.resolve(DIR), request.url + '.jpeg')
    const caturl =`https://http.cat${request.url}`
    let statuscode = request.url.slice(1);
    
    
    try{
        if(request.url !== "/"){
            switch(request.method){
                case 'GET':
                    try{
                        const dataG = await fs.promises.readFile(urlcode)
                        res.writeHead(200,{'content-type': 'image/jpeg;' })
                        res.end(dataG)
                    }catch(err){
                        try{
                          /*  const catrequest = await superagent.get(caturl);
                            const imagefile = catrequest.body;
                            await fs.promises.writeFile(urlcode,imagefile)
                            res.writeHead(200,{'content-type': 'image/jpeg;' })
                           res.end(imagefile)*/ 

                        }catch(err){
                            res.writeHead(404,{'content-type': 'text/plain; charset=utf-8' })
                            res.end('Not Found')
                        }
                        
                    }
                    break;
                case 'PUT':
                    let dataP = [];
                    request.on('data',(chunk)=>{
                        dataP.push(chunk)
                        console.log("Отримання")
                    })
                    request.on('end',async ()=>{
                        console.log("Закінчено отримання")
                        const fileData = Buffer.concat(dataP);
                        try{
                            await fs.promises.writeFile(urlcode,fileData)
                            res.writeHead(201,{'content-type': 'text/plain; charset=utf-8' })
                            res.end('Created')
                        }catch(err){
                            res.writeHead(500,{'content-type': 'text/plain; charset=utf-8' })
                            res.end('Not Found')
                        }

                    })
                    break;
                case 'DELETE':
                    try{
                        await fs.promises.unlink(urlcode,)
                        res.writeHead(200,{'content-type': 'text/plain; charset=utf-8' })
                        res.end('Все кул все видалили')
                    }catch(err){
                        res.writeHead(404,{'content-type': 'text/plain; charset=utf-8' })
                        res.end('Not Found')
                    }
                    break;
                default:
                        res.writeHead(405,{'content-type': 'text/plain; charset=utf-8' })
                        res.end('Method not allowed')
                    break;
            };
        }else{
                res.writeHead(200,{'content-type': 'text/plain; charset=utf-8' })
                res.end('Це головна сторінка. Все кул')
        }
            
    }
    catch(err){
        console.error(err)
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