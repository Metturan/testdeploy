import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import CORS from '@koa/cors'
import koaBody from 'koa-body'
import next from "next";
import Router from "koa-router";
import mongoose from "mongoose";
import '../models/Products'
import '../models/PostCodes'
import '../models/UpsellCollection'
import '../models/CardCollection'
import '../models/CardProducts'
import '../models/DeliveryOptions'
import '../models/Occassions'

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        mongoose.connect(process.env.MONGO_URI)

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );



  const MongoProduct = mongoose.model('products')
  const MongoPostcode = mongoose.model('postalcode')
  const MongoUpsellCollection = mongoose.model('upsellCollection')
  const MongoCardCollection = mongoose.model('cardCollection')
  const MongoCardProduct = mongoose.model('cardProducts')
  const MongoDeliveryInstructions = mongoose.model('deliveryOptions')
  const MongoOccasions = mongoose.model('occasionOptions')

  // Giftcard APIs
  router.get("/api/occasion", async (ctx) => {
    try {
      let occasionOptionFromDB = await MongoOccasions.find({});

      ctx.body = {
        status: 'Success',
        data: occasionOptionFromDB
      }
    } catch(error) {
      console.log(error)
    }
  })

  router.get("/api/cardProducts", async (ctx) => {
    try {
      let cardProductsFromDB = await MongoCardProduct.find({});

      ctx.body = {
        status: 'Success',
        data: cardProductsFromDB
      }
    } catch(error) {
      console.log(error)
    }
  })

  router.get("/api/deliveryInstructions", async (ctx) => {
    try {
      let deliveryOptionsfromDB = await MongoDeliveryInstructions.find({});
      
      // console.log('db', productsFromDB)
      ctx.body = {
        status: 'Success',
        data:  deliveryOptionsfromDB
      }
    } catch(error) {
      console.log(error)
    }
  })

  router.get("/api/collectionCard", async (ctx) => {
    try {
      let collectionCardIdfromDB = await MongoCardCollection.find({});

      ctx.body = {
        status: 'Success',
        data:  collectionCardIdfromDB
      }
    } catch(error) {
      console.log('error getting upsell collection:', error)
    }
  })

  router.post('/api/deliveryInstructions', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;
      // Check if item in DB
      var instance = new MongoDeliveryInstructions({deliveryOptionsId: body})
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      ctx.body = 'Delivery Instructions saved'
    } catch(err) {
      console.log(err)
    }
  })

  router.post('/api/occasion', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;
      // Check if item in DB
      var instance = new MongoOccasions({occasionsOptionsId: body})
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      ctx.body = 'Occasions options saved'
    } catch(err) {
      console.log(err)
    }
  })

  router.post('/api/cardProducts', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;

      var el = {
        cardList: {
          cardsId: body.products,
          collectionTitle: body.collectionTitle
        }
      }
      // Check if item in DB
      var instance = new MongoCardProduct(el)
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      // await products.push(body)
      ctx.body = 'Card Products Added'
    } catch(err) {
      console.log(err)
    }
  })


  router.post('/api/collectionCard', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;

      // Check if item in DB
      var instance = new MongoCardCollection({cardCollectionId: body})
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      // await products.push(body)
      ctx.body = 'Collection Added'
    } catch(err) {
      console.log(err)
    }
  })

  router.delete('/api/collectionCard', koaBody(), async (ctx) => {
    try {
      MongoCardCollection.deleteMany({}, function (err) {
        if (err) return;

        console.log('card collection deleted')
      })
      ctx.body = "Card Collection deleted"
    } catch(err) {
      console.log(err)
    }
  })

  router.delete('/api/cardProducts', koaBody(), async (ctx) => {
    try {

      MongoCardProduct.deleteMany({}, function(err) {
        if (err) return;

        console.log('Products deleted')
      })
      ctx.body = "All Products deleted"
    } catch(err) {
      console.log(err)
    }
  })

  router.delete('/api/deliveryInstructions', koaBody(), async (ctx) => {
    try {
      MongoDeliveryInstructions.deleteMany({}, function(err) {
        if (err) return;

        console.log('Delivery Options deleted')
      })
      ctx.body = "All delivery options deleted"
    } catch(err) {
      console.log(err)
    }
  })

  router.delete('/api/occasion', koaBody(), async (ctx) => {
    try {
      MongoOccasions.deleteMany({}, function(err) {
        if (err) return;

        console.log('Occasions deleted')
      })
      ctx.body = "All occasions deleted"
    } catch(err) {
      console.log(err)
    }
  })

  // Delivery POSTCODE APIs
  router.post('/api/postcode', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;

      console.log(body)

      if (body.status == 'blacklisted') {
        MongoPostcode.findOneAndUpdate({"status": "blacklisted"}, {postcode:body.postcodeRecord}, function (err) {
          if (err) return;
  
          console.log('postcode updated')
        })
      }

      if (body.status == 'whitelisted') {
        MongoPostcode.findOneAndUpdate({"status": "whitelisted"}, {postcode:body.postcodeRecord}, function (err) {
          if (err) return;
  
          console.log('postcode updated')
        })
      }

      // MongoPostcode.deleteMany
      
      ctx.body = 'Postcode Added'
    } catch(err) {
      console.log(err)
    }
  })

  router.get("/api/postcode", async (ctx) => {
    try {
      let postcodesFromDB = await MongoPostcode.find({});
      
      console.log('db', postcodesFromDB)
      ctx.body = {
        status: 'Success',
        data: postcodesFromDB
      }
    } catch(error) {
      console.log(error)
    }
  })

    // Collection Upsells APIs
  router.get("/api/collectionUpsell", async (ctx) => {
    try {
      let upsellCollectionIdfromDB = await MongoUpsellCollection.find({});

      ctx.body = {
        status: 'Success',
        data:  upsellCollectionIdfromDB
      }
    } catch(error) {
      console.log('error getting upsell collection:', error)
    }
  })

  router.post('/api/collectionUpsell', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;
    console.log('body', body.collection)
      // Check if item in DB
      var instance = new MongoUpsellCollection({upsellCollectionId: body.collection})
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      // await products.push(body)
      ctx.body = 'Collection Added'
    } catch(err) {
      console.log('error saving upsell collection:', err)
    }
  })

  router.delete('/api/collectionUpsell', koaBody(), async (ctx) => {
    try {
      MongoUpsellCollection.deleteMany({}, function (err) {
        if (err) return;

        console.log('upsell collection deleted')
      })
      ctx.body = "Upsell Collection deleted"
    } catch(err) {
      console.log(err)
    }
  })

  // Products API

  router.get("/api/products", async (ctx) => {
    try {
      let productsFromDB = await MongoProduct.find({});
      
      // console.log('db', productsFromDB)
      ctx.body = {
        status: 'Success',
        data: productsFromDB
      }
    } catch(error) {
      console.log(error)
    }
  })

  router.post('/api/products', koaBody(), async (ctx)=> {
    try {
      const body = ctx.request.body;
      // Check if item in DB

      var el = {
        productList: {
          productId: body.products,
          collectionTitle: body.collectionTitle
        }
      }
      var instance = new MongoProduct(el)
      await instance.save()
        .then(() => console.log('saved to db'))
        .catch(err => console.log(err))
      
      // await products.push(body)
      ctx.body = 'Upsell Item Added'
    } catch(err) {
      console.log(err)
    }
  })

  router.delete('/api/products', koaBody(), async (ctx) => {
    try {
      MongoProduct.deleteMany({}, function(err) {
        if (err) return;

        console.log('Products deleted')
      })
      ctx.body = "All Products deleted"
    } catch(err) {
      console.log(err)
    }
  })

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(CORS({ origin: "*" }))
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
