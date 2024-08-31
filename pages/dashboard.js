'use client'

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

import ResidentGatePass from "@/components/ResidentGatePass";
import StaffView from "@/components/StaffView";
import VisitorView from "@/components/VisitorView";

const Dashboard = () => {
  const {data: session, status} = useSession()
  const router = useRouter();
  const [current, setCurrent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);

  return (
    <>
      <Header title="Dashboard" session={session} status={status} router={router} />
      <main className="bg-gray-100 min-h-screen text-gray-600">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome, {session?.user.name}</p>
          </div>
          <div className="px-4 sm:px-0">
            {session?.user?.role == 'resident' && (
              <>
                <ResidentGatePass session={session} />
              </>
            )}
            {session?.user?.role == 'visitor' && (
              <>
                <VisitorView session={session} />
              </>
            )}
            {session?.user?.role == 'staff' && (
              <>
                <StaffView session={session} />
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard;
