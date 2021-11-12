import * as http from "http";

http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello new TypeScript server!");
    response.end();
}).listen(8888);