const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harshudai@jklu.edu.in',
        subject: 'Thanks for joining in',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const securityM = (email,text)=>{
    sgMail.send({
        to:email,
        from: 'harshudai@jklu.edu.in',
        subject: 'This is yours Security OTP',
        text: `Security OTP : - <h1> ${text} </h1>`
    })
}

const cancelEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'harshudai@jklu.edu.in',
        subject: 'Sorry so to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.` 
    })
}

const feedbackMail = (email,text)=>{
    sgMail.send({
        to: 'harshudai2001@gmail.com',
        from: email,
        subject: 'Your feedback from Code Collector',
        text: text
    })
}

module.exports={
    sendWelcomeEmail,
    cancelEmail,
    securityM,
    feedbackMail
}