import React, { useEffect, useState } from 'react';
import { Building2, Wrench, Clock, Users, ArrowUp, ArrowDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Property {
  id: string;
  title: string;
  address: string;
  type: string;
  status: string;
}

interface Intervention {
  id: string;
  title: string;
  description: string;
  status: string;
  date: string;
  property: Property;
}

function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    address: '',
    type: 'apartment',
  });

  useEffect(() => {
    // Initial fetch
    fetchProperties();
    fetchInterventions();

    // Set up real-time subscriptions
    const propertiesSubscription = supabase
      .channel('properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, fetchProperties)
      .subscribe();

    const interventionsSubscription = supabase
      .channel('interventions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'interventions' }, fetchInterventions)
      .subscribe();

    return () => {
      propertiesSubscription.unsubscribe();
      interventionsSubscription.unsubscribe();
    };
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des propriétés');
      console.error('Error fetching properties:', error);
    }
  };

  const fetchInterventions = async () => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select(`
          *,
          property:properties(*)
        `)
        .order('date', { ascending: true })
        .limit(5);

      if (error) throw error;
      setInterventions(data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des interventions');
      console.error('Error fetching interventions:', error);
    }
  };

  const addProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('properties')
        .insert([
          {
            ...newProperty,
            status: 'active',
          },
        ]);

      if (error) throw error;

      setIsAddingProperty(false);
      setNewProperty({ title: '', address: '', type: 'apartment' });
      toast.success('Propriété ajoutée avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout de la propriété');
      console.error('Error adding property:', error);
    }
  };

  const deleteProperty = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Propriété supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
          title="Biens gérés"
          value={properties.length.toString()}
          trend="up"
          change="+2"
        />
        <StatCard
          icon={<Wrench className="h-6 w-6 text-blue-600" />}
          title="Interventions"
          value={interventions.length.toString()}
          trend="up"
          change="+5"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-blue-600" />}
          title="En attente"
          value={interventions.filter(i => i.status === 'pending').length.toString()}
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

      {/* Properties Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Mes Propriétés</h2>
          <button
            onClick={() => setIsAddingProperty(true)}
            className="btn-primary px-4 py-2 rounded-lg text-white flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter</span>
          </button>
        </div>

        {isAddingProperty && (
          <form onSubmit={addProperty} className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Titre"
                value={newProperty.title}
                onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Adresse"
                value={newProperty.address}
                onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <select
                value={newProperty.type}
                onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="apartment">Appartement</option>
                <option value="house">Maison</option>
                <option value="commercial">Local commercial</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setIsAddingProperty(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary px-4 py-2 rounded-lg text-white"
              >
                Ajouter
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div key={property.id} className="card bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <p className="text-gray-600 text-sm">{property.address}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                    {property.type}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {/* Implement edit */}}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => deleteProperty(property.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Interventions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Interventions récentes</h2>
        <div className="space-y-4">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                intervention.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <Wrench className={`h-4 w-4 ${
                  intervention.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{intervention.title}</h3>
                <p className="text-sm text-gray-600">{intervention.property.address}</p>
                <span className="text-xs text-gray-500">
                  {new Date(intervention.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
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
          <div className={`flex items-center ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            <span className="text-sm ml-1">{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-4">{value}</h3>
      <p className="text-gray-600">{title}</p>
    </div>
  );
}

export default Dashboard;