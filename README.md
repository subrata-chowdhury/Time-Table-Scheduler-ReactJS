
This repository contains frontend codes of the web application.

This UI created using ReactJS and it use some API requests to communicate with backend.

First version of this project is created using HTML, CSS & JS which is available [here](https://github.com/Super7000/Time_Table_Designer)

Backend Code is created using Java. It use genetic algorithm to create a time table.

Backend codes is available [here](https://github.com/srideep-banerjee/TimeTableScheduler-Backend)

# How to use this UI?

First you have to add all the subjects on **Subjects tab**.
To add a subject you need to enter all the required values:
1. **Subject Name** - the unique subject code or name
2. **Semester** - the class or semester in which the subject is taken
3. **Classroom** - the room no where the class will be taken (you can add multiple classroom pressing enter key after typing each classroom)
4. **Lecture Count** - number of classes of that subject is need to take in a week
5. **Subject Type (check box)** - if the subject is practical then check it either uncheck it

![Screenshot 2024-03-24 111251](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/878b02d5-627d-45d6-8e64-54f6c64635f1)

After adding all the subject next you have to add Teachers on **Teachers tab**.
To add a teacher you need to enter all the required values:
1. **Teacher Name** - teacher name which is have to be a unique
2. **Subjects** - type all the subject names pressing enter key after typing each subject (subject must need to be present in subjects tab)
3. **Available Time** - when teacher is available to take classes (if you leave it blank means you did't select any time then it will be consider as teacher is available all the time)

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/6f26fb32-e45e-4bd6-b7ee-d025f0a29c89)

After adding all the subjects and teachers you can generate the time table from Time Tables tab.
**To generate the time table** click on `Auto fill using AI` button. Also you can manually fill the time table to fill manually first you have to click on Fill Manually button then click on periods after that a popup will appear and from there you can select the subject and teacher for that period (you can select multiple teachers but only one subject can be selected), you can also do this after using the Auto fill using AI method.

![Screenshot 2024-03-24 112131](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/e399201a-411d-419c-b9f0-dd1a8cce946a)
![Screenshot 2024-03-24 112249](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/a3b97581-c8c7-4fb6-8544-717de9dc27bb)

After generating the time table you can use the features of Dashboard Tab from where you can see the time tables for a particular teacher also you can see how long a perticular teacher is busy taking classes per day in hours.

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/98edcade-54cd-4928-8e9a-4ec2e40a9207)

If you want to customize time table more like defining when will be breaks for each semesters, number of periods per day, number of section per semester etc. then you can do that from Time Table Structure Tab but we currently recommend to avoid using this feature beacause it is not tested yet.

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/3779ae9a-f85f-4325-b1a4-816f2e3fba87)

Also we have included files or states by using this feature you can create multiple files of teachers, subjects & time tables you can create a new file also delete a file from Files Tab. You can open or change the files from the top left side of the page and also you can see the currently open or used file. To change a state or file you only have to select that file from the drop down.

![image](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/dec280d9-ca38-4163-955f-e681cab5aeac)

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
