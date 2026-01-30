import SignupForm from "@/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

const Page = async () => {
  await requireUnauth();
  return (
    <div>
      <SignupForm />
    </div>
  );
};

export default Page;
