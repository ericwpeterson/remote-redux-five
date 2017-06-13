# Remote-Redux-Five -- A Distributed Redux Micro-Service Example

## Goals

1. Define a standard protocol for communicating to micro-services.
2. Define redux state shape to support a standard communication protocol.

### Motivations
 * Just as redux dev tools is great for UI development, wouldn't it be great to run a similar tool to simulate various conditions on the micro-service layer? In doing so, we can simulate events, instead of altering production code or physical devices.
 * Using redux forces us to write clean and testable code.
 * We can log all actions. If we ever find a bug, reproducing it should only be a matter of playing the log file.
 * Using a standard protocol, allows us to reuse code across applications.  

## Protocol
**_All commands operate in the context of a monobject, which is really just a slice of the redux state tree_**.

 ### Set command
```javascript
serverSocket.on('Set', payload )

payload = {
   monobject: 'mo',
   property: 'color',
   value: 'blue'
}

clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    'op': 'Set::color',    
    error: false
};
```

### Get command
```javascript

serverSocket.on('Get', payload )

payload = {
   monobject: 'mo',
   property: 'color',   
}

clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    'op': 'Get::color',    
    error: false
};
```

### Watch command
```javascript

serverSocket.on('Watch', payload )

payload = {
   monobject: 'mo',
   property: 'color',   
}

//initial response
clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    op: 'Watch::color',    
    error: false
};

//some time later we get the value
clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    op: 'Watch::color',
    value: 'green'    
    error: false
};
```

### UnWatch command
```javascript

serverSocket.on('UnWatch', payload )

payload = {
   monobject: 'mo',
   property: 'color',   
}

clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    op: 'UnWatch::color',    
    error: false
};
```

### Call command
```javascript

serverSocket.on('Call', payload )

payload = {
   monobject: 'mo',
   method: 'myFunction',   
   args: [1,2,3]
}

clientSocket.on('opCompleted', payload )
{
    monobject: 'mo',
    op: 'Call::myFunction',
    value: [3,2,1]
    error: false
};
```

## Redux State Store
**_The client and the server have their own stores. While they might be similar, they are not the same_**.



## Client
**_An example client state tree_**.

```javascript

export const REQUEST = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

{
  monobjects: {
    dog: {
      props: {
        color: {
          value: 'brown',
          state: REQUEST.COMPLETED
        }
      },
      methods: {
        bark: {
          ret: "Arroof",
          state: REQUEST.COMPLETED
        },
        sit: {
          state: REQUEST.INPROGRESS
        },
        rollOver: {
          state: REQUEST.ERROR
        }
      }
    }
  }
}

```

## Server
**_The state tree of this example application_**.
```javascript
{
    "monobjects": {
        "ups": {
            "props": {
                "inputVoltage": 113,
                "outputVoltage": 120
            },
            "methods": {
                "startPolling": {
                    "ret": "return code",
                    "state": "COMPLETED"
                }
            }
        }
    }
}

```

### Reducer Composition
In order to support the protocol reducers should insert there state insided the monobjects tree. In this example ups is reducer. See the source code for more information.

### Get Action Flow
![alt text](getflow.png "Logo Title Text 1")



## Instructions

  Open two terminals.

  In first terminal
  cd server
  npm install
  npm start

  In second terminal
  cd client
  npm install
  webpack-dev-server --host YOUR_IP_ADDRESS

  browser http://IPADDR:8080
