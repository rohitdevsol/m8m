import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex flex-col justify-center items-center min-h-svh gap-6 p-6 md:p-10 ">
      <div className="flex flex-col w-full max-w-md p-6 gap-6">
        <Link
          href={"/"}
          className="flex items-center justify-center gap-3 self-center font-medium text-lg"
        >
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          m8m
        </Link>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
