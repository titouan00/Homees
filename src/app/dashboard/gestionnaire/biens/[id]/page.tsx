"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, House, CurrencyEur, CircleNotch } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase-client";
import { TYPES_BIEN, TYPES_CHAUFFAGE, DPE_CLASSES, STATUTS_OCCUPATION } from "@/types/propriete";

export default function DetailBienGestionnairePage() {
  const router = useRouter();
  const params = useParams();
  const bienId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [bien, setBien] = useState<any>(null);

  useEffect(() => {
    const fetchBien = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("propriete")
        .select("*")
        .eq("id", bienId)
        .single();
      if (!error && data) {
        setBien(data);
      }
      setLoading(false);
    };
    if (bienId) fetchBien();
  }, [bienId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <CircleNotch className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Chargement du bien...</span>
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="p-8 text-center text-gray-600">Bien introuvable.</div>
    );
  }

  const typeBien = TYPES_BIEN.find((t) => t.value === bien.type_bien)?.label || bien.type_bien;
  const statutOccupation = STATUTS_OCCUPATION.find((s) => s.value === bien.statut_occupation)?.label || bien.statut_occupation;
  const chauffage = TYPES_CHAUFFAGE.find((c) => c.value === bien.chauffage_type)?.label || bien.chauffage_type;
  const dpe = DPE_CLASSES.find((d) => d.value === bien.dpe_classe)?.label || bien.dpe_classe;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <button
        className="flex items-center text-emerald-600 hover:text-emerald-800 mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Retour
      </button>
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <House className="h-7 w-7 text-emerald-500" />
        Détail du bien
      </h1>
      <div className="text-gray-500 mb-6 flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        {bien.adresse}, {bien.ville} {bien.code_postal}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Type</div>
          <div className="font-medium text-gray-900">{typeBien}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Statut</div>
          <div className="font-medium text-gray-900">{statutOccupation}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Surface</div>
          <div className="font-medium text-gray-900">{bien.surface_m2} m²</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Nombre de pièces</div>
          <div className="font-medium text-gray-900">{bien.nb_pieces}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Chambres</div>
          <div className="font-medium text-gray-900">{bien.nb_chambres}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Salles de bain</div>
          <div className="font-medium text-gray-900">{bien.nb_salles_bain}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Étage</div>
          <div className="font-medium text-gray-900">{bien.etage}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Ascenseur</div>
          <div className="font-medium text-gray-900">{bien.ascenseur ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Balcon</div>
          <div className="font-medium text-gray-900">{bien.balcon ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Terrasse</div>
          <div className="font-medium text-gray-900">{bien.terrasse ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Parking</div>
          <div className="font-medium text-gray-900">{bien.parking ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Cave</div>
          <div className="font-medium text-gray-900">{bien.cave ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Meublé</div>
          <div className="font-medium text-gray-900">{bien.meuble ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Chauffage</div>
          <div className="font-medium text-gray-900">{chauffage}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Année construction</div>
          <div className="font-medium text-gray-900">{bien.annee_construction}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Classe DPE</div>
          <div className="font-medium text-gray-900">{dpe}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Loyer indicatif</div>
          <div className="font-medium text-gray-900">{bien.loyer_indicatif} €</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Charges mensuelles</div>
          <div className="font-medium text-gray-900">{bien.charges_mensuelles} €</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Taxe foncière</div>
          <div className="font-medium text-gray-900">{bien.taxe_fonciere} €</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Copropriété</div>
          <div className="font-medium text-gray-900">{bien.copropriete ? "Oui" : "Non"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Charges copropriété</div>
          <div className="font-medium text-gray-900">{bien.charges_copropriete} €</div>
        </div>
      </div>
    </div>
  );
} 