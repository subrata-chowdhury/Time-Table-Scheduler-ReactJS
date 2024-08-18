This repository contains frontend codes of the web application.

This UI created using ReactJS and it use some API requests to communicate with backend.

First version of this project is created using HTML, CSS & JS which is available [here](https://github.com/Super7000/Time_Table_Designer)

Backend Code is created using Java. It use genetic algorithm to create a time table and uses a Browser Compoent to show the UI.

Bowser Component code is avaliable [here](https://github.com/srideep-banerjee/TTSBrowserComponent)
Backend codes is available [here](https://github.com/srideep-banerjee/TimeTableScheduler-Backend)

# How to set up the project (without any released version of this app)?

**Step 1:**
First Fork this repositories:<br/>
[Time-Table-Creator-ReactJS (UI)](https://github.com/Super7000/Time-Table-Creator-ReactJS) <br/>
[TTSBrowserComponent (Browser Component)](https://github.com/srideep-banerjee/TTSBrowserComponent) <br/>
[TimeTableScheduler-Backend (Bankend Java Code)](https://github.com/srideep-banerjee/TimeTableScheduler-Backend) <br/>

**Step 2:**
Then use Intellij IDEA or any other framework to build a jar file of the TTSBrowserComponent.

**Step 3:**
Then copy the jar file of TTSBrowserComponent to Forked TimeTableScheduler-Backend's main directory.

![TimeTableScheduler-Backend-Main-Directory](https://github.com/Super7000/Time-Table-Creator-ReactJS/assets/86580414/ceab5a00-2620-4746-bdb9-92ac73caa114)

**Step 4:**
Now open forked Time-Table-Creator-ReactJS and build the product using command like `npm run build`

**Step 5:**
Then Copy the build product to TimeTableScheduler-Backend's `web` directory. **(If web directory is not present in TimeTableScheduler-Backend then create one)**

**Step 6:**
Now you just need to run the TimeTableScheduler-Backend's `main.java` file using Intellij IDEA or any code editor or framework.


# How to use this UI?

First you have to add all the subjects on **Subjects tab**.
To add a subject you need to enter all the required values:
1. **Subject Name** - the unique subject code or name
2. **Semester** - the class or semester in which the subject is taken
3. **Classroom** - the room no where the class will be taken (you can add multiple classroom pressing enter key after typing each classroom) *(don't forget to press enter after typing the classroom)*
4. **Lecture Count** - number of classes of that subject is need to take in a week *(default value **4**)*
5. **Subject Type** - if the subject is practical or theory *(default value **theory**)*
6. **Should be Taken by Teacher or Not** - if subject is taken by teacher then make it yes either make it no *(default value **yes**)*

![Subjects-Tab](https://github.com/user-attachments/assets/0ec3cefa-8d20-4ccf-978d-219350fc9028)


After adding all the subject next you have to add Teachers on **Teachers tab**.
To add a teacher you need to enter all the required values:
1. **Teacher Name** - teacher name which is have to be a unique
2. **Subjects** - type all the subject names pressing enter key after typing each subject (subject must need to be present in subjects tab)
3. **Available Time** - when teacher is available to take classes (if you leave it blank means you did't select any time then it will be consider as teacher is available all the time)

![Teachers-Tab](https://github.com/user-attachments/assets/7f1d99b0-2593-42f4-a65f-ce89fd8909a2)


After adding all the subjects and teachers you can generate the time table from Time Tables tab.
**To generate the time table** click on `Auto fill using AI` button. Also you can manually fill the time table.
# These are the Constraints that are used in our AI system to generate the time table:
**Hard (Mandatory) Constraints include :**
1. One practical subject class per week
2. All teachers alloted within availability
3. Subjects alloted their required no. of lectures in all sections
4. Practical subjects not allocated same room at same time
5. Two teachers not teaching a semester-section same subject (theory only)
6. Two teachers/subject not at a semester-section at same time (theory only)
7. Teachers only teaching one semster-section at a time
8. Practical subjects assigned consecutive periods
9. Practical teachers must be available during all practical subjects
10. All teachers assigned atleast one subject in a section class
11. All teachers get assigned subjects known to them
12. Theory teachers also teaching practical
13. Teachers count for practical class equals lecture count

**Soft (Preffered) Constraints include :**
1. Practical Lab in end of second half

# How to use fill manually feature
**1.** You have to click on Fill Manually button then<br/>
**2.** Click on periods after that a popup will appear and <br/>
**3.** From there you can select the subject and teacher for that period *(you can select multiple teachers but only one subject can be selected)*, <br/>
you can also use this feature after using the Auto fill using AI method.

![TimeTable-Tab](https://github.com/user-attachments/assets/12d11d72-7b17-43cd-9929-667a039d8b71)

![TimeTable-FillManuallyPopUp](https://github.com/user-attachments/assets/ad66b5ac-9fb5-44c6-9b1d-7cf847946b7f)


After generating the time table you can use the features of Dashboard Tab from here you can see
1. The time tables for a particular teacher
2. You can see how many classes a perticular teacher is busy taking classes per day in class unit *(for theory the value is 1 and for practical the value is 3)*.
3. You can see Total number of<br/>
    i. *Subjects*<br/>
    ii. *Teachers*<br/>
    iii. *Practical Subjects*<br/>
    iv. *Theory Subjects*<br/>
    v. *Subjects (Taken By Teachers)*<br/>
    vi. *Subjects (Not Taken By Teachers)*<br/>

![Dashboard-Tab](https://github.com/user-attachments/assets/81b69ca5-730f-4a31-9314-cc8e45752148)

If you want to customize time table more like defining when will be breaks for each semesters, number of periods per day, number of section per semester etc. then you can do that from Time Table Structure Tab.

![Time-Table-Structure-Tab](https://github.com/user-attachments/assets/1b4f99b4-c42d-4f39-9b96-aa44ee87e574)


Also we have included files or states by using this feature you can create multiple files of teachers, subjects & time tables you can create a new file also delete a file from Files Tab. You can open or change the files from the top left side of the page and also you can see the currently open or used file. To change a state or file you only have to select that file from the drop down.

![Files-Tab](https://github.com/user-attachments/assets/5a2f8d9d-e985-4dd8-b1cc-280edff8fbe3)


# Report a Bug
If you encounter any bug please try to contact us from the **contact us** tab.<br/>
In contact us tab you can find our emails and other platforms links from there you can contact us <br/>
*(Please try to explain the bug in details and try to provide screenshorts)* <br/>
**Also there might be some cases that UI don't show data at all because of token mismatch (for data security purpose) then you can just wait 4-5 seconds then reload the page using right click,<br/>
If this did't solve the problem then try to switch between tabs or restart the application.**

![ContactUs-Tab](https://github.com/user-attachments/assets/10761c94-c056-45e7-8516-dacbb40ffdda)



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
