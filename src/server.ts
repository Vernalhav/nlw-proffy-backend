import express from 'express';

const app = express();
app.use(express.json());

app.post('/', (request, response) => {
    console.log(request.body);
    return response.json({status: "OK"}); 
});

app.listen(3333);