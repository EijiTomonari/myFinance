import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import {MongoClient} from 'mongodb';
import {compare} from 'bcryptjs';
import connectToDatabase from "../../../modules/mongodb/mongodb";

export default NextAuth({ // Configure JWT
    session: {
        jwt: true
    },
    // adapter: MongoDBAdapter(connectToDatabase()),
    // Configure one or more authentication providers
    providers: [
        CredentialsProvider(
            {
                async authorize(credentials) { // Connect to DB

                    try {
                        const {db} = await connectToDatabase()
                        const user = await db.collection(process.env.MONGO_USERS).findOne({email: credentials.email});

                        if (! user) {
                            throw new Error('No user found with the email');
                        }

                        const checkPassword = await compare(credentials.password, user.password);
                        if (! checkPassword) {

                            throw new Error('Password doesnt match');
                        }
                        
                        return {email: user.email};

                    } catch (err) {
                        console.log(err);
                    }

                }
            }
        ),
    ],
    callbacks: {
        async session(
            {session, token, user}
        ) { // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
})
