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

                        console.log(user)

                        return {email: user.email, id:user._id};

                    } catch (err) {
                        console.log(err);
                    }

                }
            }
        ),
    ],
    callbacks: {
        async jwt ({ token, user }){
            user && (token.user = user)
            return token
        },
        async session ({ session, token }){
            session.user = token.user
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
})
