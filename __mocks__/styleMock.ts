const handler: ProxyHandler<object> = {
  get: (_target, prop) => String(prop),
};
export default new Proxy({}, handler);
