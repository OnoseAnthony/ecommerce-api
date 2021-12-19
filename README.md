# ecommerce-api
- Backend rest api with node and express JS to handle e-commerce operations

# Description
- This repo covers all that is needed to build a functional ecommerce web backend api [Application Programming Interface].
- It covers authentication [/register /login] and protecting of the routes using Json Web Token(JWT) and ExpressJWT so only verified users can access endpoints.
- it covers CRUD operations related to Categories, Products, and Orders as well as endpoints for inventory management and statistics. 

# SCHEMA/MODELS MONGOOSE[ATLAS DB]
- USER
- PRODUCTS
- CATEGORIES
- ORDERS
- ORDERITEMS

# EXPRESS ROUTERS
- userRouter
- productRouters
- categoryRouter
- orderRouter

# LIBRARIES
- See package.json file in repo

# NEED TO KNOWS
- The ecommerce api repo is a standard structure for anyone looking to start learning NodeJS
- The repo can be cloned easily and will run without much changes to the files
- PS: You should know that in the project a .env file which wasn't commited to git was used. Make sure to create yours in the root directory of your project.
- PS: The uploads folder as seen in code files wasn't commited to git. Make sure to create yours in the root directory of your project.
- PS: No test was written for the project as at the time of adding the ReadMe. Do well to check the repo just incase it was added on a later date.

# Roadmap
- The following features are good to haves and can be added by anyone who's interested in making this better;
  - Add Test Files
  - Add router Documentation
  - Create a mobile and/or web application to consume routes
  - Upload to Server

