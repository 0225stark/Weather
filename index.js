const http = require("http");
const fs = require("fs");
var requests = require("requests");

const pageFile =fs.readFileSync("page.html","utf-8");

const replaceVal =(tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp); 
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather.main);
    return temperature;
};

const server = http.createServer((req,res) => {
    if(req.url =="/" ){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?lat=28.6667&lon=77.2167&appid=fda8d6b6dfc94d19780b6b9b828e5f61"
        )
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData[0].main.temp);
            const realtimedata = arrData.map((val) => replaceVal(pageFile,val)).join("");
            res.write(realtimedata);
            //console.log(realtimedata);
        })
        .on("end", (err) => {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
});

server.listen(8000,"127.0.0.1");


//kolkata //https://api.openweathermap.org/data/2.5/weather?lat=22.5697&lon=88.3697&appid=fda8d6b6dfc94d19780b6b9b828e5f61
//Mumbai  //https://api.openweathermap.org/data/2.5/weather?lat=19.0144&lon=72.8479&appid=fda8d6b6dfc94d19780b6b9b828e5f61
//Delhi   //https://api.openweathermap.org/data/2.5/weather?lat=28.6667&lon=77.2167&appid=fda8d6b6dfc94d19780b6b9b828e5f61
