
How to set up and run the prototype??


Step 1: Fetching the files required to run the prototype using command “ git clone https://github.com/Ashwin454/IBY-s-Chatmaster ”. This command will get a folder named “IBY-s-Chatmaster”.

Step 2: Get inside the “IBY-s-Chatmaster” folder and there you see 2 folders inside it
1)	Backend
2)	Chatmaster
3)	
Step 3: First get inside backend folder and run command “ npm install “. This will install all the dependencies required to run backend.

Step 4: Then get inside chatmaster folder and run command “ npm install “. This will install all the dependencies required to run frontend.

Step 5: It would be helpful if these folders are opened in two different terminals.

Step 6: Ensure that there are no processes running on ports 27017(for MongoDb), 8000(for backend) and 3000(for frontend). 

Step 7: Now we run command “nodemon server.js ” in backend folder and firt “npm run build ” and then “npm start” in chatmaster folder.

Step 8: Now we type “ localhost:3000 ” on the browser and we get to see the application.
