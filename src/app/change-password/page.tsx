import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Layout from "@/components/Layout";
import ChangePassword from "@/components/ChangePassword";

export default async function ChangePasswordPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <Layout title="Account Security">
      <div className="flex justify-center mt-12">
        <ChangePassword />
      </div>
    </Layout>
  );
}
