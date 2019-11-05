var appType = 2;
const Config = {};
if (appType === 1) {
    //本地开发环境
    Config.serverUrl = 'http://localhost:9001/secondary/';
    Config.serverIp = 'localhost:3000/';
} else if (appType === 2) {
    //测试环境
    Config.serverUrl = 'http://49.232.24.206:9001/secondary/';
    Config.serverIp = 'http://localhost:3000/';
}else if (appType === 3){
    //生产环境
    Config.serverUrl = 'http://msecondary.com:9001/secondary/';
    Config.serverIp = 'http://msecondary.com/';
}else {
    Config.serverUrl = 'http://49.232.24.206:9001/secondary/';
    Config.serverIp = 'http://49.232.24.206:9001/';
}
export default Config;