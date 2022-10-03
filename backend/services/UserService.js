import bcrypt from "bcrypt";
import {
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
    ADMIN_USERNAME,
    CREATE_USER,
    DEFAULT_USER_CALORIE_LIMIT,
    getEnvironmentVariable,
    NODEMAILER_EMAIL,
    NODEMAILER_PASSWORD,
    SALT_ROUNDS,
    UPDATE_USER,
    UserRoles
} from "../utils/Constants.js";
import {User} from "../models/User.js";
import {generate as passwordGenerator} from "generate-password";
import nodemailer from 'nodemailer'

export async function createOrUpdateUser(request, command) {
    const username = request.body.username
    console.log(`${command} request for : ${username}`)
    let user
    if (command === CREATE_USER) {
        const userDocument = {
            "username": username,
            "password": await bcrypt.hash(request.body.password, SALT_ROUNDS),
            "name": request.body.name,
            "email": request.body.email,
            "calorieLimit": request.body.calorieLimit ? request.body.calorieLimit : DEFAULT_USER_CALORIE_LIMIT
        }
        user = await User.create(userDocument)
    } else if (command === UPDATE_USER) {
        user = await getUserByUsername(username)
        user.password = request.body.password ? await bcrypt.hash(request.body.password, SALT_ROUNDS) : user.password
        user.name = request.body.name ? request.body.name : user.name
        user.email = request.body.email ? request.body.email : user.email
        user.calorieLimit = request.body.calorieLimit ? request.body.calorieLimit : user.calorieLimit
        user = await user.save()
    }
    return user
}

export async function getUserByEmail(email) {
    return await User.findOne({email}).exec()
}

export async function getUserByUsername(username) {
    return await User.findOne({username}).exec()
}

export async function verifyAndGetUser(username, password) {
    const user = await getUserByUsername(username)
    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password)
        return isValidPassword ? user : null
    }
    return null
}

export async function createAdminUser() {
    const username = getEnvironmentVariable(ADMIN_USERNAME)
    const admin = await getUserByUsername(username)
    const password = getEnvironmentVariable(ADMIN_PASSWORD)
    const email = getEnvironmentVariable(ADMIN_EMAIL)
    if (!admin) {
        const adminUser = {
            "username": username,
            "name": "CalTrack Admin",
            "password": await bcrypt.hash(password, SALT_ROUNDS),
            "email": email,
            "calorieLimit": DEFAULT_USER_CALORIE_LIMIT,
            "role": UserRoles.Admin,
            "verified": true
        }
        await User.create(adminUser)
    } else {
        admin.password = await bcrypt.hash(password, SALT_ROUNDS)
        admin.email = email
        await admin.save()
    }
}

export async function createUserAndSendInvitation(request) {
    const inviter = await getUserByUsername(request.params.username)
    const username = request.body.email
    const password = passwordGenerator({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
        strict: true
    })
    const email = request.body.email
    const name = request.body.name
    const user = {
        "username": username,
        "name": name,
        "password": await bcrypt.hash(password, SALT_ROUNDS),
        "email": email,
        "calorieLimit": DEFAULT_USER_CALORIE_LIMIT
    }
    await User.create(user)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: getEnvironmentVariable(NODEMAILER_EMAIL),
            pass: getEnvironmentVariable(NODEMAILER_PASSWORD)
        }
    })
    const mailOptions = {
        from: getEnvironmentVariable(NODEMAILER_EMAIL),
        to: email,
        subject: `${inviter.name} has invited you to CalTrack`,
        html: `<p>Hi ${name},</p>
                <p>${inviter.name} has invited you to use CalTrack app. An account is created for you and you can 
                log in to the app using the below crendentials : </p>
                <p><b>Username:</b> ${username}</p>
                <p><b>Password:</b> ${password}</p>`
    }
    const info = await transporter.sendMail(mailOptions)
    console.log(`Invitation sent to ${email} :`, info)
}

export async function deleteUser(request) {
    await User.deleteOne({username: request.params.username})
}