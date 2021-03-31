interface StateSlice {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  mutationStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  receivedAt: number;
  error: Error | null;
  data: any | null;
}

interface ContexeedRequest {
  /** Url to query */
  url: string;
  /** Options for the request. See `axios` documentation. */
  options: Object;
  /** Path in the state to check for the data. Any format accepted by
   * lodash.get. Controls whether or not the response should be cached. When
   * defined the function will resolve immediately with dispatching the receive
   * action. The request action is not dispatched if there's cached data. */
  stateKey: string | Array<string | number>;
  /** Whether or not to check the state via the stateKey. Sometimes is it useful
   * to have a state key, but do not check it, like for example a POST or DELETE
   * request */
  skipStateCheck: boolean;
  /** Callback to change the response before sending it to the receive function.
   * Called with (response). Defaults to returning the body content. */
  transformResponse?: (response: any, stateSlice: StateSlice) => any;
  /** Manually delay the request by x milliseconds. Useful for dev purposes. */
  __devDelay?: number;
  /** By default we make a request to the api with the given options and then
   * run the response through the transformResponse. Sometimes, however, it may
   * be needed to have complete control over how the request is made. The
   * __overrideData escape hatch allows us to produce the data anyway we need.
   * The returned data will be sent to the receiveFn. Throwing an error causes
   * the request to fail. */
  __overrideData?: (data: {
    /** Axios api with baseurl already set */
    axios: any;
    /** Base request option to pass to axios. Useful when decorator functions
     * like withRequestToken are used. */
    requestOptions: Object;
    /** State matching the given stateKey */
    state: StateSlice;
  }) => any;
}

interface ContexeedMutation {
  /** Path in the state to check for the data. Any format accepted by
   * lodash.get. Controls whether or not the response should be cached. When
   * defined the function will resolve immediately with dispatching the receive
   * action. The request action is not dispatched if there's cached data. */
  stateKey: string | Array<string | number>;
  /** Mutation thunk */
  mutation: (data: {
    /** Axios api with baseurl already set */
    axios: any;
    /** Base request option to pass to axios. Useful when decorator functions
     * like withRequestToken are used. */
    requestOptions: Object;
    /** State matching the given stateKey */
    state: StateSlice;
    /** Dispatchable actions If used, the `request` and `receive` actions will
     * update the internal `mutationStatus` instead of the `status` */
    actions: Object;
    /** The mutation should return an action. This is useful if we want to
     * capture the result of what happened last. It is not mandatory though and
     * depends on the use case */
  }) => any;
}

interface ContexeedApiConfig {
  /** The name of the contexeed. Helpful for logging. */
  name: string;
  /**
   * Whether to use a keyed state. This allows us to store multiple items in
   * the same state under different keys. Useful to store items by id.
   * False by default
   */
  useKey: boolean;
  /** The interceptor is use to modify the action and/or the state before
   * hitting the reducer. Can also be used to respond to custom actions */
  interceptor: (
    state: any,
    action: { type: String }
  ) => { state: any, action: { type: String } };
  /** List of request actions to create */
  requests: { [key: string]: ContexeedRequest };
  /** List of mutation actions to create. Mutations allow us to work with
   * non-get requests when interacting with the api. Because of their potential
   * complexity the whole function has to be written out, unlike the requests
   * that are configured through an object */
  mutations: { [key: string]: ContexeedMutation };
}
