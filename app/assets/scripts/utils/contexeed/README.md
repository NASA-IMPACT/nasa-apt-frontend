# Contexeed

Contexeed can be used to create a reducer and actions to manage api calls.

**More documentation to come**

```js
// Values returned by useContexeedApi
const {
  /* All the request thunks defined in the config */
  [requestThunks]
  /* All the mutation thunks defined in the config */
  [mutationThunks]
  /* Function to invalidate the state and set it as the initial value */
  invalidate,
  /* Function to get the appropriate state, using a key if contexeed was configured to use a key */
  getState,
  /* The raw reducer state */
  rawState,
  /* Reducer dispatch function */
  dispatch
} = useContexeedApi(options);
```

All the options accepted by useContexeedApi() can be found in `types.ts` under `ContexeedApiConfig`

## Example

```js
  const { getState, fetchAll, fetchOne, deleteOne } = useContexeedApi({
    name: 'myData',
    requests: {
      fetchAll: () => ({
        url: '/example'
      }),
      fetchOne: (id) => ({
        url: `/example/${id}`
      })
    },
    mutations: {
      deleteOne: (id) => ({
        mutation: async ({ axios, requestOptions, state, actions }) => {
          try {
            // Dispatch request action. It is already dispatchable.
            actions.request();

            await axios({
              ...requestOptions,
              url: `/example/${id}`,
              method: 'delete'
            });

            return actions.receive(newData);
          } catch (error) {
            // Dispatch receive action. It is already dispatchable.
            return actions.receive(null, error);
          }
        }
      })
    }
  });
```