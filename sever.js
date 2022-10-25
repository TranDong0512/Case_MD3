const http = require('http')

const sever = http.createServer((req, res) => {

})
sever.listen(3000,()=>{
    console.log("Sever running")
})