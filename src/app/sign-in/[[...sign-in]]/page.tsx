import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex min-h-svh w-screen items-center justify-center p-4">
      <SignIn />
    </main>
  );
};

export default SignInPage;
