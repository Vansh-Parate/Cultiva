import React, { useState } from "react";
import { FaLeaf, FaSun, FaMoon, FaPlus } from "react-icons/fa";
import DashboardHeader from "~/components/DashboardHeader";
import Sidebar from "~/components/Sidebar";
import Feed from "~/components/widgets/Feed";
import PlantsGrid from "~/components/widgets/PlantsGrid";
import Stats from "~/components/widgets/Stats";
import TodaysTasks from "~/components/widgets/TodaysTasks";


const Dashboard = () => {
  return(
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className='flex-1 flex flex-col'>
        <DashboardHeader />
        <main className='p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <section className="col-span-2">
            <PlantsGrid />
          </section>
          <section>
            <TodaysTasks />
            <Stats />
          </section>
          <section className="col-span-3">
            <Feed />
          </section>
        </main>
      </div>
    </div>
  )
};

export default Dashboard;
