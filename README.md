<h1> Node-OTP-Authentication</h1>

### Deployed API URL :- 

https://node-otp-auth.onrender.com/

### Postman Documentation URL :- 

https://documenter.getpostman.com/view/12887398/2s93m1a4WC

###  Routes/ End Points :-

Base URL :- https://node-otp-auth.onrender.com/

1. /api/v1/users/register


- This is a POST request.
- Name and email will be passed as req.body.
- All the required fields such as name and email should not be empty
- User can Register themselves using their name and email ID.
- If the entered email is already exists then it will throw an error.


2. /api/v1/users/generate-otp


- This is a POST request.
- Email should not be empty
- Only registered users are allowed.
- There is a minimum of 1 minute gap between two OTP generate request from an user.
- Hashing the OTP and storing in the DB.
- Every time a new OTP is generated, system will update the existing otp else create a new otp for the user.
- generated OTP will be sent in the mail using nodemailer.
- OTP is valid for 5 minutes only. Not after that.


3. /api/v1/users/login


- This is a POST request.
- Only the registered users are allowed.
- Email and OTP fields should not be empty
- OTP once used can not be reused
- 5 consecutive wrong OTP will block the user account for 1 hour. The login can be reattempted only after an hour.
- If user account is blocked, then preventing them from logging In and also showing the remaining time after which they can reattempt.
- If user is not blocked and OTP is available for that user then validating the OTP whether it is matching with the OTP stored in DB.  And if it matches then resetting the OTP and failed attempt count and then sending a JWT token as a response.



</ol><h2>Tools/Technologies Used</h2>
<hr><ul>
<li>Node.JS</li>
</ul><ul>
<li>Express.JS</li>
</ul><ul>
<li>PostMan</li>
</ul><ul>
<li>MongoDB</li>
</ul>
<ul>
<li>EJS</li>
</ul>

<hr>

## How To Use :-

#### Step 1 :- Clone the repo

```
git clone https://github.com/SahilMund/OTP_based_Authentication.git
```

#### Step 2 :- To install the dependencies

```
npm install
```

#### Step 3 :- setup the dotenv file and then to run the application

```
npm start
```

#### Step - 4 :- To check the API response

```
- Use Postman
- Import the Json file present in postman folder to postman
- Check the API response
- Application will be running on the defined PORT
```

## Dotenv file content :-

```
# FOR NODEMAILER , USER EMAIL AND PASSWORD
TRANSPORTER_USER_EMAIL =  <Enter nodemailer user email>
TRANSPORTER_USER_PASSWORD = <Enter nodemailer password>

# Port
PORT = <Enter PORT>

# JWT Secret key
JWT_SECRET_KEY = <Enter JWT Secret>

# MongoDB configs
DB_NAME = <Enter DB Name>
MONGO_URL = <Enter your Mongo URL>

```

## Folder Structure :-

```
.gitignore
README.md
config
   |-- mongoose.js
   |-- nodeMailer.js
controllers
   |-- index.js
   |-- userController.js
index.js
mailers
   |-- send-otp-mailer.js
models
   |-- Otp.js
   |-- User.js
   |-- index.js
package-lock.json
package.json
routes
   |-- api
   |   |-- index.js
   |   |-- v1
   |   |   |-- index.js
   |   |   |-- users.js
   |-- index.js
views
   |-- mailTemplate
   |   |-- otp_mail.ejs

```
