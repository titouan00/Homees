"use client";

import React from "react";
import {
  Building2,
  Wrench,
  Clock,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
          title="Biens gérés"
          value="12"
          trend="up"
          change="+2"
        />
        <StatCard
          icon={<Wrench className="h-6 w-6 text-blue-600" />}
          title="Interventions"
          value="48"
          trend="up"
          change="+5"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          title="En attente"
          value="3"
          trend="down"
          change="-2"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          title="Artisans"
          value="24"
          trend="up"
          change="+3"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        <RecentActivities />
        <UpcomingInterventions />
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, change }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="bg-blue-100 p-3 rounded-full">{icon}</div>
        {trend && (
          <div
            className={`flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trend === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="text-sm ml-1">{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-4">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}

function RecentActivities() {
  const activities = [
    {
      title: "Nouvelle intervention planifiée",
      description: "Plomberie - 123 Rue de la Paix",
      time: "Il y a 2 heures",
    },
    {
      title: "Intervention terminée",
      description: "Électricité - 45 Avenue des Fleurs",
      time: "Il y a 5 heures",
    },
    {
      title: "Nouveau bien ajouté",
      description: "Appartement - 78 Boulevard Central",
      time: "Hier",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <ActivityItem key={index} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className="bg-blue-100 p-2 rounded-full">
        <Clock className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{activity.title}</h3>
        <p className="text-sm text-gray-600">{activity.description}</p>
        <span className="text-xs text-gray-500">{activity.time}</span>
      </div>
    </div>
  );
}

function UpcomingInterventions() {
  const interventions = [
    {
      title: "Maintenance chaudière",
      location: "123 Rue de la Paix",
      date: "Demain, 10:00",
      status: "confirmed",
    },
    {
      title: "Réparation climatisation",
      location: "45 Avenue des Fleurs",
      date: "23 Mars, 14:30",
      status: "pending",
    },
    {
      title: "Inspection électrique",
      location: "78 Boulevard Central",
      date: "25 Mars, 09:00",
      status: "confirmed",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Interventions à venir</h2>
      <div className="space-y-4">
        {interventions.map((intervention, index) => (
          <InterventionItem key={index} intervention={intervention} />
        ))}
      </div>
    </div>
  );
}

function InterventionItem({ intervention }) {
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full ${
        intervention.status === "confirmed" ? "bg-green-100" : "bg-yellow-100"
      }`}>
        <Wrench className={`h-4 w-4 ${
          intervention.status === "confirmed" ? "text-green-600" : "text-yellow-600"
        }`} />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{intervention.title}</h3>
        <p className="text-sm text-gray-600">{intervention.location}</p>
        <span className="text-xs text-gray-500">{intervention.date}</span>
      </div>
    </div>
  );
}

export default Dashboard;
