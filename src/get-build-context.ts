/*
 * Copyright Digital Optimization Group LLC
 * 2019 - present
 */
const uuid = require("uuid");
const cookie = require("cookie");
const querystring = require("querystring");

const argsToString = (args: Args) => {
  return Object.keys(args)
    .map(key => `${key}_${args[key]}`)
    .sort()
    .join(".");
};

type BuildContext = {
  projectId: string;
  gifLoggerUrl: string;
};

type Args = { [key: string]: string };
type PreCacheManifest = {
  [key: string]: Array<{ queryName: string; args: Args }>;
};

type ResolverQuery = {
  queryName: string;
  userId: string;
  args: Args;
};

const cache = (projectId: string) => {
  const resolver = async ({ userId, queryName, args }: ResolverQuery) => {
    return Promise.resolve([
      `${queryName}_${argsToString(args)}`,
      await fetch(
        // we know project-id when we build this thing
        `https://api-${projectId}.edgeyates.com/resolve-feature/${queryName}?userId=${userId}&args=${encodeURIComponent(
          JSON.stringify(args)
        )}`
      )
        .then(data => data.json())
        .catch(err => {
          console.log(err);
        })
    ]);
  };
  const prepareCmsCache = (
    pathname: string,
    userId: string,
    preCacheManifest: PreCacheManifest
  ) => {
    if (preCacheManifest[pathname]) {
      return Promise.all(
        preCacheManifest[pathname].map(({ queryName, args }) => {
          return resolver({
            userId,
            queryName,
            args
          });
        })
      ).then(features => {
        // filter out any errors
        return features
          .filter(([featureId, feature]) => feature.assignment)
          .reduce((acc, item) => {
            return {
              ...acc,
              [item[0]]: item[1]
            };
          }, {});
      });
    }
    return Promise.resolve({});
  };
  return { resolver, prepareCmsCache };
};

export const getContext = async (event: any, buildContext: BuildContext) => {
  const request = event.request;
  const { pathname, search } = new URL(request.url);
  const { headers } = request;
  const cookies = cookie.parse(headers.get("Cookie") || "");
  const userId = cookies["_vq"] || headers.get("request-id");
  const params = querystring.parse(search.split("?")[1] || "");

  const { resolver, prepareCmsCache } = cache(buildContext.projectId);

  const context = {
    gifLoggerUrl: buildContext.gifLoggerUrl,
    userId: uuid(),
    requestId: uuid(),
    params,
    cookies,
    cookie,
    resolver,
    prepareCmsCache,
    pathname,
    headers,
    projectId: buildContext.projectId,
    logger: async (logLine: any) => {
      console.log();
      console.log(JSON.stringify(logLine, null, 4));
    },
    color: "localhost"
  };

  return context;
};
