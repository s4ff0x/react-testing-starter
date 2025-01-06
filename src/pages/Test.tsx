import { useQuery } from "react-query";

type RepoData = {
  name: string;
  description: string;
};

export const useTest = () => {
  return useQuery<RepoData, Error>(
    "repoData",
    () =>
      new Promise<RepoData>((resolve, reject) => {
        reject(123);
        setTimeout(() => {
          resolve({
            name: "react-testing-vite",
            description: "This is a test repository",
          });
        }, 10);
      }),
  );
};

export function Test() {
  const { isLoading, error, data } = useTest();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>"An error has occurred: " + error.message</div>;

  return (
    <div>
      <h1>{data?.name}</h1>
      <p>{data?.description}</p>
    </div>
  );
}
