import { GetServerSideProps } from "next";

export default function RootRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const searchParams = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (typeof value === "string") {
      searchParams.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((v) => searchParams.append(key, v));
    }
  });

  const destination = searchParams.toString()
    ? `/home?${searchParams.toString()}`
    : "/home";

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};
