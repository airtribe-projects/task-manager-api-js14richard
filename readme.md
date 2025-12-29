# Task Manager API (In-Memory CRUD)

This project is a simple Task Manager REST API built with Express.js.\
It demonstrates in-memory CRUD operations, input validation, error
handling, filtering, sorting, and priority management without using a
database.

All data is stored in memory, so tasks are lost when the server
restarts.


## API Endpoints

### Create Task

**POST /tasks**

Body:


{
  "title": "Create Project",
  "description": "Build task manager",
  "completed": false,
  "priority": "high"
}

------------------------------------------------------------------------

### Get All Tasks

**GET /tasks**

Optional Query Params: - completed=true - sort=asc \| sort=desc

Example:

    /tasks?completed=true&sort=desc

------------------------------------------------------------------------

### Get Task by ID

**GET /tasks/:id**

Example:

    /tasks/1

------------------------------------------------------------------------

### Update Task

**PUT /tasks/:id**

Body:

``` json
{
  "completed": true,
  "priority": "medium"
}
```

------------------------------------------------------------------------

### Delete Task

**DELETE /tasks/:id**

------------------------------------------------------------------------

### Get Tasks by Priority

**GET /tasks/priority/:level**

Levels: low, medium, high

Example:

    /tasks/priority/high

