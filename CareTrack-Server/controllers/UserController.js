const { bcryptCompare } = require("../helpers/bcryptjs");
const { createToken, encryptData, decryptData } = require("../helpers/jwt");
const { User } = require("../models");
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();
const { Op } = require('sequelize');
const { validateEmail } = require("../helpers/general");

class UserController {
    static async create(request, response, next) {
        const { name, email, username, status = 0, accountType = 1, password } = request.body;
        
        try {

            if (!name) throw ({ name: `EmptyName`, origin: 'UserController' });
            if (!email) throw ({ name: `EmptyEmail`, origin: 'UserController' });
            if (!validateEmail(email)) throw ({ name: `InvalidEmail`, origin: 'UserController' });
            if (!username) throw ({ name: `EmptyUsername`, origin: 'UserController' });
            if (!password) throw ({ name: `EmptyPassword`, origin: 'UserController' });
    
            let user = await User.findOne({ where: { email: email } });
            if (user) throw ({ name: `DuplicateEmail`, origin: 'UserController' });
            user = await User.findOne({ where: { username: username } });
    
            if (user) throw ({ name: `DuplicateUsername`, origin: 'UserController' });

            user = await User.create({ name, email, username, status, accountType, password });

            let encryptedEmail = encryptData(email);

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.APP_USER_GMAIL,
                    pass: process.env.APP_PASSWORD_GMAIL
                }
            });

            const mailOptions = {
                from: `"Admin CareNow-CareTrack" <${process.env.APP_USER_GMAIL}>`,
                to: email,
                subject: "Email Verification - CareTrack",
                text: "Hello, verify your account!",
                html: `<!DOCTYPE html>
                        <html>
                        <head>
                            <title>Email Verification</title>
                        </head>
                        <body>
                            <h1>Verify Your Email Address</h1>
                            <p>Please click the button below to verify your email address:</p>
                            <a href="${process.env.FRONTED_URL}verify?data=${encryptedEmail}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                                Verify Email
                            </a>
                            <p>If you did not create an account, no further action is required.</p>
                        </body>
                        </html>`
            };

            await transporter.sendMail(mailOptions);

            response.status(201).json({ 
                code: 201,
                status: 'success',
                message: 'User registered successfully. Please check your email to verify your account.',
                data : {
                    id: user.id, 
                    email: user.email
                }
                    });
        } catch (error) {
            next(error);
        }
    }

    static async login(request, response, next) {
        const { emailUsername, password } = request.body;

        try {
            if (!emailUsername || emailUsername === "") throw ({ name: `EmptyUsernameEmail`, origin: 'UserController' });
            if (!password || password === "") throw ({ name: `EmptyPassword`, origin: 'UserController' });

            let user = await User.findOne({ 
                where: { 
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { email: emailUsername },
                                { username: emailUsername }
                            ]
                        },
                        { status: 0 },
                        { emailVerifiedAt: null }
                    ]
                }
            });

            if (user) throw ({ name: "NotVerified", origin: 'UserController' });


            user = await User.findOne({ 
                where: { 
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { email: emailUsername },
                                { username: emailUsername }
                            ]
                        },
                        { status: 1 },
                        { emailVerifiedAt: { [Op.ne]: null } }
                    ]
                }
            });
            

            if (!user) throw ({ name: "NotMatched", origin: 'UserController' });

            if (user.accountType == 2) throw ({ name: 'googleAcc', origin: 'UserController' });

            if (!bcryptCompare(password, user.password)) throw ({ name: "NotMatched", origin: 'UserController' });

            response.status(200).json({ 
                code: 200,
                status: 'success',
                message: 'Login successfully!',
                data: {
                    access_token: createToken({ id: user.id, email: user.email }), 
                    email: user.email, 
                    username: user.username 
                }
            });
        } catch (error) {
            next(error);
        }
    }


    static async verify(request, response, next) {
        const { data } = request.body;

        try {
            if (!data || data === "") throw ({ name: `EmptyData`, origin: 'UserController' });

            let email = decryptData(data);
            
            let user = await User.findOne({ 
                where: { 
                    [Op.and]: [
                        { email }, 
                        { status: 0 }, 
                        { emailVerifiedAt: null }
                    ]
                } 
            });
        

            if (!user) throw ({ name: `Unauthenticated`, origin: 'UserController' });

        
            await user.update({
                status: 1,
                emailVerifiedAt: new Date()
            });

            response.status(200).json({ 
                code: 200,
                status: 'success',
                message: 'Email successfully verified'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;