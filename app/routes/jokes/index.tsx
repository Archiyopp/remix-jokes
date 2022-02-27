import { Joke } from '@prisma/client';
import { Link, LoaderFunction, useLoaderData, useCatch } from 'remix';
import { db } from '~/utils/db.server';

type LoaderData = {
  joke: Joke;
};

export let loader: LoaderFunction = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });

  if (!randomJoke) {
    throw new Response('No random joke found', {
      status: 404,
    });
  }

  return { joke: randomJoke };
};

export default function JokesIndexRoute() {
  const { joke } = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{joke.content}</p>
      <Link to={joke.id}>"{joke.name}" Permalink</Link>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        There are no jokes to display.
      </div>
    );
  }
  throw new Error(
    `Unexpected caught response with status: ${caught.status}`
  );
}
export function ErrorBoundary() {
  return <div className="error-container">I did a whoopsies.</div>;
}
