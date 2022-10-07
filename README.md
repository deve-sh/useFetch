# `useFetch` - A Simple hook-based fetcher and caching implementation

### Features

- Reactivity Baked In
- Caching of data cross-app
- Realtime updates cross-app
- Options to revalidate data on mount and on focus of browser
- Fallback Data support for server-side rendering
- Conditional Fetching
- Global Config Provider
- Global Config Retreival Hook

### Good to haves but not a part of the bundle yet

- Error Retries

### Usage

#### Simple Usage

```typescript
useFetch(
    key: string | null,
    options?: {
        revalidateOnMount?: boolean,
        revalidateOnFocus?: boolean,
        dedupingInterval?: milliseconds,
        fallbackData?: any,
        fetcher?: (key: string) => Promise<any>;
	    dedupingInterval?: number;
	    onSuccess?: (data: any, key: string | null, config: options) => any;
	    onError?: (error: Error, key: string | null, config: options) => any;
    }
)
```

```javascript
import useFetch from "use-fetch";

const Component = () => {
	const { data, error, isValidating, revalidate } = useFetch("/api/v1/data");

	if (isValidating) return "Loading";
	if (error) return `Error: ${error.message}`;
	return (
		<>
			Data: {data}
			<Button onClick={() => revalidate()}>Refetch</Button>
		</>
	);
};
```

#### Revalidation

Use

```javascript
revalidate(newDate?: any, refetchFromAPI?: boolean)
```

Every revalidation fetches data from the API in the background, you can disable that by passing false as the second argument.

```javascript
const { data, revalidate } = useFetch("/api/v1/data");

revalidate(); // Just make the API call again and populate the cache
revalidate(localData); // Set the data and cache to localData, but make API Call in the background to update with real data. Like Optimistic Rendering
revalidate(localData, false); // Set the data and cache to localData and do not make an API Call in the background
```

#### Config Provider

For multiple useFetch hooks, it's cumbersome to pass config/options to each of them separately. Hence, `use-fetch` comes with a `FetchProvider` context provider to share the config among all hooks.

```typescript
import { FetchProvider } from "use-fetch";

return (
	<FetchProvider
		value={{
			revalidateOnMount: boolean,
			revalidateOnFocus: boolean,
			dedupingInterval: number(milliseconds),
			fallback: Record<string, any>,
			fetcher: (key) => any,
			dedupingInterval: number,
		}}
	>
		... All components containing useFetch hooks
	</FetchProvider>
);
```

#### Global Config Hook

Retrieve the global config for your fetcher hooks using the `useFetchConfig` hook.

```typescript
import { useFetchConfig } from "use-fetch";

const {
	revalidate,
	fetcher,
	fallback,
	cache,
	dedupingInterval,
	revalidateOnMount,
	revalidateOnFocus,
} = useFetchConfig();

// This revalidate works differently.
// It takes 3 args instead of 2.
revalidate(
    keyOfFetcherYouWantToUpdate,
    localData?,
    refetchFromAPI?
);
```

#### Fallback Data for SSR/SSG

```javascript
const key = "/api/v1/data";

const Page = ({ fallbackData }) => {
	const { data } = useFetch(key, { fallbackData: fallbackData[key] });

	// or
	return (
		<FetchProvider value={{ fallback: fallbackData }}>
			{/* 
            All hooks internally would either use their on fallback data or the fallback data from the above provider corresponding to their keys. 
        */}
			...
		</FetchProvider>
	);
};

export const getStaticProps = async () => {
	const data = await fetchData(key);
	return { props: { fallbackData: { [key]: data } } };
};

export default Page;
```

#### Handling errors and success

Use the `onSuccess` and `onError` handlers for handling the completion and error-ing of the API Calls.

```javascript
useFetch("/api/v1/data", {
	onSuccess: (data, key, config) => {
		console.log("Data fetched:", data);
	},
	onError: (error, key, config) => {
		console.log("Error while fetching:", error);
	},
});
```

Or you could use reactivity to your advantage.

```javascript
useEffect(() => {
	if (data !== undefined) console.log("Data fetched:", data);
}, [data]);

useEffect(() => {
	if (error !== undefined) console.log("Error while fetching:", error);
}, [error]);
```
