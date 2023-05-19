
<h1> Node-OTP-Authentication</h1>


### Theme :-
```
1. generate OTP
User will send his email address (which also acts as the login id) in the request body
backend will generate an OTP and send it back to the user provided certain conditions are met. The conditions that need to be met are listed below. 


2. Login API
User will send his email address and OTP in the request body
If OTP is valid then generate a new JWT token and send it back to the user


Important Conditions:
OTP once used can not be reused
OTP is valid for 5 minutes only. Not after that.
5 consecutive wrong OTP will block the user account for 1 hour. The login can be reattempted only after an hour.
There should be a minimum 1 min gap between two generate OTP requests. 


```

### Routes :-


1. /api/v1/users/register

```
- This is a POST request.
- All the required fields such as username,email,password,name should not be empty
- User should not be able to register if he is already a registered user
- Only Unregistered users can register

```
2. /api/v1/users/generate-otp

```
- This is a POST request.
- Username and password should not be empty
- Email/Password should match correctly with the details present in the db
- If the user logged in successfully, then we are creating a JWT token for the user to use it for accessing protected routes.

```
3. //api/v1/users/login

```
- This is a POST request.
- Only the logged In doctors can access this route to register a new patient as it is a protected route
- Name and Phone fields should not be empty
- Phone number should be a valid number
- If the Patient already exists, then send them the patient info with the message 'already exists'
- Only unregistered patients details can be registered
```

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

<hr>

## How To Use :-

####    Step 1 :-  Clone the repo
 
 ```
git clone https://github.com/SahilMund/OTP_based_Authentication.git
 ```
####    Step 2 :- To install the dependencies

```
npm install
```

#### Step 3 :- To run the application
```
npm start
```

#### Step - 4 :- To check the API response

```
- Use Postman
- Import the Json file present in postman folder to postman 
- Check the API response

```

## Dotenv file cotent :-

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


```
