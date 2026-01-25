#Roblox friends graph project

This is a personal project of mine that visualizes Roblox friends as an interactable force-directed graph.

**Tech stack**
* Frontend: React, React Force Graph 3D, Vite
* Backend: Python, Flask, Roblox Cloud API
* Infrastructure: Docker, Docker compose, DigitalOcean Droplet, Nginx

**How to use**

To use the app, you just need to search someone's Roblox username. It will generate a Force 3D graph of all of their friends. You can then click on one of the friend nodes and search for their friends
This expands the graph (and also shows two Roblox users' mutual friends in the middle):
![alt text](image.png)

You can expand the graph as much as you want, and see who is friends with who.
![alt text](image-2.png)

**How to run locally**
1. Run git clone on with the https web url.
2. Make sure you have docker installed!!
3. In the folder that contains `docker-compose.yml`, run `docker compose up --build` in the terminal.
4. Once it is finished building paste `localhost:5173` into a browser tab.

**Note**: this app does not work with privacy browsers like Librewolf.

