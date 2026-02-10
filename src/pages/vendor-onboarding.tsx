import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/trust/vendor-onboarding",
    permanent: false,
  },
});

export default function VendorOnboardingRedirect() {
  return null;
}
