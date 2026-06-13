import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/hc/safetyframework/vendor-onboarding",
    permanent: false,
  },
});

export default function VendorOnboardingRedirect() {
  return null;
}
