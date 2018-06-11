# Build distributed api service

*Create network*

``
docker network create nodenetwork
``

``
docker network ls
``

*Prepare db*

``
sudo apt-get install mongodb-clients
``

``
mongo localhost/mydb
``

``
use node
db.createUser(
  {
    user: "test",
    pwd: "test",
    roles: [
       { role: "readWrite", db: "node" }
    ]
  }
)
``

*Run db container*

``
mkdir ~/data
``

``
docker run -d -p 27017:27017 -v ~/data:/data/db --net=my-node-network --name=node-db mongo
``

*Build image for node application*

``
docker build -f Dockerfile -t node-api:1.0 .
``

*Start container*

``
docker run -d -p 3001:4000 --name=api --net=my-node-network -e "db=mongodb://test:test@node-db:27017/node" node-api:1.0
``

*Monitoring*

``
docker network inspect my-node-network
``

``
docker exec -ti  {container_id} bash
``

``
docker logs {container_id}
``

Logs output should be:

> nodeAPI@1.0.0 start /app
> nodemon index.js "$db"

> [nodemon] 1.17.5
> [nodemon] to restart at any time, enter `rs`
> [nodemon] watching: *.*
> [nodemon] starting `node index.js mongodb://test:test@db1:27017/node`
> Server running at: http://localhost:4000
> db ok



