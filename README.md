# FRC Time bot.
This is a bot for WhatsApp.
# How to run:
1. Change `config.example.json` to `config.json` and fill up the file. [Readme](#ignores)
2. Run `npm install`
3. Run `npm start`
4. Scan the QR code with your WhatsApp.
5. Enjoy!

## License 
This code is under MIT license.



## changes
You are more than welcome to change the code and make pull requests.

# Notes:
Need any help?
Send me a discord message

## Ignores
if you want the bot to ignore someone
in config.json put their number, I did it so rn it ignores 1 person, if you want to ignore it more than 1 person do it:
go to config.json add a comma, then new line and paste this: `"ignore2": "+12345678910"`
then go to index.js to line 36, then add in the if after `config.ignore` add this `config.ignore2` (you can do this process to multiple peoples. just change the `ignore2` to `ignore3` etc...).