# TopTier

Check the projects tab for a roadmap of tasks

## Steps for Heroku Deployment

1. Start by pulling from the main branch of the GitHub repo and **unit testing your code locally**.

   `git checkout main`

   `git pull`

2. Push your branch up to GitHub and make a pull request.

   **There should be a button to the right of your branch on GitHub that allows you to "Comapre and Pull Request" \_**

   `git add .`

   `git commit -m "some meaningful message"`

   `git push`

3. Create a remote connection to Heroku

   **_Only necessary for innitial push_**

   `heroku git:remote -a poosd-large-project-group-8`

4. Push to main on Heroku

   `git push heroku main`

5. Go to https://www.toptier.games/ to see your changes reflected on the server


## Steps for tailwind installment

1. start by installing tailwind css

   `npm install tailwindcss postcss autoprefixer`

2. Generate Tailwind Configuration File

`   npx tailwindcss init`

3. Configure for tailwind in the tailwind.config.json. It should look like this:

   <!-- /** @type {import('tailwindcss').Config} */
   module.exports = {
   content: [
      "./src/**/*.{js,jsx,ts,tsx}",
   ],
   theme: {
      extend: {},
   },
   plugins: [],
   } -->

4. Configure the app.css file to look like this:

   <!-- @import 'tailwindcss/base';
   @import 'tailwindcss/components';
   @import 'tailwindcss/utilities'; -->

5. Include Your Tailwind CSS File in the Project. In your React project, you should have an entry file like index.js or App.js. Import the Tailwind CSS file there:

   `import './tailwind.css';`
