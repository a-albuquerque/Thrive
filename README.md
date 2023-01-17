# Thrive

## Development requirements
* Node
* Expo-cli by `npm i -g expo-cli`
* Python3
* Navigate to directory: `HappinessApp-Django/` and run `pip3 install -r requirement.txt`

## Steps to run the app on a phone simulator
* Install an iOS/Android simulator
* Navigate to directory: `HappinessApp-ReactNative/`
* `npm install`
* `npm start`
* Open the simulator through the popped webpage

## Code structure
The codebase is organized in 2 main directories.

### Backend

**HappinessApp-Django** Containes the django based backend code.

Django files are organized following a django standard convention.

The django application is hosted on the PythonAnywhere server at https://thriveapp.pythonanywhere.com

To run a local host,
* `python3 manage.py makemigrations`
* `python3 manage.py migrate`
* `python3 manage.py runserver`

### Frontend

**HappinessApp-ReactNative** Containes the React Native front end code.

React Native app is organized following a React Native standart conventions.

App is structured using React Navigations: Screens are located in their folder.

The entire app is wrapped around the Networking context. This context is responsible for most of the networking calls to the backend, as well as caching the useful data.


### Note

There is a limitation to that expo publishing though. While working perfectly on Android devices, regular iOS user will not be able to use the QR-code of the app (Apple enforced policy). 

To use the QR-code of the app, user will need to login using expo `happyuapp` account. This will allow developers to test the app on their iOS devices. However, since *sharing the `happyuapp` account to anyone outside the devteam is a potential security issue*, this allows testing to be done only within the devteam. 

In future, to begin beta and alpha testing and make it available for both Android and iOS devices you will need to use the platform specific beta testing tools.

For iOS, it is an Apple developed TestFlight App.