import request from 'supertest';
import { app } from '../../app';

it('fails when email that does not exists supplied' , async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(400);

});

it('fails when wrong password supplied' , async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);
        

    await request(app)
        .post('/api/users/signin')
        .send({
            email : "test@test.com",
            password : "passwordzzzz"
        })
        .expect(400);
        
});

it('response with cookie when given valid credentials' , async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);
        

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
        
});