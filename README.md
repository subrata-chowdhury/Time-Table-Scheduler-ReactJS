
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

![312138576-8d69579c-2e02-4807-b9cc-c07da418e096-min](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/2b2a246a-bdab-4bc6-af93-352a854e4246)

After adding all the subject next you have to add Teachers on **Teachers tab**.
To add a teacher you need to enter all the required values:
1. **teacher name** - teacher name which is have to be a unique
2. **subjects** - type all the subject names seprated using semicolon **"`;`"** (subject must need to be present in subjects tab)
3. **available time** - teacher when is available to take classes (you can add it using time selector ui or type it manually in the input box)

![312138964-73982b93-8874-48fb-80c5-45eb6396b01d-min](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/47108007-647e-40ae-8443-4c6e6fe30271)

After adding all the subjects and teachers you can generate the time table from Time Tables tab.
**To generate the time table** click on `Auto fill using AI` button. Also you can manually fill the time table to fill manually first you have to click on Fill Manually button then click on periods after that a popup will appear and from there you can select the subject and teacher for that period, you can also do this after using the Auto fill using AI method.

![312140181-c57bdb33-bd2d-49f0-b67f-5730ecf42a64-min](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/ff595167-449d-475a-9dcf-f005e68008d9)

After generating the time table you can use the features of Dashboard Tab from where you can see the time tables for a particular teacher also you can see how long a perticular teacher is busy taking classes per day in hours.

![312139840-f0e196d2-b2fb-4d42-bc61-6ba337d9a524-min](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/edebdf5c-eb1e-48d0-ab93-bf8fdd6ce93f)

If you want to customize time table more like defining when will be breaks for each semesters, number of periods per day, number of section per semester etc. then you can do that from Time Table Structure Tab but we currently recommend to avoid using this feature beacause it is not tested yet.

Also we have included files or states by using this feature you can create multiple files of teachers, subjects & time tables you can create a new file also delete a file from Files Tab. You can open or change the files from the top left side of the page and also you can see the currently open or used file. To change a state or file you only have to select that file from the drop down.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
