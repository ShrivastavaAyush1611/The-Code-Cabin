import { getAllProblems } from "@/app/modules/problems/actions";
import ProblemTablePage from "@/app/modules/problems/components/ProblemTable";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const ProblemsPage = async () => {
  const user = await currentUser();
  let dbUser = null;
  if (user) {
    dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { id: true, role: true },
    });
  }
  const { data: problems, error } = await getAllProblems();
  // console.log(problems);
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading problems: {error}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="container mx-auto py-32">
        <ProblemTablePage problems={problems} user={dbUser} />
      </div>
    </div>
  );
};

export default ProblemsPage;
