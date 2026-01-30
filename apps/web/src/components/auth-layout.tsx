const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="min-w-md p-6 border rounded-xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
