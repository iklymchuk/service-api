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
docker exec -ti api bash
``

``
docker logs api
``

# Testing
*HEALTHCHECK*

``
HEALTHCHECK --interval=5s --timeout=10s --retries=3 CMD curl -sS localhost:4000 || exit 1
``

and check the status of API service

``
docker inspect api | jq '.[].State.Health'
``

output should be:

```json
{
  "Status": "healthy",
  "FailingStreak": 0,
  "Log": [
    {
      "Start": "2018-06-12T10:13:18.741893926+03:00",
      "End": "2018-06-12T10:13:18.799996008+03:00",
      "ExitCode": 0,
      "Output": "API service up and running"
    },
    {
      "Start": "2018-06-12T10:13:23.800141532+03:00",
      "End": "2018-06-12T10:13:23.869154994+03:00",
      "ExitCode": 0,
      "Output": "API service up and running"
    },
    {
      "Start": "2018-06-12T10:13:28.869299375+03:00",
      "End": "2018-06-12T10:13:28.926994914+03:00",
      "ExitCode": 0,
      "Output": "API service up and running"
    },
    {
      "Start": "2018-06-12T10:13:33.927135854+03:00",
      "End": "2018-06-12T10:13:33.993611212+03:00",
      "ExitCode": 0,
      "Output": "API service up and running"
    },
    {
      "Start": "2018-06-12T10:13:38.993717829+03:00",
      "End": "2018-06-12T10:13:39.060921116+03:00",
      "ExitCode": 0,
      "Output": "API service up and running"
    }
  ]
}
```

*Goss*

add Goss to the Dockerfile

``
RUN curl -fsSL https://goss.rocks/install | sh
``

and we can test use goss:

~~~bash
docker exec -ti api goss -g test/goss/infrastructure.test.yaml validate
~~~

``
docker exec -ti api goss -g test/goss/infrastructure.test.yaml validate
``





