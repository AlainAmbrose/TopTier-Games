# COP4331 POOSD Large Project - Group 8

Check the projects tab for a roadmap of tasks

## Steps for Heroku Deployment

1. Start by pulling from the main branch of the GitHub repo and **unit testing your code locally**.
   `git checkout main`
   `git pull`

2. Push your branch up to GitHub and make a pull request.
   **_There should be a button to the right of your branch on GitHub that allows you to "Comapre and Pull Request" _**
   `git add .`
   `git commit -m "some meaningful message"`
   `git push`

3. Create a remote connection to Heroku
   **_Only necessary for innitial push_**
   `heroku git:remote -a poosd-large-project-group-8`

4. Push to main on Heroku
   `git push heroku main`

5. Go to https://poosd-large-project-group-8-1502fa002270.herokuapp.com/ to see your changes reflected on the server
