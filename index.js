const { Client } = require('whatsapp-web.js');
const axios = require('axios');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const qr = require('qrcode-terminal');
const config = require('./config.json');

const validTeamNumbers = [
  1, 33, 67, 111, 118, 125, 148, 254, 302, 359, 624, 1114, 1619, 2056
]; // List of teams that will be checked for every minute and if it is in the hour then it will send the message (with the district teams)
const district = '2023isr'; // District name in TBA (e.g., '2019fim' for FIM District in 2019)

const client = new Client();
client.on('qr', (qrCode, resolve) => {
  console.log('QR Code received, please scan it.');
  qr.generate(qrCode, { small: true }); // generates QR code
});

client.on('authenticated', (session) => {
  console.log('Authenticated.');
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready.');
  // Schedule the bot to send messages every minute
  schedule.scheduleJob('* * * * *', () => {
    console.log('Checking for FRC teams...');
    sendFRCTeamForCurrentTime();
  });
});

client.initialize();

// Function to fetch FRC Team information from The Blue Alliance based on current time
async function sendFRCTeamForCurrentTime() {
  try {
    // Get the current time in your desired timezone
    const currentTime = moment().tz(config.timezone);

    // Format the current time as 'HHmm' (e.g., '1937' for 19:37)
    let formattedTime = currentTime.format('HHmm');

    // Remove leading zeros only if the hour is less than 10
    formattedTime = formattedTime.replace(/^0(?=[1-9])/, '');

    // Specify the list of valid team numbers

    // Check if the formatted time corresponds to one of the specified times
    if (formattedTime === '0411') {
      // Special case: Set the time for team 3388
      formattedTime = '3388';
    } else if (formattedTime === '2117') {
      // Special case: Set the time for team 7112
      formattedTime = '7112';
    } else if (formattedTime === '0752') {
      // Special case: Set the time for team 9303
      formattedTime = '9303';
    } else if (formattedTime === '0014') {
      // Special case: Set the time for team 5990
      formattedTime = '5990';
    }

    // Check if the team number is in the specified district's team keys list
    const districtTeamsUrl = `https://www.thebluealliance.com/api/v3/district/${district}/teams/keys`;
    const districtTeamsResponse = await axios.get(districtTeamsUrl, {
      headers: {
        'X-TBA-Auth-Key': config.tbapi,
      },
    });

    const districtTeamsKeys = districtTeamsResponse.data;

    if (!districtTeamsKeys.includes(`frc${formattedTime}`) && !validTeamNumbers.includes(parseInt(formattedTime))) {
      console.log(`FRC Team ${formattedTime} is not in the specified district, or it is not a valid team number.`);
      return;
    }

    const apiUrl = `https://www.thebluealliance.com/api/v3/team/frc${formattedTime}`;

    const response = await axios.get(apiUrl, {
      headers: {
        'X-TBA-Auth-Key': config.tbapi,
      },
    });

    const teamData = response.data;

    if (!teamData.team_number) {
      console.log('No FRC team found for the current time.');
      return;
    }

    const groupId = config.WGP;
    // Format and send the team information as needed
    const message = `FRC Team: ${teamData.nickname}. \n Team Number: ${teamData.team_number}`;
    sendMessageToGroup(groupId, message);
    sendMessageToGroup(groupId, translatedMessage);
  } catch (error) {
    console.error('Error fetching FRC team data:', error);
  }
}

// Function to send a WhatsApp message to a group
function sendMessageToGroup(groupId, message) {
  client.sendMessage(groupId, message);
  console.log('Message sent successfully to group:', groupId);
}
