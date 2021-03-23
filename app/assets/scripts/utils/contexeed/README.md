# Contexeed

Jump to the end for "real world usage".

Contexeed exports a series of functions that make creating reducers for api responses a breeze. The idea is to reduce the boilerplate of commonly required logic for asynchronous API requests.
That being said there are some assumptions being made.

The following guide will explain those assumptions and how they came to be.  
**This is heavily inspired by [Reduxeed](https://github.com/danielfdsilva/knowledge-center/tree/master/scripts/utils/reduxeed) but to work with React context.

Three different actions get defined for each api reducer:
  - `request/<example>` gets called as soon as the request start, and will be used to signal the state that the request has started.
  - `receive/<example>` is called when the api request finishes. It will be called with an error if anything went wrong with the api.
  - `invalidate/<example>` action is used to reset the state to its original state.

With each of these actions comes an action creator:
```js
  function invalidateExample () {
    return { type: 'invalidate/example' };
  }

  function requestExample () {
    return { type: 'request/example' };
  }

  function receiveExample (data, error = null) {
    return {
      type: 'receive/example',
      data,
      error,
      receivedAt: Date.now()
    };
  }
```

To avoid always creating those functions we have a helper function `makeActions` which takes an object as parameter with the action name and whether we want "key actions" or not. The concept of "key actions" is expanded on later.

The above would be recreated as:
```js
  const exampleActions = makeActions({ name: 'example' });
  // Actions available as:
  // exampleActions.invalidate()
  // exampleActions.request()
  // exampleActions.receive()
```
After having the actions ready you need a reducer to intercept the actions.  
If you were to create one from scratch for our example, it would look something like:

```js
  const initialState = {
    status: 'idle',
    error: null,
    data: null
  };

  function (state = initialState, action) {
    switch (action.type) {
      case 'invalidate/example':
        return initialState;
      case 'request/example': {
        return {
          status: 'loading',
          error: null,
          data: null
        };
      }
      case 'receive/example': {
        return {
          status: 'succeeded' | 'failed',
          receivedAt: action.receivedAt,
          data: action.data,
          error: action.error
        };
      }
    }
    return state;
  };
```

Each and every API state will have the following 5 properties:
  - `status` One of 'idle' | 'loading' | 'succeeded' | 'failed'.
  - `error` Tracks whether a request errored by storing the error.
  - `data` Holds the data send by the request if it was successful.
  - `receivedAt` Timestamp of when the request finished.

To simplify the reducer creation we have a helper function `makeAPIReducer` which takes object as parameter with:
```
{
  name: String            // Name of the actions
  initialState: Object    // Initial reducer state
  baseState: Object       // Object from where to get missing properties
}
```
The `initialState` and `baseState` may be different depending on whether we're using "Key actions" or not.

The above would be recreated as:

```js
  const reducer = makeReducer({ name: 'example' });
```

Once we have the reducer, we can create the thunk that will make the api request.  
The flow of the thunk is something like:
  - Indicate request is started
  - Make the request
  - Return result or error

Following our example, a thunk made from scratch would be:

```js
  function fetchExample () {
    return async function (dispatch) {
      dispatch(exampleActions.request());
      try {
        const response = await axios('http://example.com');
        const result = response.data;
        return dispatch(exampleActions.receive(result));
      } catch (error) {
        return dispatch(exampleActions.receive(null, error));
      }
    };
  }
```

**NOTE:** This thunk assumes that the api requests use the module `axios` 
The helper function `makeRequestThunk`, helps encapsulate all that:

The above is achieved with:
```js
  function fetchExample () {
    return makeRequestThunk({
      url: 'http://example.com',
      requestFn: exampleActions.request,
      receiveFn: exampleActions.receive
    });
  }
```

However the `makeRequestThunk` helper provides many more functionalities.  

You want to use a different method (POST for instance) with a body?  
You can just provide an `options` object, and it will be used by the `axios` module.
```js
  function fetchExample () {
    return makeRequestThunk({
      url: 'http://example.com',
      options: {
        headers: {
          'Authorization': 'Bearer the-bearer-token'
        },
        method: 'POST',
        data: query
      },
      requestFn: exampleActions.request,
      receiveFn: exampleActions.receive
    });
  }
```

Feeling power user?  
If the response from the api does not suit your needs immediately you can also change the response before it is dispatched.
```js
  function fetchExample () {
    return makeRequestThunk({
      url: 'http://example.com',
      mutator: (response) => {
        // In this case we're discarding the body completely and just returning
        // the headers. Unlikely use case, but hey, whatever floats your goat.
        return response.headers;
      },
      requestFn: exampleActions.request,
      receiveFn: exampleActions.receive
    });
  }
```

This `makeRequestThunk` helper function also allows you to check if the data was already fetched so that following requests do not hit the network.  
This cache-like mechanism works by checking a given key of the store for data. If the data is present, the thunk returns it immediately.  
To enable this you need to set `stateKey` to where the data you're requesting would be stored.  

Imagine the following store state:
```js
{
  id1: {},
  id2: {}
}
```

To get data for the `id1` the thunk would be setup like:
```js
  function fetchGlobalConfig () {
    return makeRequestThunk({
      url: 'http://example.com',
      // The stateKey is where in the store the thunk will check for data.
      // If data is available it is returned otherwise is fetched.
      stateKey: 'id1,
      requestFn: globalConfig.request,
      receiveFn: globalConfig.receive
    });
  }
```

### Key Actions
Key actions provide a way of fetching and storing different entries for the same data type.

Imagine we have a blog and we want to fetch individual blog posts.  
The most common approach is to have a reducer and handle a single post at a time.
```
{
  post: // The post content
}
```
Every time we fetch a new post the previous one is gone. If the user goes back to it, a new request has to be made.  
A better way of storing this would be to index the posts by their `id`. Something like:
```
{
  posts: {
    id1: // The post 1
    id2: // The post 2
  }
}
```

This is what "key actions" do. They store whatever piece of data they receive under a key. (in this case the id).  
When creating the actions and the reducer they have to be made aware that a key is coming.
```js
  // The true flag indicates that these will be key actions.
  const postActions = makeActions({ name: 'post', useKey: true });

  // The true flag tells the reducer to expect key actions.
  const reducer = makeAPIReducer({ name: 'post', useKey: true })

  export function fetchPost (key) {
    return makeRequestThunk({
      url: 'http://example.com',
      // The true power of key action comes when you cache the data.
      // In the blog post example, caching the data means that if the user goes
      // back to the same post the data is already available.
      // Now instead of having a fixed state key, it will depend on the key
      // we decide to use.
      stateKey: key,
      // Once actions are defined as key actions, they will accept the key as
      // the first parameter, so we have to bind it to them before passing them
      // to our thunk.
      requestFn: postActions.request.bind(null, key),
      receiveFn: postActions.receive.bind(null, key)
    });
  }
```

### Contexeed API
Now that you understand the different parts that go into Contexeed, the easiest way to use it is through the `createContexeedAPI` helper, which will create all the pieces you need.

```js
// Create a contexeed instance.
const exampleContexeed = createContexeedAPI({ name: 'example', useKey: true });

// Create actions to request data:
const fetchExample = atbdListContexeed.makeRequestAction((id) => ({
  url: `/example/${id}`,
  stateKey: id // Remove if not using "Key actions"
}));

function Component () {
  // Create the state and dispatch functions. This is the same as react's
  // `useReducer` but takes care of initializing the state.
  const [state, dispatch] = useContexeedReducer(atbdListContexeed);

  // Component code. For example:
  useEffect(() => {
    dispatch(fetchExample(10));
  }, []);
}
```
