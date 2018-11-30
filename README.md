# fullstackboilerplater
This application is a node.js application that is deployed on heroku and it's code base lies here in github. There is a continuous integration setup that has been done between this code base and heroku. 
Any other user other that 'fs-projects' has to create a null request in a new branch and then commit the changes with proper comments. The commit will be reviewed before merging to the master branch. Once reviewed, the change will automatically be deployed to heroku in staging app after which it will be tested and post that moved to production.
