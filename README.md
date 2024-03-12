This repository contains frontend codes of the web application.

This UI created using ReactJS and it use some API requests to communicate with backend.

First version of this project is created using HTML, CSS & JS which is available [here](https://github.com/Super7000/Time_Table_Designer)

Backend Code is created using Java. It use genetic algorithm to create a time table.

Backend codes is available [here](https://github.com/srideep-banerjee/TimeTableScheduler-Backend)

# How to use this UI?

First you have to add all the subjects on **Subjects tab**.
To add a subject you need to enter all the required values:
1. **subject name** - the unique subject code or name
2. **semester** - the class or semester in which the subject is taken
3. **classroom** - the room no where the class will be taken (you can add multiple classroom spearated using "`;`")
4. **lecture count** - number of classes of that subject is need to take in a week
5. **subject type (check box)** - if the subject is practical then check it either uncheck it

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/8d69579c-2e02-4807-b9cc-c07da418e096)

After adding all the subject next you have to add Teachers on **Teachers tab**.
To add a teacher you need to enter all the required values:
1. **teacher name** - teacher name which is have to be a unique
2. **subjects** - type all the subject names seprated using semicolon **"`;`"** (subject must need to be present in subjects tab)
3. **available time** - teacher when is available to take classes (you can add it using time selector ui or type it manually in the input box)

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/73982b93-8874-48fb-80c5-45eb6396b01d)

After adding all the subjects and teachers you can generate the time table from Time Tables tab.
**To generate the time table** click on `Auto fill using AI` button. Also you can manually fill the time table to fill manually first you have to click on Fill Manually button then click on periods after that a popup will appear and from there you can select the subject and teacher for that period, you can also do this after using the Auto fill using AI method.

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/c57bdb33-bd2d-49f0-b67f-5730ecf42a64)

After generating the time table you can use the features of Dashboard Tab from where you can see the time tables for a particular teacher also you can see how long a perticular teacher is busy taking classes per day in hours.
![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/f0e196d2-b2fb-4d42-bc61-6ba337d9a524)

If you want to customize time table more like defining when will be breaks for each semesters, number of periods per day, number of section per semester etc. then you can do that from Time Table Structure Tab but we currently recommend to avoid using this feature beacause it is not tested yet.

Also we have included files or states by using this feature you can create multiple files of teachers, subjects & time tables you can create a new file also delete a file from Files Tab. You can open or change the files from the top left side of the page and also you can see the currently open or used file. To change a state or file you only have to select that file from the drop down.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
