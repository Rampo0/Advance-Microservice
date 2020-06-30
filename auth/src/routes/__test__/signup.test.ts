import request from 'supertest';
import { app } from '../../app';
import { header } from 'express-validator';

it('return a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);
});

it('return a 400 on invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email : "sdadasdwad",
            password : "password"
        })
        .expect(400);
});


it('return a 400 on invalid email and password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email : "sdadasdwad",
            password : "p"
        })
        .expect(400);
});

it('return a 400 on missing password or email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com"
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password : "password"
        })
        .expect(400);
});

it('disallowed duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);

    await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(400);
});

it('set cookie after signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email : "test@test.com",
            password : "password"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
});