import React from 'react'
import { auth } from "@clerk/nextjs/server";

async function DashboardPage() {

     await auth.protect();

  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage