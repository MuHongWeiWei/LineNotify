const express = require('express')
const axios = require('axios')
const router = express.Router()
require('dotenv').config()

const {LINE_CLIENT_ID, LINE_CLIENT_SECRET, LINE_REDIRECT_URI} = process.env
let nowToken = ""

router.get('/', (req, res) => {
    res.render('notify', {LINE_CLIENT_ID, LINE_REDIRECT_URI})
})

router.post('/', async (req, res) => {
    const {code} = req.body

    try {
        const response = await axios.post('https://notify-bot.line.me/oauth/token',
            `grant_type=authorization_code&code=${code}&client_id=${LINE_CLIENT_ID}&client_secret=${LINE_CLIENT_SECRET}&redirect_uri=${LINE_REDIRECT_URI}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )

        const {access_token} = response.data
        nowToken = access_token
        res.redirect('http://localhost:3000/notify/push')
    } catch (error) {
        console.error(error);
    }
})

router.get('/push', (req, res) => {
    res.render('notifyPush')
})

router.post('/push', async (req, res) => {
    const { message } = req.body

    try {
        const response = await axios.post('https://notify-api.line.me/api/notify',
            `message=${message}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${nowToken}`
                }
            }
        );

        console.log('訊息已成功發送:', response.data);
    } catch (error) {
        console.error('發送訊息時發生錯誤:', error);
    }
})

module.exports = router
