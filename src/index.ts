import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from "@apollo/server/express4";

async function init() {

const app = express();
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());

//Create graphql server
const gqlServer = new ApolloServer({
    typeDefs: `
        type Query {
            hello: String
            say(name: String): String
        }
    `,
    resolvers: {
        Query: {
            hello: () => `Hey, I am a graphql server`,
            say: (_, { name }: {name: String }) => `Hey ${name}. How are you?`,
        }
    } 
})

//start sql server
await gqlServer.start();

app.get('/', (req,res) => {
    res.json({ message: "Server is up and running" })
});

// app.use('/graphql', expressMiddleware(gqlServer));

app.use(
    '/graphql',
    expressMiddleware(gqlServer, {
        context: async ({ req }) => {
            return {
                user: req.headers.user || null,
            };
        },
    })
);


app.listen(PORT, ()=> {
    console.log(`Server started as PORT:${PORT}`)
})

}

init();