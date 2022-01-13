import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from 'mongodb';
import { compare } from 'bcryptjs';

export default NextAuth({
    //Configure JWT
    session: {
        jwt: true,
    },
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                //Connect to DB
                const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}.h7j1y.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

                const client = await MongoClient.connect(uri, { useNewUrlParser: true })
                    .catch(err => { console.log(err); });
                if (!client) {
                    return;
                }

                try {
                    const collection = client.db(process.env.MONGO_DB).collection(process.env.MONGO_USERS);
                    const result = await collection.findOne({
                        email: credentials.email,
                    });
                    if (!result) {
                        client.close();
                        throw new Error('No user found with the email');
                    }
                    const checkPassword = await compare(credentials.password, result.password);
                    if (!checkPassword) {
                        client.close();
                        throw new Error('Password doesnt match');
                    }
                    client.close();
                    return { email: result.email };

                } catch (err) {
                    console.log(err);
                } finally {
                    client.close();
                }

            },
        }),
    ],
    secret:process.env.NEXTAUTH_SECRET
})