const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const uuid = require('uuid');
const faker = require('faker');
const app = new Koa();
// CORS
app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const router = new Router();
const server = http.createServer(app.callback())
let posts = [];
let comments = [];

router.get('/posts/latest', async (ctx, next) => {
  const randomAmountPost = Math.floor(Math.random() * 10) + 1;
  posts = [];
  comments = [];

  for (let item = 1; item <= randomAmountPost; item += 1) {
    posts.push({
      id: item,
      author_id: uuid.v4(),
      title: faker.lorem.sentence(),
      author: faker.name.findName(),
      avatar: faker.image.avatar(),
      image: faker.image.imageUrl(200, 100),
      created: faker.date.recent(),
    });


    const randomNewMessage = Math.floor(Math.random() * 3);
    for (let j = 0; j <= randomNewMessage; j += 1) {
      comments.push(
        {
          id: uuid.v4(),
          post_id: item,
          author_id: uuid.v4(),
          author: faker.name.findName(),
          avatar: faker.image.avatar(),
          content: faker.lorem.words(),
          created: faker.date.recent(),
        }
      );
    }

  }
  const postMsg = {
    status: 'ok',
    data: posts,
  };
  
  console.log('get index');
  ctx.response.body = postMsg;
});

router.get('/posts/:id/comments/latest', async (ctx, next) => {
  // for (let j = 1; j <= posts.length; j += 1) {
  //   const randomNewMessage = Math.floor(Math.random() * 3);
  //   for (let i = 0; i < randomNewMessage; i += 1) {
  //     comments.push(
  //       {
  //         id: uuid.v4(),
  //         post_id: j,
  //         author_id: uuid.v4(),
  //         author: faker.name.findName(),
  //         avatar: faker.image.avatar(),
  //         content: faker.lorem.words(),
  //         created: faker.date.recent(),
  //       }
  //     );
  //   }
  // }
  
  const postComment = comments.filter((item) => ctx.params.id == item.post_id)
  // console.log(postComment);
  const commentMsg = {
    status: 'ok',
    data: postComment,
  };
  // for (let i = 0; i < randomNewMessage; i += 1) {
  //   randomId = uuid.v4();
  //   randomEmail = faker.internet.email();
  //   randomUserName = faker.internet.userName();
  //   randomBody = faker.lorem.paragraph();
  //   randomReceived = faker.date.recent();
    
  //   comments.push(
  //     {
  //       "id": "<id>",
  //       "post_id": "<post_id>",
  //       "author_id": "<author_id>",
  //       "author": "<author>",
  //       "avatar": "<avatar>",
  //       "content": "<content>",
  //       "created": "<timestamp>"
  //     }
  //   );
  // }
  
  // console.log('get index');
  ctx.response.body = commentMsg;
});

app.use(router.routes()).use(router.allowedMethods());
const port = process.env.PORT || 7070;
server.listen(port);
